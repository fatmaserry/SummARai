import { api } from "..";

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

export const getBooksByTitle = async (title, page = 0, size = 10) => {
  try {
    const response = await api.get("/api/books/title", {
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
    const response = await api.get("/api/books/author", {
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

export const getSummaryById = async (id) => {
  try {
    const response = await api.get(`api/books/summary/${id}`,{
    responseType: "arraybuffer", // Critical for binary data
  });
    return response;
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