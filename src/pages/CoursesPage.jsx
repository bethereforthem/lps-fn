// import React from "react";
// import CourseList from "../components/student/CourseList";
// import { useAuth } from "../context/AuthContext";

// const CoursesPage = () => {
//   const { requireAuth } = useAuth();

//   // Allow all users to view courses, even if not logged in
//   // You can modify this to requireAuth if you want to restrict access

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <CourseList />
//     </div>
//   );
// };

// export default CoursesPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Filter,
  BookOpen,
  Shield,
  Code,
  Cpu,
  Zap,
} from "lucide-react";
import CourseList from "../components/student/CourseList";

const CoursesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Explore Courses
            </h1>
            <p className="mt-2 text-gray-600">
              Discover and enroll in our comprehensive range of courses
            </p>
          </div>
        </div>

        {/* Course list component */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <CourseList />
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
