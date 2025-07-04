import { api } from "..";

export const searchBooks = async (criteria, page = 0, size = 10) => {
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


export const getBooksByTitle = async (title, page = 0, size = 10) => {
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

export const getBooksByAuthor = async (author, page = 0, size = 10) => {
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
