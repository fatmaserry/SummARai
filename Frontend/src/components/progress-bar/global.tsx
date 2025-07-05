import React from "react";
import { useSSE } from "../../provider/context/SSEContext";

const GlobalProgressBar: React.FC = () => {
  const { progress, isProcessing } = useSSE();

  if (!isProcessing) return null;

  return (
    <div
      className="fixed top-4 left-4 w-[280px] max-w-[90vw] h-6 z-[9999] bg-gray-200 rounded shadow-lg flex items-center pointer-events-none"
      style={{ direction: "ltr" }}
    >
      <div
        className="bg-[#765CDE] h-full rounded transition-all duration-300"
        style={{ width: `${progress.percentage}%` }}
      />
      <span className="absolute left-6 top-1 text-xs text-gray-800 font-bold pointer-events-none">
        {progress.message} ({progress.percentage}%)
      </span>
    </div>
  );
};

export default GlobalProgressBar;
