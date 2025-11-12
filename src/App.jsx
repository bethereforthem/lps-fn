import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CourseDetails from "./pages/CourseDetails";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Import new pages
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { ROUTES, USER_ROLES } from "./utils/constants";

// // Import pages
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import StudentDashboard from "./pages/StudentDashboard";
// import LecturerDashboard from "./pages/LecturerDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import CourseDetails from "./pages/CourseDetailsPage";
// import CoursesPage from "./pages/CoursesPage";
// import ProfilePage from "./pages/ProfilePage";

// // Import context
// import { AuthProvider, useAuth } from "./context/AuthContext";

// // Protected route component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { currentUser, isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} />;
//   }

//   if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
//     // Redirect to appropriate dashboard based on role
//     if (currentUser.role === USER_ROLES.ADMIN) {
//       return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
//     } else if (currentUser.role === USER_ROLES.LECTURER) {
//       return <Navigate to={ROUTES.LECTURER_DASHBOARD} />;
//     } else if (currentUser.role === USER_ROLES.STUDENT) {
//       return <Navigate to={ROUTES.STUDENT_DASHBOARD} />;
//     }
//     return <Navigate to={ROUTES.HOME} />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* Public routes */}
//           <Route path={ROUTES.HOME} element={<HomePage />} />
//           <Route path={ROUTES.LOGIN} element={<LoginPage />} />
//           <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

//           {/* Student routes */}
//           <Route
//             path={ROUTES.STUDENT_DASHBOARD}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
//                 <StudentDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.COURSES}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
//                 <CoursesPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.COURSE_DETAILS}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
//                 <CourseDetails />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.PROFILE}
//             element={
//               <ProtectedRoute
//                 allowedRoles={[
//                   USER_ROLES.STUDENT,
//                   USER_ROLES.LECTURER,
//                   USER_ROLES.ADMIN,
//                 ]}
//               >
//                 <ProfilePage />
//               </ProtectedRoute>
//             }
//           />

//           {/* Lecturer routes */}
//           <Route
//             path={ROUTES.LECTURER_DASHBOARD}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <LecturerDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin routes */}
//           <Route
//             path={ROUTES.ADMIN_DASHBOARD}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback route */}
//           <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { USER_ROLES, ROUTES } from "./utils/constants";

// // Import pages
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import StudentDashboard from "./pages/StudentDashboard";
// import LecturerDashboard from "./pages/LecturerDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import CourseDetails from "./pages/CourseDetails";
// import CoursesPage from "./pages/CoursesPage";
// import ProfilePage from "./pages/ProfilePage";

// // Import lecturer components
// import CourseCreation from "./components/lecturer/CourseCreation";
// import StudentProgress from "./components/lecturer/StudentProgress";
// import StudentInteraction from "./components/lecturer/StudentInteraction";

// import { AuthProvider, useAuth } from "./context/AuthContext";

// // Protected route component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { currentUser, isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} />;
//   }

//   if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
//     // Redirect to appropriate dashboard based on role
//     if (currentUser.role === USER_ROLES.ADMIN) {
//       return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
//     } else if (currentUser.role === USER_ROLES.LECTURER) {
//       return <Navigate to={ROUTES.LECTURER_DASHBOARD} />;
//     } else if (currentUser.role === USER_ROLES.STUDENT) {
//       return <Navigate to={ROUTES.STUDENT_DASHBOARD} />;
//     }
//     return <Navigate to={ROUTES.HOME} />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* Public routes */}
//           <Route path={ROUTES.HOME} element={<HomePage />} />
//           <Route path={ROUTES.LOGIN} element={<LoginPage />} />
//           <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

//           {/* Admin routes */}
//           <Route
//             path={ROUTES.ADMIN_DASHBOARD}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Lecturer routes */}
//           <Route
//             path={ROUTES.LECTURER_DASHBOARD}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <LecturerDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.LECTURER_PROFILE}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <ProfilePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.LECTURER_COURSE_CREATE}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <CourseCreation />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.LECTURER_COURSE_EDIT.replace(":id", ":courseId")}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <CourseCreation editCourseId={":courseId"} />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.LECTURER_COURSE_PROGRESS.replace(":id", ":courseId")}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <StudentProgress courseId={":courseId"} />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.LECTURER_COURSE_INTERACTIONS.replace(
//               ":id",
//               ":courseId"
//             )}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.LECTURER]}>
//                 <StudentInteraction courseId={":courseId"} />
//               </ProtectedRoute>
//             }
//           />

//           {/* Student routes */}
//           <Route
//             path={ROUTES.STUDENT_DASHBOARD}
//             element={
//               <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
//                 <StudentDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path={ROUTES.PROFILE}
//             element={
//               <ProtectedRoute
//                 allowedRoles={[
//                   USER_ROLES.STUDENT,
//                   USER_ROLES.LECTURER,
//                   USER_ROLES.ADMIN,
//                 ]}
//               >
//                 <ProfilePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route path={ROUTES.COURSES} element={<CoursesPage />} />
//           <Route path={ROUTES.COURSE_DETAILS} element={<CourseDetails />} />

//           {/* Fallback route */}
//           <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
