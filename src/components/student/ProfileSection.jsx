import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, BookOpen, CheckCircle, Clock } from "lucide-react";

const ProfileSection = () => {
  const { currentUser } = useAuth();

  // In a real app, this would come from an API
  const studentStats = {
    enrolledCourses: 4,
    completedCourses: 1,
    inProgressCourses: 3,
    totalHoursSpent: 28,
    certificatesEarned: 1,
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Profile Information
        </h3>
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-medium text-gray-900">
              {currentUser?.name || "Student User"}
            </h4>
            <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              <span>{currentUser?.email || "student@example.com"}</span>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Learning Statistics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Enrolled Courses
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {studentStats.enrolledCourses}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Completed
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {studentStats.completedCourses}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    In Progress
                  </div>
                  <div className="mt-1 text-xl font-semibold text-gray-900">
                    {studentStats.inProgressCourses}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
