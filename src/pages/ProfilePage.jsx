import React from "react";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../utils/constants";
import LecturerProfile from "../components/lecturer/LecturerProfile";
import ProfileSection from "../components/student/ProfileSection";
// Import this when it is implemented
// import AdminProfile from "../components/admin/AdminProfile";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your profile information and account settings
          </p>
        </div>

        {currentUser?.role === USER_ROLES.LECTURER && <LecturerProfile />}

        {/* Render appropriate profile component based on role */}
        {currentUser?.role === USER_ROLES.ADMIN && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Admin Profile
            </h2>
            <p className="text-gray-500">
              Admin profile component will be implemented in the next phase.
            </p>
          </div>
        )}

        {currentUser?.role === USER_ROLES.STUDENT && (
          <>
            <ProfileSection />

            {/* Additional student-specific account settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Account Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Email Notifications
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="noti-new-courses"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="noti-new-courses"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        New course announcements
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="noti-assignments"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="noti-assignments"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Assignment deadlines and feedback
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="noti-messages"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label
                        htmlFor="noti-messages"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Messages from instructors
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Password
                  </h4>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Change Password
                  </button>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    Account Access
                  </h4>
                  <button
                    type="button"
                    className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
