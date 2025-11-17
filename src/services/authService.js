import api from "./api";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",
  REQUEST_RESET: "/auth/forgot-password",
  VERIFY_RESET_OTP: "/auth/verify-reset-otp",
  PROFILE: "/auth/profile",
};

const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @returns {Promise} Promise with user data
   */
  login: async (credentials) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);

      console.log("Raw API response:", response);
      console.log("Response data:", response.data);

      let userData, token;

      if (response.data) {
        if (response.data.token && response.data.user) {
          token = response.data.token;
          userData = response.data.user;
        } else if (response.data.data && response.data.data.token) {
          token = response.data.data.token;
          userData = response.data.data.user;
        } else if (response.data.token) {
          token = response.data.token;
          userData = response.data.user || response.data.data;
        } else if (response.data.user) {
          userData = response.data.user;
          token = response.data.token || null;
        } else {
          userData = response.data;
          token = response.data.token || null;
        }
      }

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token stored:", token);
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User data stored:", userData);
      }

      return response.data;
    } catch (error) {
      console.error("Auth service login error:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with registration result
   */
  register: async (userData) => {
    try {
      console.log("Auth service - Sending registration request:", userData);
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      console.log("Auth service - Registration response:", response);
      console.log("Auth service - Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Auth service - Registration error:", error);
      console.error("Auth service - Error response:", error.response);
      console.error("Auth service - Error data:", error.response?.data);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise} Promise with logout result
   */
  logout: async () => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  /**
   * Verify email with OTP
   * @param {Object} verificationData - Email and OTP
   * @returns {Promise} Promise with verification result
   */
  verifyEmail: async (verificationData) => {
    try {
      const response = await api.post(
        AUTH_ENDPOINTS.VERIFY_EMAIL,
        verificationData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resend OTP to email
   * @param {Object} emailData - User email
   * @returns {Promise} Promise with resend result
   */
  resendOTP: async (emailData) => {
    try {
      console.log("Auth service - Resending OTP to:", emailData);
      const response = await api.post("/auth/resend-otp", emailData);
      console.log("Auth service - Resend OTP response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Auth service - Resend OTP error:", error);
      console.error(
        "Auth service - Resend error response:",
        error.response?.data
      );
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {Object} emailData - User email { email: string }
   * @returns {Promise} Promise with request result
   */
  requestReset: async (emailData) => {
    try {
      console.log("Auth service - Requesting password reset for:", emailData);
      const response = await api.post(AUTH_ENDPOINTS.REQUEST_RESET, emailData);
      console.log("Auth service - Request reset response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Auth service - Request reset error:", error);
      throw error;
    }
  },

  /**
   * Verify OTP for password reset
   * @param {Object} verifyData - Verification data { email: string, otp: string }
   * @returns {Promise} Promise with verification result
   */
  verifyResetOTP: async (verifyData) => {
    try {
      console.log("Auth service - Verifying reset OTP:", verifyData);
      const response = await api.post(
        AUTH_ENDPOINTS.VERIFY_RESET_OTP,
        verifyData
      );
      console.log("Auth service - Verify OTP response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Auth service - Verify OTP error:", error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data { resetToken: string, newPassword: string, confirmPassword: string }
   * @returns {Promise} Promise with reset result
   */
  resetPassword: async (resetData) => {
    try {
      console.log("Auth service - Resetting password with data:", {
        resetToken: resetData.resetToken ? "***" : "missing",
        hasNewPassword: !!resetData.newPassword,
        hasConfirmPassword: !!resetData.confirmPassword,
      });
      const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData);
      console.log("Auth service - Reset password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Auth service - Reset password error:", error);
      console.error("Auth service - Error response:", error.response?.data);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} Promise with user profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get(AUTH_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current authenticated user from localStorage
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  /**
   * Check if user has specified role
   * @param {String} role - Role to check (admin, lecturer, student)
   * @returns {Boolean} True if user has role
   */
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  },
};

export default authService;
