import { api } from "..";

export const summaryDocument = async (file) => {
  try {
   

  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized: Please login again");
    }
    throw error;
  }
};