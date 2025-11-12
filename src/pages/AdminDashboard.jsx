import React, { useState } from "react";
import {
  Layout,
  User,
  Users,
  BookOpen,
  Shield,
  BarChart2,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  CheckCircle,
  XCircle,
  Mail,
  MoreVertical,
  Trash2,
  Edit,
  Globe,
  Lock,
  Database,
  HelpCircle,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LecturerManagement from "../components/admin/LecturerManagement";
import SystemStats from "../components/admin/SystemStats";

// Notifications Dropdown Component
const NotificationsDropdown = ({
  isOpen,
  onClose,
  notifications,
  onApprove,
  onReject,
}) => {
  const pendingRequests = notifications.filter((n) => n.status === "pending");

  if (!isOpen) return null;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="notifications-menu"
      >
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No new notifications
          </div>
        ) : (
          <div>
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lecturer Approval Requests
            </div>
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 rounded-full bg-gray-200 p-1 text-gray-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {request.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      New lecturer request from {request.department}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {request.requestDate}
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => onApprove(request.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(request.id)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-2 border-t border-gray-200">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            View all notifications
          </a>
        </div>
      </div>
    </div>
  );
};

// Settings Component
const SystemSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Learning Portal",
    siteDescription: "A platform for cybersecurity education",
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: "student",
    darkMode: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@learningportal.com",
    enableEmailNotifications: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
  });

  // Handler for general settings changes
  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handler for email settings changes
  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handler for security settings changes
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value)
          : value,
    });
  };

  // Save settings function (would connect to API in real implementation)
  const saveSettings = (settingType) => {
    console.log(`Saving ${settingType} settings`);
    // This would make an API call to save the settings
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        System Settings
      </h1>

      {/* General Settings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              General Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure basic system parameters.
            </p>
          </div>
          <Globe className="h-6 w-6 text-gray-400" />
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="siteName"
                className="block text-sm font-medium text-gray-700"
              >
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="siteDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Site Description
              </label>
              <input
                type="text"
                name="siteDescription"
                id="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="defaultUserRole"
                className="block text-sm font-medium text-gray-700"
              >
                Default User Role
              </label>
              <select
                id="defaultUserRole"
                name="defaultUserRole"
                value={generalSettings.defaultUserRole}
                onChange={handleGeneralChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowRegistration"
                    name="allowRegistration"
                    type="checkbox"
                    checked={generalSettings.allowRegistration}
                    onChange={handleGeneralChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="allowRegistration"
                    className="font-medium text-gray-700"
                  >
                    Allow User Registration
                  </label>
                  <p className="text-gray-500">
                    Enable or disable new user registrations.
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="maintenanceMode"
                    name="maintenanceMode"
                    type="checkbox"
                    checked={generalSettings.maintenanceMode}
                    onChange={handleGeneralChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="maintenanceMode"
                    className="font-medium text-gray-700"
                  >
                    Maintenance Mode
                  </label>
                  <p className="text-gray-500">
                    When enabled, only administrators can access the system.
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="darkMode"
                    name="darkMode"
                    type="checkbox"
                    checked={generalSettings.darkMode}
                    onChange={handleGeneralChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="darkMode"
                    className="font-medium text-gray-700"
                  >
                    Dark Mode Default
                  </label>
                  <p className="text-gray-500">
                    Set dark mode as the default theme for all users.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => saveSettings("general")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save General Settings
            </button>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Email Configuration
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure email notification settings.
            </p>
          </div>
          <Mail className="h-6 w-6 text-gray-400" />
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="smtpServer"
                className="block text-sm font-medium text-gray-700"
              >
                SMTP Server
              </label>
              <input
                type="text"
                name="smtpServer"
                id="smtpServer"
                value={emailSettings.smtpServer}
                onChange={handleEmailChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="smtpPort"
                className="block text-sm font-medium text-gray-700"
              >
                SMTP Port
              </label>
              <input
                type="text"
                name="smtpPort"
                id="smtpPort"
                value={emailSettings.smtpPort}
                onChange={handleEmailChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="smtpUsername"
                className="block text-sm font-medium text-gray-700"
              >
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUsername"
                id="smtpUsername"
                value={emailSettings.smtpUsername}
                onChange={handleEmailChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="smtpPassword"
                className="block text-sm font-medium text-gray-700"
              >
                SMTP Password
              </label>
              <input
                type="password"
                name="smtpPassword"
                id="smtpPassword"
                placeholder="••••••••••"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableEmailNotifications"
                    name="enableEmailNotifications"
                    type="checkbox"
                    checked={emailSettings.enableEmailNotifications}
                    onChange={handleEmailChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="enableEmailNotifications"
                    className="font-medium text-gray-700"
                  >
                    Enable Email Notifications
                  </label>
                  <p className="text-gray-500">
                    Send system notifications via email to users.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => saveSettings("email")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Email Settings
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Security Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure system security parameters.
            </p>
          </div>
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="passwordMinLength"
                className="block text-sm font-medium text-gray-700"
              >
                Minimum Password Length
              </label>
              <input
                type="number"
                name="passwordMinLength"
                id="passwordMinLength"
                min="6"
                max="16"
                value={securitySettings.passwordMinLength}
                onChange={handleSecurityChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="sessionTimeout"
                className="block text-sm font-medium text-gray-700"
              >
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                name="sessionTimeout"
                id="sessionTimeout"
                min="5"
                max="120"
                value={securitySettings.sessionTimeout}
                onChange={handleSecurityChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="maxLoginAttempts"
                className="block text-sm font-medium text-gray-700"
              >
                Max Login Attempts
              </label>
              <input
                type="number"
                name="maxLoginAttempts"
                id="maxLoginAttempts"
                min="3"
                max="10"
                value={securitySettings.maxLoginAttempts}
                onChange={handleSecurityChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireSpecialChars"
                    name="requireSpecialChars"
                    type="checkbox"
                    checked={securitySettings.requireSpecialChars}
                    onChange={handleSecurityChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="requireSpecialChars"
                    className="font-medium text-gray-700"
                  >
                    Require Special Characters
                  </label>
                  <p className="text-gray-500">
                    Passwords must include at least one special character.
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={handleSecurityChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="twoFactorAuth"
                    className="font-medium text-gray-700"
                  >
                    Enable Two-Factor Authentication
                  </label>
                  <p className="text-gray-500">
                    Require two-factor authentication for all users.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => saveSettings("security")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logout, currentUser } = useAuth();

  // Mock admin data (can be replaced with currentUser data)
  const admin = {
    // name: currentUser?.fname + " " + currentUser?.lname || "Admin User",
    name: "David" + " " + "KAYIGAMBA" || "Admin User", // Will be changed to use data from the database
    email: currentUser?.email || "admin@example.com",
    role: "System Administrator",
    profileImage: "/src/assets/images/You.jpg", // Placeholder for profile image
  };

  // Mock system statistics
  const stats = {
    totalUsers: 245,
    totalLecturers: 12,
    totalStudents: 233,
    totalCourses: 24,
    activeUsers: 152,
    recentEnrollments: 18,
  };

  // Mock lecturer approval requests
  const [lecturerRequests, setLecturerRequests] = useState([
    {
      id: 1,
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      department: "Computer Science",
      requestDate: "April 28, 2025",
      status: "pending",
    },
    {
      id: 2,
      name: "Prof. Amanda Johnson",
      email: "amanda.johnson@example.com",
      department: "Network Security",
      requestDate: "April 26, 2025",
      status: "pending",
    },
    {
      id: 3,
      name: "Dr. Robert Williams",
      email: "robert.williams@example.com",
      department: "Cybersecurity",
      requestDate: "April 25, 2025",
      status: "approved",
    },
  ]);

  // Mock registered users
  const users = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      email: "sarah.mitchell@example.com",
      role: "lecturer",
      department: "Cybersecurity",
      joinDate: "Jan 15, 2025",
      status: "active",
    },
    {
      id: 2,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "student",
      courses: 4,
      joinDate: "Feb 02, 2025",
      status: "active",
    },
    {
      id: 3,
      name: "Mark Robinson",
      email: "mark.robinson@example.com",
      role: "lecturer",
      department: "Ethical Hacking",
      joinDate: "Dec 10, 2024",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@example.com",
      role: "lecturer",
      department: "Emerging Technologies",
      joinDate: "Mar 05, 2025",
      status: "active",
    },
    {
      id: 5,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "student",
      courses: 2,
      joinDate: "Apr 12, 2025",
      status: "active",
    },
  ];

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Cybersecurity Fundamentals",
      instructor: "Dr. Sarah Mitchell",
      category: "Security",
      studentsEnrolled: 45,
      createdAt: "Jan 20, 2025",
      status: "active",
    },
    {
      id: 2,
      title: "Ethical Hacking & Penetration Testing",
      instructor: "Mark Robinson",
      category: "Security",
      studentsEnrolled: 32,
      createdAt: "Jan 25, 2025",
      status: "active",
    },
    {
      id: 3,
      title: "Computer Hardware Essentials",
      instructor: "James Wilson",
      category: "IT",
      studentsEnrolled: 47,
      createdAt: "Feb 10, 2025",
      status: "active",
    },
    {
      id: 4,
      title: "Introduction to Machine Learning",
      instructor: "Dr. Emily Chen",
      category: "Emerging Tech",
      studentsEnrolled: 28,
      createdAt: "Mar 15, 2025",
      status: "active",
    },
  ];

  // Filter users or courses based on search query and active tab
  const filteredData = () => {
    if (activeTab === "users") {
      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === "courses") {
      return courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Handler for lecturer approval
  const handleLecturerApproval = (id, approved) => {
    console.log(`Lecturer ${id} ${approved ? "approved" : "rejected"}`);

    // Update the lecturerRequests state
    setLecturerRequests(
      lecturerRequests.map((request) =>
        request.id === id
          ? { ...request, status: approved ? "approved" : "rejected" }
          : request
      )
    );

    // Close notifications dropdown if all pending requests are handled
    if (
      lecturerRequests.filter((req) => req.status === "pending").length <= 1
    ) {
      setIsNotificationsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Mobile Version */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 text-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="px-4 py-5 flex items-center justify-center">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-indigo-400 mr-2" />
                <span className="text-xl font-bold">Admin Portal</span>
              </div>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Layout className="mr-3 h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "lecturers"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("lecturers")}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Lecturers
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "users"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("users")}
                >
                  <User className="mr-3 h-5 w-5" />
                  Users
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "courses"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("courses")}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Courses
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "stats"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("stats")}
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  System Stats
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "settings"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </a>
              </nav>
            </div>
            <div className="px-4 py-4 border-t border-gray-700">
              <a
                href="#"
                className="flex items-center text-gray-400 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Sign out</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop Version */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800 text-white">
          <div className="px-4 py-5 flex items-center justify-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-indigo-400 mr-2" />
              <span className="text-xl font-bold">Admin Portal</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "dashboard"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Layout className="mr-3 h-5 w-5" />
                Dashboard
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "lecturers"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("lecturers")}
              >
                <Users className="mr-3 h-5 w-5" />
                Lecturers
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "users"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <User className="mr-3 h-5 w-5" />
                Users
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "courses"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("courses")}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Courses
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "stats"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                <BarChart2 className="mr-3 h-5 w-5" />
                System Stats
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "settings"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </a>
            </nav>
          </div>
          <div className="px-4 py-4 border-t border-gray-700">
            <a
              href="#"
              className="flex items-center text-gray-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign out</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center lg:hidden">
                  <button
                    onClick={toggleSidebar}
                    className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" />
                  </button>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={`Search ${
                        activeTab === "users"
                          ? "users"
                          : activeTab === "courses"
                          ? "courses"
                          : activeTab === "lecturers"
                          ? "lecturers"
                          : ""
                      }...`}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <div className="relative">
                    <button
                      className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                      onClick={toggleNotifications}
                    >
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6" />
                      {lecturerRequests.filter((r) => r.status === "pending")
                        .length > 0 && (
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    <NotificationsDropdown
                      isOpen={isNotificationsOpen}
                      onClose={() => setIsNotificationsOpen(false)}
                      notifications={lecturerRequests}
                      onApprove={(id) => handleLecturerApproval(id, true)}
                      onReject={(id) => handleLecturerApproval(id, false)}
                    />
                  </div>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative flex items-center">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={admin.profileImage}
                        alt="Profile"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {admin.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content - Main View */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Admin Dashboard
              </h1>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Users
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.totalUsers}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => setActiveTab("users")}
                      >
                        View all users
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Courses
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.totalCourses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => setActiveTab("courses")}
                      >
                        View all courses
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Recent Enrollments
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.recentEnrollments}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => setActiveTab("stats")}
                      >
                        View analytics
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lecturer Approval Section */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Lecturer Approval Requests
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Review and approve or reject lecturer account requests.
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {lecturerRequests.filter((req) => req.status === "pending")
                    .length === 0 ? (
                    <li className="px-4 py-4 sm:px-6">
                      <p className="text-sm text-gray-500">
                        No pending requests at this time.
                      </p>
                    </li>
                  ) : (
                    lecturerRequests
                      .filter((req) => req.status === "pending")
                      .map((request) => (
                        <li key={request.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <User className="h-10 w-10 rounded-full bg-gray-200 p-2 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.email}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Department: {request.department}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Requested: {request.requestDate}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleLecturerApproval(request.id, true)
                                }
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleLecturerApproval(request.id, false)
                                }
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </li>
                      ))
                  )}
                </ul>
                {lecturerRequests.filter((req) => req.status === "pending")
                  .length > 0 && (
                  <div className="bg-gray-50 px-4 py-3 sm:px-6">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => setActiveTab("lecturers")}
                      >
                        View all requests
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* User Distribution Stats */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    User Distribution
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        User Roles
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-600">
                              Lecturers
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {stats.totalLecturers}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (stats.totalLecturers / stats.totalUsers) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-600">
                              Students
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {stats.totalStudents}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (stats.totalStudents / stats.totalUsers) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        User Activity
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-600">
                              Active Users
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {stats.activeUsers}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-500 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  (stats.activeUsers / stats.totalUsers) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-gray-600">
                              Inactive Users
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {stats.totalUsers - stats.activeUsers}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gray-400 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  ((stats.totalUsers - stats.activeUsers) /
                                    stats.totalUsers) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a
                      href="#"
                      onClick={() => setActiveTab("users")}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <User className="h-6 w-6 text-indigo-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Manage Users
                        </div>
                        <div className="text-xs text-gray-500">
                          View, add, or modify user accounts
                        </div>
                      </div>
                    </a>

                    <a
                      href="#"
                      onClick={() => setActiveTab("courses")}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <BookOpen className="h-6 w-6 text-indigo-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Review Courses
                        </div>
                        <div className="text-xs text-gray-500">
                          View course catalog and enrollment details
                        </div>
                      </div>
                    </a>

                    <a
                      href="#"
                      onClick={() => setActiveTab("stats")}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <BarChart2 className="h-6 w-6 text-indigo-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          View System Stats
                        </div>
                        <div className="text-xs text-gray-500">
                          Access analytics and system reports
                        </div>
                      </div>
                    </a>

                    <a
                      href="#"
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <Mail className="h-6 w-6 text-indigo-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Send Notifications
                        </div>
                        <div className="text-xs text-gray-500">
                          Send announcements to users
                        </div>
                      </div>
                    </a>

                    <a
                      href="#"
                      onClick={() => setActiveTab("settings")}
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <Settings className="h-6 w-6 text-indigo-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          System Settings
                        </div>
                        <div className="text-xs text-gray-500">
                          Configure system parameters
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lecturer Management */}
          {activeTab === "lecturers" && <LecturerManagement />}

          {/* Users Management */}
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  User Management
                </h1>
              </div>

              {/* Search for smaller screens */}
              <div className="block sm:hidden mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* User List Table */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Joined
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData().map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <User className="h-10 w-10 rounded-full bg-gray-200 p-2 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {user.role}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.role === "lecturer"
                                ? user.department
                                : `${user.courses || 0} courses`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-5 w-5" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-500">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredData().length === 0 && (
                  <div className="px-6 py-10 text-center">
                    <p className="text-gray-500">
                      No users found matching your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Courses Management - Admin can only REVIEW courses, not add them */}
          {activeTab === "courses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Course Review
                </h1>
              </div>

              {/* Search for smaller screens */}
              <div className="block sm:hidden mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Course List */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Course
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Instructor
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Students
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Created
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData().map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {course.instructor}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.studentsEnrolled}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-5 w-5" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-500">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredData().length === 0 && (
                  <div className="px-6 py-10 text-center">
                    <p className="text-gray-500">
                      No courses found matching your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Stats */}
          {activeTab === "stats" && <SystemStats />}

          {/* Settings Tab */}
          {activeTab === "settings" && <SystemSettings />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
