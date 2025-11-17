import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { formatErrorMessage } from "../utils/helpers";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Call the real login API
      const response = await authService.login({
        email: email.trim(),
        password: password,
      });

      // Debug: Log the full response to see what we're getting
      console.log("Full API Response:", response);

      // Check if login was successful - handle different response structures
      if (response && response.user) {
        console.log("Login successful:", response.user);

        // Use the login function from AuthContext
        login({
          name:
            response.user.name ||
            response.user.fullName ||
            response.user.username,
          email: response.user.email,
          role: response.user.role,
          id: response.user.id || response.user._id,
          // Add any other user data from response
          ...response.user,
        });

        // Navigation is handled by the login function in AuthContext
      } else if (response && response.data && response.data.user) {
        // Handle case where user is nested in data object
        console.log("Login successful (nested):", response.data.user);

        login({
          name:
            response.data.user.name ||
            response.data.user.fullName ||
            response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          id: response.data.user.id || response.data.user._id,
          ...response.data.user,
        });
      } else {
        // Log what we got to help debug
        console.error("Unexpected response structure:", response);
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);

      // Format and display error message
      const errorMsg = formatErrorMessage(error);
      setErrorMessage(errorMsg || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // Navigate to forgot password page
    navigate("/forgot-password");
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Home
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 px-6 py-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Learning Portal</h1>
          <p className="text-indigo-200">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
                disabled={isLoading}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        &copy; {currentYear} Learning Portal System. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
