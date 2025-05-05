import axios from "axios";
const BASE_URL = "http://localhost:8080/books";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb3dhbnNob2VpYkBnbWFpbC5jb20iLCJpYXQiOjE3NDY0MDU5NjksImV4cCI6MTc0NjQ5MjM2OX0.bW6E3kRzJCbmGs94SRAZY_YaowQHtqqX0NGqbdWZ9Tk"
export const fetchAllBooks = async (page = 0, size = 50) => {
  const response = await axios.get(BASE_URL, {
    params: { page, size },
    headers: {
        Authorization: `Bearer ${token}`,
      }
  });
  console.log(response.data);
  return response.data.content;
};

export const getBooksByTitle = (title, page = 0, size = 10) => {
  return axios.get(BASE_URL, {
    params: { title, page, size },
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const getBooksByAuthor = (author, page = 0, size = 10) => {
  return axios.get(BASE_URL, {
    params: { author, page, size },
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};

export const searchBooks = (criteria, page = 0, size = 10) => {
  return axios.post(`${BASE_URL}/search`, criteria, {
    params: { page, size },
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};