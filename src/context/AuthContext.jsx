import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData) => {
    console.log("AuthContext - Login called with:", userData);

    // Update state
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    // Navigate based on role
    if (userData.role === "admin") {
      navigate("/admin-dashboard");
    } else if (userData.role === "lecturer") {
      navigate("/lecturer-dashboard");
    } else if (userData.role === "student") {
      navigate("/student-dashboard");
    } else {
      // Default fallback
      navigate("/");
    }
  };

  // Logout function with backend integration
  const logout = async () => {
    try {
      console.log("AuthContext - Logging out...");

      // Call backend logout API to blacklist token
      await authService.logout();

      console.log("AuthContext - Backend logout successful");
    } catch (error) {
      console.error("AuthContext - Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state and storage regardless of API result
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Navigate to login
      navigate("/login");
    }
  };

  // Check for authorized role
  const requireAuth = (allowedRoles = []) => {
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
      // Redirect to appropriate dashboard based on role
      if (currentUser.role === "admin") {
        navigate("/admin-dashboard");
      } else if (currentUser.role === "lecturer") {
        navigate("/lecturer-dashboard");
      } else if (currentUser.role === "student") {
        navigate("/student-dashboard");
      }
      return false;
    }

    return true;
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    loading,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
