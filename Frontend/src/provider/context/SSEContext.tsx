import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import toast from "react-hot-toast";
import { api } from "../../api";
import { AuthContext } from "../auth/authProvider";
import { addReading } from "../../api/summary/readings";

interface ProgressEvent {
  percentage: number;
  message: string;
}

interface SummaryData {
  id: number;
  title: string;
  summary_url: string;
  number_of_pages: number;
  summaryType: string;
  is_public: boolean;
  creation_time: string | null;
}

interface SSEContextType {
  progress: ProgressEvent;
  summaryResult: SummaryData | null;
  isProcessing: boolean;
  showCompletion: boolean;
  startProcessing: (
    file: File,
    title: string,
    isPublic: boolean
  ) => Promise<void>;
  resetProcessing: () => void;
  closeCompletion: () => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

const STORAGE_KEY = "sse_processing_state";

const saveProcessingState = (state: {
  progress: ProgressEvent;
  summaryResult: SummaryData | null;
  isProcessing: boolean;
  showCompletion: boolean;
}) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadProcessingState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

const clearProcessingState = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const SSEProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useContext(AuthContext);
  const [state, setState] = useState(() => {
    const saved = loadProcessingState();
    return (
      saved || {
        progress: { percentage: 0, message: "" },
        summaryResult: null,
        isProcessing: false,
        showCompletion: false,
      }
    );
  });

  const [controller, setController] = useState<AbortController | null>(null);

  // Ensure new objects for nested state (progress) to trigger re-render
  const updateState = useCallback((newState: Partial<typeof state>) => {
    setState((prev) => ({
      ...prev,
      ...newState,
      progress: newState.progress
        ? { ...newState.progress }
        : { ...prev.progress },
    }));
  }, []);

  // Persist state to localStorage when state changes
  useEffect(() => {
    saveProcessingState(state);
  }, [state]);

  const resetProcessing = useCallback(() => {
    if (controller) {
      controller.abort();
    }
    setController(null);
    setState({
      progress: { percentage: 0, message: "" },
      summaryResult: null,
      isProcessing: false,
      showCompletion: false,
    });
    clearProcessingState();
  }, [controller]);

  useEffect(() => {
    // Clean up if user logs out
    if (!user) {
      resetProcessing();
    }
    // eslint-disable-next-line
  }, [user]);

  const closeCompletion = useCallback(() => {
    updateState({ showCompletion: false });
  }, [updateState]);

  const startProcessing = useCallback(
    async (file: File, title: string, isPublic: boolean) => {
      if (!file || !title) {
        toast.error("Please select a file and enter a title");
        return;
      }

      updateState({
        isProcessing: true,
        progress: { percentage: 0, message: "Starting processing..." },
        summaryResult: null,
        showCompletion: false,
      });

      const ctrl = new AbortController();
      setController(ctrl);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("is_public", isPublic ? "1" : "0");
        formData.append("title", title);

        await api.post("/summarai/summarize", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchEventSource("http://localhost:8080/summarai/events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: ctrl.signal,

          onopen: async (response) => {
            if (response.ok) {
              return;
            }
            throw new Error(`SSE connection failed: ${response.status}`);
          },

          onmessage: async (event) => {
            try {
              const rawData = event.data;
              console.log(rawData);
              if (!rawData || rawData.trim() === "") return;

              if (rawData === "done") {
                updateState({
                  progress: {
                    percentage: 100,
                    message: "Processing complete",
                  },
                  isProcessing: false,
                  showCompletion: true,
                });
                return;
              }

              let jsonString = rawData;
              if (rawData.startsWith("data: ")) {
                jsonString = rawData.substring(6).trim();
                console.log(jsonString);
              }

              jsonString = jsonString
                .replace(/[“”]/g, '"')
                .replace(/[‘’]/g, "'")
                .replace(/\\/g, "");

              const eventData = JSON.parse(jsonString);
              console.log(eventData);

              if (eventData.percentage !== undefined) {
                console.log(eventData);
                updateState({
                  progress: {
                    percentage: Math.min(
                      100,
                      Math.max(0, eventData.percentage)
                    ),
                    message: eventData.message || "Processing...",
                  },
                });
              } else if (eventData.id) {
                // add summary to user readings
                const res = await addReading(eventData.id);
                if (res) {
                  updateState({
                    summaryResult: eventData,
                    isProcessing: false,
                    showCompletion: true,
                    progress: {
                      percentage: 100,
                      message: "Processing complete",
                    },
                  });
                } else {
                  updateState({
                    progress: {
                      percentage: 0,
                      message: "Error processing data",
                    },
                    isProcessing: false,
                    showCompletion: true,
                  });
                }
              }
            } catch (e) {
              console.error("Error parsing event:", e, "Raw data:", event.data);
            }
          },

          onerror: (err) => {
            if (err.message !== "Aborted") {
              toast.error(err.message || "Connection error");
            }
            updateState({ isProcessing: false });
            ctrl.abort();
          },

          onclose: () => {
            updateState({ isProcessing: false });
          },
        });
      } catch (error) {
        toast.error(error.message || "An error occurred");
        updateState({ isProcessing: false });
        ctrl.abort();
      }
    },
    [token, user, updateState]
  );

  // Reconnect on page refresh if processing was ongoing
  useEffect(() => {
    const reconnectIfNeeded = async () => {
      if (state.isProcessing && token) {
        try {
          const ctrl = new AbortController();
          setController(ctrl);

          await fetchEventSource("http://localhost:8080/summarai/events", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: ctrl.signal,

            onopen: async (response) => {
              if (response.ok) {
                // SSE reconnection established
                return;
              }
              throw new Error(`SSE connection failed: ${response.status}`);
            },

            onmessage: async (event) => {
              try {
                const rawData = event.data;
                if (!rawData || rawData.trim() === "") return;

                if (rawData === "done") {
                  updateState({
                    progress: {
                      percentage: 100,
                      message: "Processing complete",
                    },
                    isProcessing: false,
                    showCompletion: true,
                  });
                  return;
                }

                let jsonString = rawData;
                if (rawData.startsWith("data: ")) {
                  jsonString = rawData.substring(6).trim();
                }

                jsonString = jsonString
                  .replace(/[“”]/g, '"')
                  .replace(/[‘’]/g, "'")
                  .replace(/\\/g, "");

                const eventData = JSON.parse(jsonString);

                if (eventData.percentage !== undefined) {
                  updateState({
                    progress: {
                      percentage: Math.min(
                        100,
                        Math.max(0, eventData.percentage)
                      ),
                      message: eventData.message || "Processing...",
                    },
                  });
                } else if (eventData.id) {
                  // add summary to user readings
                  const res = await addReading(eventData.id);
                  if (res) {
                    updateState({
                      summaryResult: eventData,
                      isProcessing: false,
                      showCompletion: true,
                      progress: {
                        percentage: 100,
                        message: "Processing complete",
                      },
                    });
                  } else {
                    updateState({
                      progress: {
                        percentage: 0,
                        message: "Error processing data",
                      },
                      isProcessing: false,
                      showCompletion: true,
                    });
                  }
                }
              } catch (e) {
                console.error(
                  "Error parsing event:",
                  e,
                  "Raw data:",
                  event.data
                );
              }
            },

            onerror: (err) => {
              if (err.message !== "Aborted") {
                toast.error("Failed to reconnect. Please try again.");
              }
              updateState({ isProcessing: false });
              ctrl.abort();
            },
          });
        } catch (error) {
          updateState({ isProcessing: false });
          toast.error("Failed to reconnect to processing");
        }
      }
    };

    reconnectIfNeeded();

    return () => {
      if (controller) {
        controller.abort();
      }
    };
    // eslint-disable-next-line
  }, [token]);

  return (
    <SSEContext.Provider
      value={{
        progress: state.progress,
        summaryResult: state.summaryResult,
        isProcessing: state.isProcessing,
        showCompletion: state.showCompletion,
        startProcessing,
        resetProcessing,
        closeCompletion,
      }}
    >
      {children}
    </SSEContext.Provider>
  );
};

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
};
