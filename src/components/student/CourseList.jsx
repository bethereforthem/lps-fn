import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Clock,
  Star,
  Shield,
  Code,
  Cpu,
  Zap,
  User,
} from "lucide-react";

const CourseList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock categories
  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen },
    { id: "it", name: "Information Technology", icon: Cpu },
    { id: "security", name: "Cybersecurity", icon: Shield },
    { id: "hacking", name: "Ethical Hacking", icon: Code },
    { id: "emerging", name: "Emerging Tech", icon: Zap },
  ];

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockCourses = [
        {
          id: 1,
          title: "Cybersecurity Fundamentals",
          instructor: "Dr. Sarah Mitchell",
          category: "security",
          level: "Beginner",
          duration: "8 weeks",
          rating: 4.8,
          enrolled: 1243,
          description:
            "Learn the core principles of cybersecurity, including threat detection, prevention, and mitigation strategies.",
          image: "/src/assets/images/Cyber-security.jpg",
        },
        {
          id: 2,
          title: "Ethical Hacking & Penetration Testing",
          instructor: "Prof. James Wilson",
          category: "hacking",
          level: "Intermediate",
          duration: "10 weeks",
          rating: 4.9,
          enrolled: 986,
          description:
            "Master the techniques used by ethical hackers to identify and exploit vulnerabilities in systems and networks.",
          image: "/src/assets/images/ethical-hacking.jpg",
        },
        {
          id: 3,
          title: "Computer Hardware Essentials",
          instructor: "Emma Rodriguez",
          category: "it",
          level: "Beginner",
          duration: "6 weeks",
          rating: 4.6,
          enrolled: 1567,
          description:
            "Gain hands-on experience with computer components, assembly, troubleshooting, and maintenance.",
          image: "/src/assets/images/HDW-essentials.jpg",
        },
        {
          id: 4,
          title: "AI & Machine Learning Foundations",
          instructor: "Dr. Alex Chen",
          category: "emerging",
          level: "Intermediate",
          duration: "12 weeks",
          rating: 4.7,
          enrolled: 2134,
          description:
            "Explore the fundamentals of artificial intelligence and machine learning algorithms and applications.",
          image: "/src/assets/images/AI.jpg",
        },
        {
          id: 5,
          title: "Network Administration",
          instructor: "Michael Johnson",
          category: "it",
          level: "Intermediate",
          duration: "9 weeks",
          rating: 4.5,
          enrolled: 876,
          description:
            "Learn to set up, manage, and troubleshoot computer networks in enterprise environments.",
          image: "/src/assets/images/network-admin.jpg",
        },
        {
          id: 6,
          title: "Cloud Computing Services",
          instructor: "Lisa Wang",
          category: "it",
          level: "Advanced",
          duration: "8 weeks",
          rating: 4.8,
          enrolled: 1032,
          description:
            "Master popular cloud platforms, deployment models, and service architectures.",
          image: "/src/assets/images/cloud-computing.jpg",
        },
        {
          id: 7,
          title: "Blockchain Technology",
          instructor: "Dr. Robert Kim",
          category: "emerging",
          level: "Intermediate",
          duration: "7 weeks",
          rating: 4.6,
          enrolled: 745,
          description:
            "Understand the technology behind cryptocurrencies and decentralized applications.",
          image: "/src/assets/images/block-chain.jpg",
        },
        {
          id: 8,
          title: "Digital Forensics",
          instructor: "Amanda Foster",
          category: "security",
          level: "Advanced",
          duration: "10 weeks",
          rating: 4.9,
          enrolled: 621,
          description:
            "Learn techniques for collecting, analyzing, and preserving digital evidence for investigations.",
          image: "/src/assets/images/digital-forensic.jpg",
        },
      ];

      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter courses based on search query and category
  useEffect(() => {
    let result = courses;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((course) => course.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(result);
  }, [searchQuery, selectedCategory, courses]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const IconComponent = category ? category.icon : BookOpen;
    return <IconComponent size={18} />;
  };

  const handleEnroll = (courseId, e) => {
    e.stopPropagation(); // Prevent triggering course click

    // Check if user is logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // In a real app, this would call an API to enroll the user
    // For now, we'll just show an alert
    alert(`Successfully enrolled in course #${courseId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Explore Courses
            </h1>
            <p className="mt-2 text-gray-600">
              Discover our comprehensive range of technical courses
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-4">
            <Filter className="text-gray-400 mr-2" size={20} />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <category.icon className="mr-2" size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded">
                    {course.level}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <div className="flex items-center mr-4">
                      {getCategoryIcon(course.category)}
                      <span className="ml-1 capitalize">{course.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {course.instructor}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {course.enrolled.toLocaleString()} students
                    </span>
                    <button
                      onClick={(e) => handleEnroll(course.id, e)}
                      className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
