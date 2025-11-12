import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart,
  Award,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../utils/constants";

const MainLayout = ({ children }) => {
  const { currentUser, isAdmin, isLecturer, isStudent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (isAdmin()) {
      return [
        { name: "Dashboard", href: "/admin/dashboard", icon: Home },
        { name: "Lecturer Management", href: "/admin/lecturers", icon: Users },
        { name: "System Statistics", href: "/admin/stats", icon: BarChart },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ];
    } else if (isLecturer()) {
      return [
        { name: "Dashboard", href: "/lecturer/dashboard", icon: Home },
        { name: "My Courses", href: "/lecturer/courses", icon: BookOpen },
        {
          name: "Create Course",
          href: "/lecturer/courses/create",
          icon: BookOpen,
        },
        { name: "Student Progress", href: "/lecturer/students", icon: Users },
      ];
    } else if (isStudent()) {
      return [
        { name: "Dashboard", href: "/student/dashboard", icon: Home },
        { name: "Courses", href: "/courses", icon: BookOpen },
        {
          name: "My Enrollments",
          href: "/student/enrollments",
          icon: BookOpen,
        },
        { name: "Certificates", href: "/student/certificates", icon: Award },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="bg-blue-600 lg:hidden">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-white font-bold text-xl">
              Learning Portal
            </Link>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}

            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </div>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-600">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="text-white font-bold text-xl">
                Learning Portal
              </Link>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? "bg-blue-700 text-white"
                        : "text-white hover:bg-blue-700"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {currentUser && (
            <div className="flex-shrink-0 p-4 bg-blue-700">
              <div className="flex items-center">
                <div>
                  <div className="bg-blue-800 rounded-full p-1">
                    <User className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser.fname} {currentUser.lname}
                  </p>
                  <p className="text-xs font-medium text-blue-200">
                    {currentUser.role === USER_ROLES.ADMIN
                      ? "Administrator"
                      : currentUser.role === USER_ROLES.LECTURER
                      ? "Lecturer"
                      : "Student"}
                  </p>
                  <div className="flex mt-2 space-x-2">
                    <Link
                      to="/profile"
                      className="text-xs text-blue-200 hover:text-white"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="text-xs text-blue-200 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="hidden lg:flex lg:sticky lg:top-0 lg:z-10 lg:bg-white lg:border-b lg:border-gray-200">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                {navLinks.find((item) => item.href === location.pathname)
                  ?.name || "Learning Portal"}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <Link
                  to="/profile"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="bg-gray-200 rounded-full p-1">
                    <User className="h-7 w-7 text-gray-600" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
