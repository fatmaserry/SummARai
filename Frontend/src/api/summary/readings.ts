import { api } from "..";

export const getReadingDataBySummaryId = async (id) => {
  try {
    const response = await api.get(`api/readings/getReading?summary_id=${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}
export const setBookmark = async (summaryId, bookmark) => {
  try {
    const response = await api.post(`api/readings/setBookmark?summary_id=${summaryId}&bookmark=${bookmark}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const addReading = async (summaryId) => {
  try {
    const response = await api.post(`api/readings/addReading?summary_id=${summaryId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const setFinishedSummary = async (id)=> {
  try {
    const response = await api.post(`api/readings/finish?summary_id=${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const getCurrentReadings = async ()=> {
  try {
    const response = await api.get(`api/readings/getContinueReadings`);
    return response.data.content;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const getFinishedReadings = async ()=> {
  try {
    const response = await api.get(`api/readings/getFinishedReadings`);
    return response.data.content;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}