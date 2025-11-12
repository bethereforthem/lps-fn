import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES, USER_ROLES } from "../utils/constants";
import {
  BookOpen,
  Layout,
  User,
  Award,
  Clock,
  CheckCircle,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BookmarkPlus,
  Settings,
  HelpCircle,
  Check,
  Calendar,
  FileText,
  ChevronDown,
} from "lucide-react";

// Import student components
import ProfileSection from "../components/student/ProfileSection";
import CourseList from "../components/student/CourseList";
import CourseContent from "../components/student/CourseContent";

const StudentDashboard = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // New state for notifications and profile dropdowns
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Refs for handling outside clicks
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // Verify user is authenticated and has the correct role
    if (!isAuthenticated || !currentUser) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (currentUser.role !== USER_ROLES.STUDENT) {
      // Redirect to appropriate dashboard
      if (currentUser.role === USER_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else if (currentUser.role === USER_ROLES.LECTURER) {
        navigate(ROUTES.LECTURER_DASHBOARD);
      }
    }

    // Fetch student data when component mounts
    fetchStudentData();

    // Add event listener for clicks outside of dropdowns
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [currentUser, isAuthenticated, navigate]);

  // Handle outside clicks for dropdowns
  const handleOutsideClick = (e) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(e.target)
    ) {
      setIsNotificationsOpen(false);
    }

    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setIsProfileOpen(false);
    }
  };

  // Mock data fetching - in a real app, this would be API calls
  const fetchStudentData = async () => {
    // Mock enrolled courses
    const mockEnrolledCourses = [
      {
        id: 1,
        title: "Cybersecurity Fundamentals",
        instructor: "Dr. Sarah Mitchell",
        progress: 85,
        lastAccessed: "2 days ago",
        image: "/src/assets/images/Cyber-security.jpg",
      },
      {
        id: 2,
        title: "Ethical Hacking & Penetration Testing",
        instructor: "Prof. James Wilson",
        progress: 42,
        lastAccessed: "5 days ago",
        image: "/src/assets/images/ethical-hacking.jpg",
      },
      {
        id: 3,
        title: "Network Administration",
        instructor: "Michael Johnson",
        progress: 20,
        lastAccessed: "1 week ago",
        image: "/src/assets/images/network-admin.jpg",
      },
    ];

    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        message: "New quiz available in Cybersecurity Fundamentals",
        time: "2 hours ago",
        read: false,
        type: "assignment",
      },
      {
        id: 2,
        message: "Your assignment has been graded in Ethical Hacking",
        time: "1 day ago",
        read: true,
        type: "grade",
      },
      {
        id: 3,
        message:
          "Instructor replied to your question in Network Administration",
        time: "3 days ago",
        read: true,
        type: "message",
      },
      {
        id: 4,
        message: "New course material uploaded in Cybersecurity Fundamentals",
        time: "4 days ago",
        read: false,
        type: "course",
      },
      {
        id: 5,
        message:
          "Course schedule updated for Ethical Hacking & Penetration Testing",
        time: "1 week ago",
        read: true,
        type: "announcement",
      },
    ];

    // Mock upcoming deadlines
    const mockDeadlines = [
      {
        id: 1,
        title: "Network Security Quiz",
        course: "Cybersecurity Fundamentals",
        dueDate: "Tomorrow, 11:59 PM",
      },
      {
        id: 2,
        title: "Penetration Testing Report",
        course: "Ethical Hacking & Penetration Testing",
        dueDate: "Next Monday, 11:59 PM",
      },
      {
        id: 3,
        title: "Lab Assignment: Packet Analysis",
        course: "Network Administration",
        dueDate: "Next Wednesday, 11:59 PM",
      },
    ];

    setEnrolledCourses(mockEnrolledCourses);
    setNotifications(mockNotifications);
    setUpcomingDeadlines(mockDeadlines);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setActiveTab("course-content");
  };

  const handleBrowseCourses = () => {
    navigate(ROUTES.COURSES);
  };

  const handleProfileNavigate = () => {
    navigate(ROUTES.PROFILE);
    setIsProfileOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      setIsProfileOpen(false);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (!isProfileOpen) {
      setIsNotificationsOpen(false);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter((notification) => !notification.read).length;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "grade":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "message":
        return <Bell className="h-5 w-5 text-indigo-500" />;
      case "course":
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case "announcement":
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Mock student data for stats
  const student = {
    name: currentUser?.name || "Student User",
    email: currentUser?.email || "student@example.com",
    enrolledCourses: enrolledCourses.length,
    completedCourses: 1,
    inProgressCourses: enrolledCourses.length - 1,
    profileImage: "/src/assets/images/student-prof.jpeg", // Placeholder for profile image
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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-900 text-white">
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
                <span className="text-xl font-bold">Student Portal</span>
              </div>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {/* Navigation Items */}
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800"
                  }`}
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsSidebarOpen(false);
                  }}
                >
                  <Layout className="mr-3 h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "my-courses"
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800"
                  }`}
                  onClick={() => {
                    setActiveTab("my-courses");
                    setIsSidebarOpen(false);
                  }}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  My Courses
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "browse-courses"
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800"
                  }`}
                  onClick={() => {
                    handleBrowseCourses();
                    setIsSidebarOpen(false);
                  }}
                >
                  <BookmarkPlus className="mr-3 h-5 w-5" />
                  Browse Courses
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "achievements"
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800"
                  }`}
                  onClick={() => {
                    setActiveTab("achievements");
                    setIsSidebarOpen(false);
                  }}
                >
                  <Award className="mr-3 h-5 w-5" />
                  Achievements
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "profile"
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-800"
                  }`}
                  onClick={() => {
                    setActiveTab("profile");
                    handleProfileNavigate();
                    setIsSidebarOpen(false);
                  }}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </a>
              </nav>
            </div>
            <div className="px-4 py-4 border-t border-indigo-800">
              <button
                onClick={handleLogout}
                className="flex items-center text-indigo-100 hover:text-white w-full text-left"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-indigo-900 text-white">
          <div className="px-4 py-5 flex items-center justify-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Student Portal</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "dashboard"
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Layout className="mr-3 h-5 w-5" />
                Dashboard
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "my-courses"
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
                onClick={() => setActiveTab("my-courses")}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                My Courses
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "browse-courses"
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
                onClick={handleBrowseCourses}
              >
                <BookmarkPlus className="mr-3 h-5 w-5" />
                Browse Courses
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "achievements"
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
                onClick={() => setActiveTab("achievements")}
              >
                <Award className="mr-3 h-5 w-5" />
                Achievements
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "profile"
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-800"
                }`}
                onClick={handleProfileNavigate}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </a>
            </nav>
          </div>
          <div className="px-4 py-4 border-t border-indigo-800">
            <button
              onClick={handleLogout}
              className="flex items-center text-indigo-100 hover:text-white w-full text-left"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
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
                      placeholder="Search courses..."
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
                  {/* Notification bell - Updated */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                      onClick={toggleNotifications}
                    >
                      <span className="sr-only">View notifications</span>
                      <Bell className="h-6 w-6" />
                      {getUnreadNotificationsCount() > 0 && (
                        <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {getUnreadNotificationsCount()}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-2 px-4 border-b border-gray-200 flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            Notifications
                          </h3>
                          {getUnreadNotificationsCount() > 0 && (
                            <button
                              onClick={markAllNotificationsAsRead}
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-4 px-4 text-center text-gray-500">
                              No notifications
                            </div>
                          ) : (
                            <div>
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`flex p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                    notification.read
                                      ? "bg-white"
                                      : "bg-indigo-50"
                                  }`}
                                  onClick={() =>
                                    markNotificationAsRead(notification.id)
                                  }
                                >
                                  <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p
                                      className={`text-sm ${
                                        notification.read
                                          ? "text-gray-700"
                                          : "text-gray-900 font-medium"
                                      }`}
                                    >
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <button
                                      className="text-indigo-600 hover:text-indigo-800"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markNotificationAsRead(notification.id);
                                      }}
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="py-2 px-4 border-t border-gray-200">
                          <a
                            href="#"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex justify-center"
                          >
                            View all notifications
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile dropdown - Updated */}
                  <div className="ml-3 relative" ref={profileRef}>
                    <div>
                      <button
                        className="flex text-sm rounded-full items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={toggleProfile}
                      >
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full object-cover mr-2"
                          src={student.profileImage}
                          alt="Profile"
                        />
                        <span className="text-sm font-medium text-gray-700 mr-1">
                          {student.name}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.email}
                            </p>
                          </div>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={handleProfileNavigate}
                          >
                            <div className="flex items-center">
                              <User className="mr-3 h-4 w-4 text-gray-500" />
                              Your Profile
                            </div>
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <Settings className="mr-3 h-4 w-4 text-gray-500" />
                              Settings
                            </div>
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                              Help Center
                            </div>
                          </a>
                          <div className="border-t border-gray-100">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={handleLogout}
                            >
                              <div className="flex items-center">
                                <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                                Sign out
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile search button */}
                <div className="sm:hidden">
                  <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                    <Search className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile notification button */}
                <div className="sm:hidden">
                  <button
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none relative"
                    onClick={toggleNotifications}
                  >
                    <Bell className="h-6 w-6" />
                    {getUnreadNotificationsCount() > 0 && (
                      <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {getUnreadNotificationsCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content - Main View */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Welcome, {student.name}
              </h1>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Enrolled Courses
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {student.enrolledCourses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Completed Courses
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {student.completedCourses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            In Progress
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {student.inProgressCourses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Learning Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Continue Learning
                  </h2>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    onClick={() => setActiveTab("my-courses")}
                  >
                    View all courses
                  </a>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {enrolledCourses.slice(0, 2).map((course) => (
                    <div
                      key={course.id}
                      className="bg-white overflow-hidden shadow-md rounded-lg flex hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="h-full w-32 object-cover"
                          src={course.image}
                          alt={course.title}
                        />
                      </div>
                      <div className="px-4 py-5 sm:p-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {course.instructor}
                        </p>
                        <div className="mb-3">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-indigo-600 h-2.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Last accessed: {course.lastAccessed}
                          </div>
                          <button
                            className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md flex items-center transition-colors duration-300"
                            onClick={() => handleCourseSelect(course)}
                          >
                            Resume
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Layout for Upcoming and Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Deadlines */}
                <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Upcoming Deadlines
                    </h3>
                    {upcomingDeadlines.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No upcoming deadlines
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {upcomingDeadlines.map((deadline) => (
                          <div
                            key={deadline.id}
                            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Clock className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">
                                {deadline.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {deadline.course}
                              </p>
                              <p className="text-xs text-red-500 font-medium mt-1">
                                Due: {deadline.dueDate}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Recent Notifications
                      </h3>
                      {getUnreadNotificationsCount() > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No new notifications
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {notifications.slice(0, 3).map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                              notification.read ? "bg-white" : "bg-indigo-50"
                            }`}
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="ml-3 flex-1">
                              <p
                                className={`text-sm ${
                                  notification.read
                                    ? "text-gray-700"
                                    : "text-gray-900 font-medium"
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                className="text-indigo-600 hover:text-indigo-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markNotificationAsRead(notification.id);
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        {notifications.length > 3 && (
                          <div className="text-center pt-2">
                            <button
                              onClick={toggleNotifications}
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              View all notifications
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === "my-courses" && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                My Courses
              </h1>
              {enrolledCourses.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No courses yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by enrolling in your first course.
                  </p>
                  <button
                    onClick={handleBrowseCourses}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white overflow-hidden shadow-md rounded-lg flex hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="h-full w-32 object-cover"
                          src={course.image}
                          alt={course.title}
                        />
                      </div>
                      <div className="px-4 py-5 sm:p-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {course.instructor}
                        </p>
                        <div className="mb-3">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-indigo-600 h-2.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Last accessed: {course.lastAccessed}
                          </div>
                          <button
                            className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md flex items-center transition-colors duration-300"
                            onClick={() => handleCourseSelect(course)}
                          >
                            Resume
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Course Content Tab */}
          {activeTab === "course-content" && selectedCourse && (
            <div>
              <button
                onClick={() => setActiveTab("my-courses")}
                className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
              >
                <ChevronRight className="h-5 w-5 mr-1 transform rotate-180" />
                Back to My Courses
              </button>

              <CourseContent courseId={selectedCourse.id} />
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Achievements
              </h1>

              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Your Progress
                  </h2>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        {student.completedCourses} / {student.enrolledCourses}
                      </p>
                      <p className="text-sm text-gray-500">Courses Completed</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700 mb-1">
                      Overall Progress
                    </p>
                    <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (student.completedCourses /
                              student.enrolledCourses) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate display area */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  My Certificates
                </h2>
                {student.completedCourses > 0 ? (
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">
                          Cybersecurity Fundamentals
                        </p>
                        <p className="text-sm text-gray-500">
                          Completed on May 1, 2025
                        </p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-md transition-colors duration-300">
                      View Certificate
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No certificates yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                      Complete courses to earn certificates and showcase your
                      achievements.
                    </p>
                    <button
                      onClick={() => setActiveTab("my-courses")}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                      Continue Learning
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab content would be handled by ProfileSection component */}
          {activeTab === "profile" && <ProfileSection student={student} />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
