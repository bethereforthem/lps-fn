import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LecturerProfile from "../components/lecturer/LecturerProfile";
import CourseCreation from "../components/lecturer/CourseCreation";
import StudentProgress from "../components/lecturer/StudentProgress";
import StudentInteraction from "../components/lecturer/StudentInteraction";
import {
  Layout,
  User,
  BookOpen,
  FileText,
  PlusCircle,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  ChevronDown,
  Download,
  ExternalLink,
  Eye,
  FilePlus,
  Filter,
  Grid,
  List,
  Mail,
  Monitor,
  Phone,
  Plus,
  Save,
  Share2,
  Shield,
  Star,
  Calendar,
  Sliders,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  UserPlus,
  Award,
  BarChart,
  Clipboard,
  FileText as FileTextIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { ROUTES } from "../utils/constants";

const LecturerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeSubComponent, setActiveSubComponent] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // For materials page: "grid" or "list"
  const [filterOpen, setFilterOpen] = useState(false); // For students and materials filtering
  const [studentFilter, setStudentFilter] = useState("all"); // Options: all, active, inactive
  const [materialFilter, setMaterialFilter] = useState("all"); // Options: all, lectures, assignments, quizzes
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Lecturer data - use currentUser when available
  const lecturer = {
    // name: currentUser?.fname + " " + currentUser?.lname || "Dr. Sarah Mitchell",
    name: "Prof. Dan" + " " + "Mucyo" || "Dr. Sarah Mitchell", // Will be replaced by the data from the database
    email: currentUser?.email || "sarah.mitchell@example.com",
    department: currentUser?.department || "Cybersecurity",
    activeCourses: 3,
    totalStudents: 124,
    profileImage:
      currentUser?.profileImage || "/src/assets/images/prof-image.jpg",
  };

  // Mock pending tasks
  const pendingTasks = [
    {
      id: 1,
      title: "Grade Security Analysis Assignments",
      course: "Cybersecurity Fundamentals",
      dueDate: "Tomorrow",
      count: 12,
      priority: "high",
    },
    {
      id: 2,
      title: "Prepare next lecture materials",
      course: "Advanced Network Security",
      dueDate: "May 5",
      count: 1,
      priority: "medium",
    },
    {
      id: 3,
      title: "Review student project proposals",
      course: "Secure Coding Practices",
      dueDate: "May 10",
      count: 8,
      priority: "low",
    },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: "assignment",
      title: "Network Security Quiz graded",
      course: "Cybersecurity Fundamentals",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "content",
      title: "New lecture video uploaded",
      course: "Advanced Network Security",
      time: "Yesterday",
    },
    {
      id: 3,
      type: "discussion",
      title: "Replied to student question",
      course: "Secure Coding Practices",
      time: "3 days ago",
    },
  ];

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      profileImage: "/src/assets/images/student-prof.jpeg",
      enrollmentDate: "January 15, 2025",
      courses: ["Cybersecurity Fundamentals", "Advanced Network Security"],
      status: "active",
      lastActive: "Today",
      progress: 78,
      gradesAvg: 92,
    },
    {
      id: 2,
      name: "Jamie Smith",
      email: "jamie.smith@example.com",
      profileImage: "/src/assets/images/jamie.jpg",
      enrollmentDate: "February 3, 2025",
      courses: ["Cybersecurity Fundamentals", "Secure Coding Practices"],
      status: "active",
      lastActive: "Yesterday",
      progress: 65,
      gradesAvg: 88,
    },
    {
      id: 3,
      name: "Morgan Taylor",
      email: "morgan.taylor@example.com",
      profileImage: "/src/assets/images/taylor.jpg",
      enrollmentDate: "January 10, 2025",
      courses: ["Advanced Network Security"],
      status: "inactive",
      lastActive: "3 weeks ago",
      progress: 32,
      gradesAvg: 71,
    },
    {
      id: 4,
      name: "Riley Adams",
      email: "riley.adams@example.com",
      profileImage: "/src/assets/images/adams.jpeg",
      enrollmentDate: "March 1, 2025",
      courses: ["Cybersecurity Fundamentals", "Secure Coding Practices"],
      status: "active",
      lastActive: "2 days ago",
      progress: 85,
      gradesAvg: 94,
    },
    {
      id: 5,
      name: "Casey Wilson",
      email: "casey.wilson@example.com",
      profileImage: "/src/assets/images/wilson.jpeg",
      enrollmentDate: "February 15, 2025",
      courses: ["Advanced Network Security"],
      status: "active",
      lastActive: "Today",
      progress: 72,
      gradesAvg: 85,
    },
    {
      id: 6,
      name: "Jordan Lee",
      email: "jordan.lee@example.com",
      profileImage: "/src/assets/images/jordan.jpeg", // the images will be fetched from the database
      enrollmentDate: "January 22, 2025",
      courses: ["Secure Coding Practices"],
      status: "inactive",
      lastActive: "4 weeks ago",
      progress: 45,
      gradesAvg: 76,
    },
    {
      id: 7,
      name: "Drew Parker",
      email: "drew.parker@example.com",
      profileImage: "/src/assets/images/parker.jpg",
      enrollmentDate: "March 10, 2025",
      courses: ["Cybersecurity Fundamentals"],
      status: "active",
      lastActive: "5 days ago",
      progress: 52,
      gradesAvg: 83,
    },
  ];

  // Mock materials data
  const materials = [
    {
      id: 1,
      title: "Introduction to Network Security",
      type: "lecture",
      course: "Cybersecurity Fundamentals",
      dateAdded: "March 15, 2025",
      fileSize: "25 MB",
      fileType: "video/mp4",
      duration: "45 mins",
      views: 89,
      thumbnail: "/src/assets/images/secure-coding.jpg",
    },
    {
      id: 2,
      title: "Firewall Configuration Guide",
      type: "document",
      course: "Advanced Network Security",
      dateAdded: "March 20, 2025",
      fileSize: "3.2 MB",
      fileType: "application/pdf",
      pages: 18,
      views: 42,
      thumbnail: "/src/assets/images/firewall-config.jpg",
    },
    {
      id: 3,
      title: "Weekly Assessment: Threat Modeling",
      type: "quiz",
      course: "Cybersecurity Fundamentals",
      dateAdded: "March 22, 2025",
      questions: 15,
      timeLimit: "30 mins",
      attempts: 64,
      avgScore: 78,
      thumbnail: "/src/assets/images/threat-modeling.jpg",
    },
    {
      id: 4,
      title: "Secure Coding Best Practices",
      type: "lecture",
      course: "Secure Coding Practices",
      dateAdded: "March 25, 2025",
      fileSize: "32 MB",
      fileType: "video/mp4",
      duration: "60 mins",
      views: 56,
      thumbnail: "/src/assets/images/secure-coding-best.jpg",
    },
    {
      id: 5,
      title: "Midterm Project: Security Analysis",
      type: "assignment",
      course: "Cybersecurity Fundamentals",
      dateAdded: "March 28, 2025",
      dueDate: "April 15, 2025",
      submissions: 32,
      gradingStatus: "In Progress",
      thumbnail: "/src/assets/images/security-analysis.jpg",
    },
    {
      id: 6,
      title: "SQL Injection Prevention",
      type: "document",
      course: "Secure Coding Practices",
      dateAdded: "April 2, 2025",
      fileSize: "1.8 MB",
      fileType: "application/pdf",
      pages: 12,
      views: 38,
      thumbnail: "/src/assets/images/sql-injection.jpg",
    },
    {
      id: 7,
      title: "Final Exam Review Guide",
      type: "document",
      course: "Advanced Network Security",
      dateAdded: "April 5, 2025",
      fileSize: "5.4 MB",
      fileType: "application/pdf",
      pages: 24,
      views: 29,
      thumbnail: "/src/assets/images/review.jpg",
    },
    {
      id: 8,
      title: "Lab Exercise: Penetration Testing",
      type: "assignment",
      course: "Advanced Network Security",
      dateAdded: "April 7, 2025",
      dueDate: "April 21, 2025",
      submissions: 18,
      gradingStatus: "Not Started",
      thumbnail: "/src/assets/images/penetration-testing.jpg",
    },
  ];

  // Mock analytics data
  const analyticsData = {
    courseEngagement: [
      { course: "Cybersecurity Fundamentals", engagement: 85, students: 45 },
      { course: "Advanced Network Security", engagement: 72, students: 32 },
      { course: "Secure Coding Practices", engagement: 68, students: 47 },
    ],
    materialViews: [
      {
        name: "Week 1",
        lectures: 120,
        documents: 85,
        assignments: 43,
        quizzes: 78,
      },
      {
        name: "Week 2",
        lectures: 95,
        documents: 72,
        assignments: 56,
        quizzes: 64,
      },
      {
        name: "Week 3",
        lectures: 110,
        documents: 90,
        assignments: 62,
        quizzes: 70,
      },
      {
        name: "Week 4",
        lectures: 125,
        documents: 82,
        assignments: 49,
        quizzes: 85,
      },
      {
        name: "Week 5",
        lectures: 140,
        documents: 95,
        assignments: 68,
        quizzes: 92,
      },
    ],
    studentActivity: {
      active: 82,
      inactive: 18,
      newThisMonth: 12,
      completionRate: 68,
    },
    gradeDistribution: [
      { range: "90-100", count: 24 },
      { range: "80-89", count: 36 },
      { range: "70-79", count: 28 },
      { range: "60-69", count: 15 },
      { range: "Below 60", count: 21 },
    ],
    weeklyActivity: [
      { day: "Mon", count: 86 },
      { day: "Tue", count: 72 },
      { day: "Wed", count: 94 },
      { day: "Thu", count: 65 },
      { day: "Fri", count: 58 },
      { day: "Sat", count: 42 },
      { day: "Sun", count: 36 },
    ],
  };

  // Mock settings options
  const settingsOptions = {
    profile: {
      notifications: {
        email: true,
        browser: true,
        mobile: false,
      },
      appearance: {
        theme: "light", // light or dark
        compactView: false,
      },
    },
    course: {
      defaultVisibility: "draft", // draft or published
      autoSaveInterval: 5, // minutes
      allowStudentDiscussions: true,
      gradingScale: "letter", // letter or percentage
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30, // minutes
      lastPasswordChange: "April 1, 2025",
    },
  };

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // Use mock data for now - in a real app, this would be an API call
        // const response = await api.get('/lecturer/courses');
        // setCourses(response.data);

        // Mock data
        setCourses([
          {
            id: 1,
            title: "Cybersecurity Fundamentals",
            description:
              "Introduction to core concepts of cybersecurity including threat models, security protocols, and defense mechanisms.",
            studentsEnrolled: 45,
            progress: 85,
            thumbnail: "/src/assets/images/Cyber-security.jpg",
            lastUpdated: "2 days ago",
            status: "active",
          },
          {
            id: 2,
            title: "Advanced Network Security",
            description:
              "Deep dive into network security protocols, firewalls, IDS/IPS, and secure network design principles.",
            studentsEnrolled: 32,
            progress: 62,
            thumbnail: "/src/assets/images/network-security.jpg",
            lastUpdated: "1 week ago",
            status: "active",
          },
          {
            id: 3,
            title: "Secure Coding Practices",
            description:
              "Learn how to write secure code and avoid common vulnerabilities and security pitfalls in software development.",
            studentsEnrolled: 47,
            progress: 35,
            thumbnail: "/src/assets/images/secure-coding.jpg",
            lastUpdated: "3 days ago",
            status: "active",
          },
          {
            id: 4,
            title: "Ethical Hacking Lab",
            description:
              "Hands-on lab exercises for ethical hacking techniques, penetration testing, and vulnerability assessment.",
            studentsEnrolled: 0,
            progress: 0,
            thumbnail: "/src/assets/images/ethical-hacking.jpg",
            lastUpdated: "Just created",
            status: "draft",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter students based on search query and status filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      studentFilter === "all" || student.status === studentFilter;

    return matchesSearch && matchesFilter;
  });

  // Filter materials based on search query and type filter
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      materialFilter === "all" || material.type === materialFilter;

    return matchesSearch && matchesFilter;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAddCourseModal = () => {
    setShowAddCourseModal(!showAddCourseModal);
  };

  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const handleManageCourse = (course, action = null) => {
    setSelectedCourse(course);

    if (action) {
      setActiveSubComponent(action);
      setActiveTab("course-management");
    } else {
      // Default action
      setActiveSubComponent("edit");
      setActiveTab("course-management");
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Helper function to render the appropriate component for course management
  const renderCourseManagementComponent = () => {
    if (!selectedCourse) return null;

    switch (activeSubComponent) {
      case "edit":
        return <CourseCreation editCourseId={selectedCourse.id} />;
      case "progress":
        return <StudentProgress courseId={selectedCourse.id} />;
      case "interactions":
        return <StudentInteraction courseId={selectedCourse.id} />;
      default:
        return <CourseCreation editCourseId={selectedCourse.id} />;
    }
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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800 text-white">
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
                <span className="text-xl font-bold">Lecturer Portal</span>
              </div>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Layout className="mr-3 h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "courses"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("courses")}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  My Courses
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "students"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("students")}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Students
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "materials"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("materials")}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Materials
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "interactions"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("interactions")}
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Interactions
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "analytics"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  Analytics
                </a>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === "profile"
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </a>
              </nav>
            </div>
            <div className="px-4 py-4 border-t border-indigo-700">
              <a
                href="#"
                className="flex items-center text-indigo-100 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Sign out</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-indigo-800 text-white">
          <div className="px-4 py-5 flex items-center justify-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Lecturer Portal</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <nav className="flex-1 px-2 py-4 space-y-1">
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "dashboard"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Layout className="mr-3 h-5 w-5" />
                Dashboard
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "courses" || activeTab === "course-management"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => {
                  setActiveTab("courses");
                  setSelectedCourse(null);
                }}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                My Courses
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "students"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => setActiveTab("students")}
              >
                <Users className="mr-3 h-5 w-5" />
                Students
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "materials"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => setActiveTab("materials")}
              >
                <FileText className="mr-3 h-5 w-5" />
                Materials
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "interactions"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => setActiveTab("interactions")}
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                Interactions
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "analytics"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart2 className="mr-3 h-5 w-5" />
                Analytics
              </a>
              <a
                href="#"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "profile"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </a>
            </nav>
          </div>
          <div className="px-4 py-4 border-t border-indigo-700">
            <a
              href="#"
              className="flex items-center text-indigo-100 hover:text-white"
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
                      placeholder="Search courses, materials..."
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
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={toggleSettingsModal}
                  >
                    <span className="sr-only">Settings</span>
                    <Settings className="h-6 w-6" />
                  </button>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative flex items-center">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={lecturer.profileImage}
                        alt="Profile"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {lecturer.name}
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
          {/* Course Management Tab - New Tab for CourseCreation, StudentProgress, and StudentInteraction */}
          {activeTab === "course-management" && selectedCourse && (
            <div>
              {/* Navigation/Tabs for the Course */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {selectedCourse.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {activeSubComponent === "edit"
                        ? "Edit Course"
                        : activeSubComponent === "progress"
                        ? "Student Progress"
                        : "Student Interactions"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveSubComponent("edit")}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        activeSubComponent === "edit"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => setActiveSubComponent("progress")}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        activeSubComponent === "progress"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <BarChart2 className="w-4 h-4 inline mr-1" />
                      Progress
                    </button>
                    <button
                      onClick={() => setActiveSubComponent("interactions")}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        activeSubComponent === "interactions"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 inline mr-1" />
                      Interactions
                    </button>
                  </div>
                </div>
              </div>

              {/* Render the appropriate component */}
              {renderCourseManagementComponent()}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Lecturer Dashboard
              </h1>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Courses
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {lecturer.activeCourses}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Students
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {lecturer.totalStudents}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Tasks
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {pendingTasks.length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Courses Quick View */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Active Courses
                  </h2>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                    onClick={() => setActiveTab("courses")}
                  >
                    View all courses
                  </a>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses
                    .filter((course) => course.status === "active")
                    .slice(0, 2)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="bg-white overflow-hidden shadow rounded-lg flex"
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-full w-32 object-cover"
                            src={course.thumbnail}
                            alt={course.title}
                          />
                        </div>
                        <div className="px-4 py-5 sm:p-6 flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Students: {course.studentsEnrolled}
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
                                {course.progress}% complete
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Last updated: {course.lastUpdated}
                            </div>
                            <a
                              href="#"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => handleManageCourse(course)}
                            >
                              Manage
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Two Column Layout for Tasks and Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Tasks */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Pending Tasks
                    </h3>
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div
                              className={`rounded-full p-1 ${
                                task.priority === "high"
                                  ? "bg-red-100"
                                  : task.priority === "medium"
                                  ? "bg-amber-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              <Clock
                                className={`h-5 w-5 ${
                                  task.priority === "high"
                                    ? "text-red-500"
                                    : task.priority === "medium"
                                    ? "text-amber-500"
                                    : "text-blue-500"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {task.title}
                              </h4>
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  task.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : task.priority === "medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {task.course} - {task.count}{" "}
                              {task.count === 1 ? "item" : "items"}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-gray-500">
                                Due: {task.dueDate}
                              </p>
                              <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                                Complete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Recent Activities
                    </h3>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex p-3 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {activity.type === "assignment" && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {activity.type === "content" && (
                              <Upload className="h-5 w-5 text-indigo-500" />
                            )}
                            {activity.type === "discussion" && (
                              <Users className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-900 font-medium">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.course}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  My Courses
                </h1>
                <button
                  onClick={toggleAddCourseModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create New Course
                </button>
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
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <li key={course.id}>
                      <div className="block hover:bg-gray-50">
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              <img
                                className="h-16 w-16 rounded-md object-cover"
                                src={course.thumbnail}
                                alt={course.title}
                              />
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div>
                                <div className="flex items-center">
                                  <p className="text-lg font-medium text-indigo-600 truncate">
                                    {course.title}
                                  </p>
                                  {course.status === "draft" && (
                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                      Draft
                                    </span>
                                  )}
                                  {course.status === "active" && (
                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-500 truncate">
                                  {course.description}
                                </p>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  <p>
                                    {course.studentsEnrolled}{" "}
                                    {course.studentsEnrolled === 1
                                      ? "student"
                                      : "students"}{" "}
                                    enrolled
                                  </p>
                                  <span className="mx-2">•</span>
                                  <p>Last updated {course.lastUpdated}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex">
                              <button
                                onClick={() =>
                                  handleManageCourse(course, "edit")
                                }
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleManageCourse(course, "progress")
                                }
                                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <BarChart2 className="h-4 w-4 mr-1" />
                                Progress
                              </button>
                              <button
                                onClick={() =>
                                  handleManageCourse(course, "interactions")
                                }
                                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Q&A
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No courses found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new course.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={toggleAddCourseModal}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Create New Course
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Tab - New Implementation */}
          {activeTab === "students" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Student Management
                </h1>
                <button
                  onClick={() => {}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add New Student
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students by name or email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={toggleFilter}
                    >
                      <Filter className="h-5 w-5 mr-2 text-gray-500" />
                      Filter
                      <ChevronDown className="h-5 w-5 ml-2 text-gray-500" />
                    </button>

                    {filterOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              studentFilter === "all"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setStudentFilter("all");
                              setFilterOpen(false);
                            }}
                          >
                            All Students
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              studentFilter === "active"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setStudentFilter("active");
                              setFilterOpen(false);
                            }}
                          >
                            Active Students
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              studentFilter === "inactive"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setStudentFilter("inactive");
                              setFilterOpen(false);
                            }}
                          >
                            Inactive Students
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Students
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {students.length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Students
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {
                                students.filter((s) => s.status === "active")
                                  .length
                              }
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                        <Award className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Average Performance
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {Math.round(
                                students.reduce(
                                  (acc, s) => acc + s.gradesAvg,
                                  0
                                ) / students.length
                              )}
                              %
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student List Table */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student
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
                          Courses
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Progress
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Last Active
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={student.profileImage}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                          ${
                                            student.status === "active"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                            >
                              {student.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.courses.length} courses
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.courses[0]}
                              {student.courses.length > 1 ? " + more" : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    student.progress > 80
                                      ? "bg-green-600"
                                      : student.progress > 50
                                      ? "bg-indigo-600"
                                      : "bg-amber-500"
                                  }`}
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {student.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Message
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12 mt-6 bg-white rounded-lg shadow">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No students found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Materials Tab - New Implementation */}
          {activeTab === "materials" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Course Materials
                </h1>
                <button
                  onClick={() => {}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FilePlus className="h-5 w-5 mr-2" />
                  Add Material
                </button>
              </div>

              {/* Search and Filter Bar */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search materials..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={toggleFilter}
                    >
                      <Filter className="h-5 w-5 mr-2 text-gray-500" />
                      Filter
                      <ChevronDown className="h-5 w-5 ml-2 text-gray-500" />
                    </button>

                    {filterOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              materialFilter === "all"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setMaterialFilter("all");
                              setFilterOpen(false);
                            }}
                          >
                            All Types
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              materialFilter === "lecture"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setMaterialFilter("lecture");
                              setFilterOpen(false);
                            }}
                          >
                            Lectures
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              materialFilter === "document"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setMaterialFilter("document");
                              setFilterOpen(false);
                            }}
                          >
                            Documents
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              materialFilter === "quiz"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setMaterialFilter("quiz");
                              setFilterOpen(false);
                            }}
                          >
                            Quizzes
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              materialFilter === "assignment"
                                ? "bg-indigo-100 text-indigo-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setMaterialFilter("assignment");
                              setFilterOpen(false);
                            }}
                          >
                            Assignments
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() => handleViewModeChange("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleViewModeChange("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Monitor className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Lectures
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {
                                materials.filter((m) => m.type === "lecture")
                                  .length
                              }
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <FileTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Documents
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {
                                materials.filter((m) => m.type === "document")
                                  .length
                              }
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <Clipboard className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Assignments
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {
                                materials.filter((m) => m.type === "assignment")
                                  .length
                              }
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                        <Clipboard className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Quizzes
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {
                                materials.filter((m) => m.type === "quiz")
                                  .length
                              }
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials Grid/List View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="relative">
                        <img
                          src={material.thumbnail}
                          alt={material.title}
                          className="h-40 w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${
                                          material.type === "lecture"
                                            ? "bg-indigo-100 text-indigo-800"
                                            : material.type === "document"
                                            ? "bg-blue-100 text-blue-800"
                                            : material.type === "quiz"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                          >
                            {material.type.charAt(0).toUpperCase() +
                              material.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-4">
                        <h3
                          className="text-lg font-medium text-gray-900 truncate"
                          title={material.title}
                        >
                          {material.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {material.course}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Added: {material.dateAdded}
                          </span>

                          {material.type === "lecture" && (
                            <span className="text-xs text-gray-500">
                              {material.duration}
                            </span>
                          )}
                          {material.type === "document" && (
                            <span className="text-xs text-gray-500">
                              {material.pages} pages
                            </span>
                          )}
                          {material.type === "quiz" && (
                            <span className="text-xs text-gray-500">
                              {material.questions} questions
                            </span>
                          )}
                          {material.type === "assignment" && (
                            <span className="text-xs text-gray-500">
                              Due: {material.dueDate}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </button>
                          <button className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Preview
                          </button>
                          <button className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900">
                            <Share2 className="h-3.5 w-3.5 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {filteredMaterials.map((material) => (
                      <li key={material.id}>
                        <div className="block hover:bg-gray-50">
                          <div className="flex items-center px-4 py-4 sm:px-6">
                            <div className="min-w-0 flex-1 flex items-center">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-16 w-16 rounded-md object-cover"
                                  src={material.thumbnail}
                                  alt={material.title}
                                />
                              </div>
                              <div className="min-w-0 flex-1 px-4">
                                <div>
                                  <div className="flex items-center">
                                    <p className="text-lg font-medium text-indigo-600 truncate">
                                      {material.title}
                                    </p>
                                    <span
                                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${
                                                      material.type ===
                                                      "lecture"
                                                        ? "bg-indigo-100 text-indigo-800"
                                                        : material.type ===
                                                          "document"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : material.type ===
                                                          "quiz"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                    >
                                      {material.type.charAt(0).toUpperCase() +
                                        material.type.slice(1)}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {material.course}
                                  </p>
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                    <p>Added {material.dateAdded}</p>
                                    <span className="mx-2">•</span>

                                    {material.type === "lecture" && (
                                      <>
                                        <Monitor className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>{material.duration}</p>
                                        <span className="mx-2">•</span>
                                        <p>{material.views} views</p>
                                      </>
                                    )}

                                    {material.type === "document" && (
                                      <>
                                        <FileTextIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>{material.pages} pages</p>
                                        <span className="mx-2">•</span>
                                        <p>{material.views} views</p>
                                      </>
                                    )}

                                    {material.type === "quiz" && (
                                      <>
                                        <Clipboard className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>{material.questions} questions</p>
                                        <span className="mx-2">•</span>
                                        <p>{material.timeLimit} time limit</p>
                                      </>
                                    )}

                                    {material.type === "assignment" && (
                                      <>
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <p>Due {material.dueDate}</p>
                                        <span className="mx-2">•</span>
                                        <p>
                                          {material.submissions} submissions
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </button>
                              <button className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filteredMaterials.length === 0 && (
                <div className="text-center py-12 mt-6 bg-white rounded-lg shadow">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No materials found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "interactions" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  All Student Interactions
                </h1>
              </div>

              {/* If no course is selected, show a course selector */}
              {!selectedCourse ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select a Course
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses
                      .filter((c) => c.status === "active")
                      .map((course) => (
                        <div
                          key={course.id}
                          onClick={() =>
                            handleManageCourse(course, "interactions")
                          }
                          className="border rounded-lg p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
                        >
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {course.studentsEnrolled} students enrolled
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <StudentInteraction courseId={selectedCourse.id} />
              )}
            </div>
          )}

          {/* Analytics Tab - New Implementation */}
          {activeTab === "analytics" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Learning Analytics
                </h1>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    This Semester
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
              </div>

              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Active Students
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {analyticsData.studentActivity.active}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Completion Rate
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {analyticsData.studentActivity.completionRate}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <BarChart className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Avg. Engagement
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {Math.round(
                                analyticsData.courseEngagement.reduce(
                                  (acc, item) => acc + item.engagement,
                                  0
                                ) / analyticsData.courseEngagement.length
                              )}
                              %
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                        <UserPlus className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            New Students
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {analyticsData.studentActivity.newThisMonth}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Engagement */}
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Course Engagement
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.courseEngagement.map((course) => (
                      <div key={course.course} className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {course.course}
                          </span>
                          <span className="text-sm text-gray-500">
                            {course.engagement}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${course.engagement}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {course.students} students enrolled
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Weekly Activity
                  </h3>
                  <div className="h-64 flex items-end justify-between">
                    {analyticsData.weeklyActivity.map((day) => (
                      <div key={day.day} className="flex flex-col items-center">
                        <div
                          className="bg-indigo-600 w-12 rounded-t-md"
                          style={{ height: `${day.count / 1.5}px` }}
                        ></div>
                        <span className="text-xs font-medium text-gray-700 mt-2">
                          {day.day}
                        </span>
                        <span className="text-xs text-gray-500">
                          {day.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Material Views and Grade Distribution */}
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Material Views by Type
                  </h3>
                  <div className="h-72">
                    <div className="h-64 flex items-end space-x-2">
                      {analyticsData.materialViews.map((week) => (
                        <div
                          key={week.name}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div className="w-full flex justify-between items-end h-56">
                            <div
                              className="bg-indigo-600 w-3 rounded-t-sm"
                              style={{ height: `${week.lectures / 2}px` }}
                            ></div>
                            <div
                              className="bg-blue-500 w-3 rounded-t-sm"
                              style={{ height: `${week.documents / 2}px` }}
                            ></div>
                            <div
                              className="bg-green-500 w-3 rounded-t-sm"
                              style={{ height: `${week.assignments / 2}px` }}
                            ></div>
                            <div
                              className="bg-amber-500 w-3 rounded-t-sm"
                              style={{ height: `${week.quizzes / 2}px` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700 mt-2">
                            {week.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center items-center mt-4 space-x-4">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-indigo-600 rounded-sm mr-1"></div>
                        <span className="text-xs text-gray-600">Lectures</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-blue-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-gray-600">Documents</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-gray-600">
                          Assignments
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-amber-500 rounded-sm mr-1"></div>
                        <span className="text-xs text-gray-600">Quizzes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Grade Distribution
                  </h3>
                  <div className="space-y-3">
                    {analyticsData.gradeDistribution.map((grade) => (
                      <div key={grade.range} className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {grade.range}
                          </span>
                          <span className="text-sm text-gray-500">
                            {grade.count} students
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              grade.range === "90-100"
                                ? "bg-green-600"
                                : grade.range === "80-89"
                                ? "bg-green-500"
                                : grade.range === "70-79"
                                ? "bg-yellow-500"
                                : grade.range === "60-69"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${
                                (grade.count /
                                  analyticsData.gradeDistribution.reduce(
                                    (acc, g) => acc + g.count,
                                    0
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Metrics */}
              <div className="mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Advanced Metrics & Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Content Engagement
                      </h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        76%
                      </p>
                      <p className="text-sm text-gray-500">
                        Average time spent on materials
                      </p>
                      <div className="mt-2 flex items-center text-xs text-green-700">
                        <span>↑ 12% from last month</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Assignment Completion
                      </h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        83%
                      </p>
                      <p className="text-sm text-gray-500">
                        Assignments submitted on time
                      </p>
                      <div className="mt-2 flex items-center text-xs text-red-700">
                        <span>↓ 3% from last month</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Quiz Performance
                      </h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        72%
                      </p>
                      <p className="text-sm text-gray-500">
                        Average quiz score
                      </p>
                      <div className="mt-2 flex items-center text-xs text-green-700">
                        <span>↑ 5% from last month</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Material Ratings
                      </h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        4.2/5
                      </p>
                      <p className="text-sm text-gray-500">
                        Average rating from students
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-700">
                        <span>= No change from last month</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Forum Activity
                      </h4>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">
                        156
                      </p>
                      <p className="text-sm text-gray-500">
                        Discussion posts this month
                      </p>
                      <div className="mt-2 flex items-center text-xs text-green-700">
                        <span>↑ 23% from last month</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Retention Risk
                      </h4>
                      <p className="text-2xl font-bold text-amber-600 mb-2">
                        12%
                      </p>
                      <p className="text-sm text-gray-500">
                        Students at risk of dropping out
                      </p>
                      <div className="mt-2 flex items-center text-xs text-red-700">
                        <span>↑ 2% from last month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Generation and Export Section */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Generate Detailed Reports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="bg-indigo-100 rounded-md p-2 mr-3">
                        <BarChart className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Course Performance
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      Detailed metrics on student performance across all courses
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-100 rounded-md p-2 mr-3">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Student Engagement
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      Analysis of student interaction and participation
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="bg-amber-100 rounded-md p-2 mr-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Content Effectiveness
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      Measure how effective each learning material is
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Download className="h-4 w-4 mr-2" />
                    Export as Excel
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Your Profile
                </h1>
              </div>
              <LecturerProfile />
            </div>
          )}
        </main>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={toggleAddCourseModal}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create New Course
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Course Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="e.g. Introduction to Cybersecurity"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Course Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Provide a brief description of the course..."
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select a category</option>
                          <option value="IT">Information Technology</option>
                          <option value="Security">Cybersecurity</option>
                          <option value="hacking">Ethical Hacking</option>
                          <option value="Hardware">Computer Hardware</option>
                          <option value="Emerging">
                            Emerging Technologies
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Course Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleAddCourseModal}
                >
                  Create Course
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleAddCourseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={toggleSettingsModal}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Settings className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Settings
                    </h3>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <div className="divide-y divide-gray-200">
                        {/* Profile Settings */}
                        <div className="py-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Profile Settings
                          </h4>

                          <div className="mt-4 space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex-grow flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    Email Notifications
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Receive email notifications about student
                                    activities
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className={`${
                                    settingsOptions.profile.notifications.email
                                      ? "bg-indigo-600"
                                      : "bg-gray-200"
                                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                  <span
                                    className={`${
                                      settingsOptions.profile.notifications
                                        .email
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                  ></span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex-grow flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    Browser Notifications
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Receive push notifications in your browser
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className={`${
                                    settingsOptions.profile.notifications
                                      .browser
                                      ? "bg-indigo-600"
                                      : "bg-gray-200"
                                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                  <span
                                    className={`${
                                      settingsOptions.profile.notifications
                                        .browser
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                  ></span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex-grow flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    Dark Mode
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Use dark theme for the interface
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className={`${
                                    settingsOptions.profile.appearance.theme ===
                                    "dark"
                                      ? "bg-indigo-600"
                                      : "bg-gray-200"
                                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                  <span
                                    className={`${
                                      settingsOptions.profile.appearance
                                        .theme === "dark"
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                  ></span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Course Settings */}
                        <div className="py-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Course Settings
                          </h4>

                          <div className="mt-4 space-y-4">
                            <div>
                              <label
                                htmlFor="default-visibility"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Default Course Visibility
                              </label>
                              <select
                                id="default-visibility"
                                name="default-visibility"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                defaultValue={
                                  settingsOptions.course.defaultVisibility
                                }
                              >
                                <option value="draft">
                                  Draft (hidden from students)
                                </option>
                                <option value="published">
                                  Published (visible to students)
                                </option>
                              </select>
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex-grow flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    Allow Student Discussions
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Enable discussion forums for all courses by
                                    default
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className={`${
                                    settingsOptions.course
                                      .allowStudentDiscussions
                                      ? "bg-indigo-600"
                                      : "bg-gray-200"
                                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                  <span
                                    className={`${
                                      settingsOptions.course
                                        .allowStudentDiscussions
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                  ></span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="grading-scale"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Default Grading Scale
                              </label>
                              <select
                                id="grading-scale"
                                name="grading-scale"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                defaultValue={
                                  settingsOptions.course.gradingScale
                                }
                              >
                                <option value="letter">
                                  Letter Grade (A, B, C, D, F)
                                </option>
                                <option value="percentage">
                                  Percentage (0-100%)
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Security Settings */}
                        <div className="py-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Security Settings
                          </h4>

                          <div className="mt-4 space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex-grow flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    Two-Factor Authentication
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Add an extra layer of security to your
                                    account
                                  </span>
                                </span>
                                <button
                                  type="button"
                                  className={`${
                                    settingsOptions.security.twoFactorAuth
                                      ? "bg-indigo-600"
                                      : "bg-gray-200"
                                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                  <span
                                    className={`${
                                      settingsOptions.security.twoFactorAuth
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                  ></span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="session-timeout"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Session Timeout (minutes)
                              </label>
                              <select
                                id="session-timeout"
                                name="session-timeout"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                defaultValue={
                                  settingsOptions.security.sessionTimeout
                                }
                              >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">60 minutes</option>
                                <option value="120">2 hours</option>
                              </select>
                            </div>

                            <div>
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Change Password
                              </button>
                              <p className="mt-1 text-xs text-gray-500">
                                Last changed:{" "}
                                {settingsOptions.security.lastPasswordChange}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleSettingsModal}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={toggleSettingsModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
