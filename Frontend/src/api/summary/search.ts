import axios from "axios";
import { api } from "..";

export const searchBooks = async (criteria: any, page = 0, size = 20) => {
  try {
    const response = await api.post(`/api/books/search`, criteria, {
      params: { page, size },
    });
    return response;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

export const getBooksByTitle = async (title: string, page = 0, size = 10) => {
  try {
    const response = await api.get("/api/books", {
      params: { title },
    });
    return response;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

export const getBooksByAuthor = async (author: string, page = 0, size = 10) => {
  try {
    const response = await api.get("/api/books", {
      params: { author, page, size },
    });
    return response;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};

export const getBooksByGenre = async (genre, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `/api/books/genre?genre=${genre}&page=${page}&size=${size}`
    );
    // If response.data is undefined (204), return empty array
    return response.data?.content || [];
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    // If 204 No Content, return empty array instead of throwing
    if (error.response?.status === 204) {
      return [];
    }
    throw error;
  }
};
