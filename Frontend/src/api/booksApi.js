import axios from "axios";
// axios.defaults.baseURL = 'http://localhost:8080/';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb3dhbnNob2VpYkBnbWFpbC5jb20iLCJpYXQiOjE3NDYzOTM1NTMsImV4cCI6MTc0NjQ3OTk1M30.Nm5E-3ZtleCJeHDSOw8fPLYf77RN3KQ1CJyjdzClFLU"
export const fetchAllBooks = async (page = 0, size = 50) => {
  const response = await axios.get(`http://localhost:8080/books`, {
    params: { page, size },
    headers: {
        Authorization: `Bearer ${token}`,
      }
  });
  console.log(response.data);
  return response.data.content;
};
