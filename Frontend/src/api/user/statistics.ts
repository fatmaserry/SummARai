import { api } from "..";
export const getUserStatistics = async () => {
  try {
    const response = await api.get(`api/statistics/summaryGenre`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const getTotalStatistics = async () => {
  try {
    const response = await api.get(`api/statistics/summary`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const getActivityStatistics = async () => {
  try {
    const response = await api.get(`api/statistics/activity`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}

export const updateUserStatistics = async () => {
  try {
    const response = await api.put(`api/statistics/update`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
}