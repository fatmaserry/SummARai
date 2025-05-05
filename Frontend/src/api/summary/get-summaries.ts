import { api } from "..";

export const fetchAllBooks = async (page = 0, size = 50) => {
  try {
    const response = await api.get(`/books`, {
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

export const getBooksByTitle = async (title, page = 0, size = 10) => {
  try {
    const response = await api.get("/books", {
      params: { title, page, size },
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
    const response = await api.get("/books", {
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

export const searchBooks = async (criteria, page = 0, size = 10) => {
  try {
    const response = await api.post(`/books/search`, criteria, {
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
