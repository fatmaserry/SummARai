import { api } from "..";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
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

export const updateProfile = async (data: object, token: string) => {
  const response = await api.put("/api/user", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const forgetPassword = async (email: string) => {
  try {
    const response = await api.post(`/api/auth/forget-password?email=${email}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset password email"
    );
  }
};

export const updatePassword = async (email: string, newPassword: string) => {
  try {
    const response = await api.post(
      `/api/auth/update-password?email=${email}&password=${newPassword}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await api.post(
      `/api/auth/verifyOTP?email=${email}&otp=${otp}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
};

export default {
  login,
  signup,
  updateProfile,
  forgetPassword,
  updatePassword,
  verifyOTP,
};
