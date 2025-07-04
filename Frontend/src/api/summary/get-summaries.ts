import { api } from "..";

// Get Summary PDF
export const getSummaryById = async (id) => {
  try {
    const response = await api.get(`api/books/summary/${id}`, {
      responseType: "arraybuffer", // Critical for binary data
    });
    return response;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

// Get Meta Data of Summary
export const getBook = async (id) => {
  try {
    const response = await api.get(`api/books/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

// Get Current User Summaries
export const getUserSummaries = async () => {
  try {
    const response = await api.get(`api/books/mySummaries`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

export const fetchAllBooks = async (page = 0, size = 50) => {
  try {
    const response = await api.get(`api/books/get_all`, {
      params: { page, size },
    });
    return response.data.content;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

export const getAllGenres = async () => {
  try {
    const response = await api.get(`api/books/allGenres`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};
