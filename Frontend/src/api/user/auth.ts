import { api } from "..";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Login user with email and password
 * @param credentials - User login credentials
 * @returns Promise with user data and token
 */
export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

/**
 * Register new user
 * @param userData - User registration data
 * @returns Promise with user data and token
 */
export const signup = async (userData: SignupData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to register");
  }
};

export default {
  login,
  signup,
};
