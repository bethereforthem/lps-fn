// import React, { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";

// // Create the auth context
// export const AuthContext = createContext();

// // Custom hook to use the auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // Auth provider component
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check if user is logged in (from localStorage for demo purposes)
//   useEffect(() => {
//     const checkAuth = () => {
//       const userStr = localStorage.getItem("user");
//       if (userStr) {
//         try {
//           const user = JSON.parse(userStr);
//           setCurrentUser(user);
//         } catch (error) {
//           // Handle any JSON parsing error
//           console.error("Failed to parse user data:", error);
//           localStorage.removeItem("user");
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Login function
//   const login = (userData) => {
//     setCurrentUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));

//     // Redirect based on role
//     if (userData.role === "admin") {
//       navigate("/admin-dashboard");
//     } else if (userData.role === "lecturer") {
//       navigate("/lecturer-dashboard");
//     } else if (userData.role === "student") {
//       navigate("/student-dashboard");
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // Check for authorized role
//   const requireAuth = (allowedRoles = []) => {
//     if (!currentUser) {
//       navigate("/login");
//       return false;
//     }

//     if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
//       // Redirect to appropriate dashboard based on role
//       if (currentUser.role === "admin") {
//         navigate("/admin-dashboard");
//       } else if (currentUser.role === "lecturer") {
//         navigate("/lecturer-dashboard");
//       } else if (currentUser.role === "student") {
//         navigate("/student-dashboard");
//       }
//       return false;
//     }

//     return true;
//   };

//   const value = {
//     currentUser,
//     login,
//     logout,
//     loading,
//     requireAuth,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

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

  // Check if user is logged in (from localStorage for demo purposes)
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          // Handle any JSON parsing error
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
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
    // First update state
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    // Then navigate based on role
    if (userData.role === "admin") {
      navigate("/admin-dashboard");
    } else if (userData.role === "lecturer") {
      navigate("/lecturer-dashboard");
    } else if (userData.role === "student") {
      navigate("/student-dashboard");
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Check for authorized role
  const requireAuth = (allowedRoles = []) => {
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
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
