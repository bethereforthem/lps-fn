import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Clock,
  Users,
  Award,
  Star,
  Calendar,
  BookOpen,
  Video,
  FileText,
  Download,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  PlayCircle,
  Lock,
  Check,
  Shield,
  Code,
  Cpu,
  Zap,
  ArrowLeft,
} from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState([]);

  // Mock fetch of course data - in a real app, this would be an API call
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock course details
      const mockCourse = {
        id: parseInt(id),
        title: "Cybersecurity Fundamentals",
        instructor: "Dr. Sarah Mitchell",
        instructorRole: "Senior Security Specialist",
        instructorBio:
          "Dr. Sarah Mitchell has over 15 years of experience in cybersecurity and has worked with major tech companies to develop security protocols.",
        category: "security",
        level: "Beginner",
        duration: "8 weeks",
        rating: 4.8,
        enrolled: 1243,
        lastUpdated: "April 2025",
        description:
          "Learn the core principles of cybersecurity, including threat detection, prevention, and mitigation strategies. This comprehensive course provides both theoretical knowledge and practical skills needed to protect digital assets.",
        longDescription:
          "This course is designed for beginners who want to enter the field of cybersecurity. You'll learn about the fundamentals of information security, network security, cryptography, and risk management. Through hands-on labs and real-world case studies, you'll develop practical skills that can be applied immediately in your career. Upon completion, you'll be prepared for entry-level cybersecurity positions and have a solid foundation for more advanced security certifications.",
        image: "/api/placeholder/800/400",
        price: 49.99,
        whatYouWillLearn: [
          "Understand core cybersecurity concepts and principles",
          "Identify common security threats and vulnerabilities",
          "Implement basic security controls and countermeasures",
          "Perform basic vulnerability assessments",
          "Understand authentication, authorization, and access control",
          "Apply cryptographic techniques for data protection",
          "Develop incident response procedures",
          "Understand compliance and regulatory requirements",
        ],
        prerequisites: [
          "Basic understanding of computer networks",
          "Familiarity with operating systems (Windows/Linux)",
          "No prior security experience required",
        ],
        sections: [
          {
            id: 1,
            title: "Introduction to Cybersecurity",
            lessons: [
              {
                id: 101,
                title: "Course Overview",
                type: "video",
                duration: "10 min",
                isCompleted: true,
              },
              {
                id: 102,
                title: "The Cybersecurity Landscape",
                type: "video",
                duration: "15 min",
                isCompleted: true,
              },
              {
                id: 103,
                title: "Key Security Concepts",
                type: "video",
                duration: "20 min",
                isCompleted: false,
              },
              {
                id: 104,
                title: "Introduction Quiz",
                type: "quiz",
                duration: "15 min",
                isCompleted: false,
              },
            ],
          },
          {
            id: 2,
            title: "Threat Landscape",
            lessons: [
              {
                id: 201,
                title: "Common Attack Vectors",
                type: "video",
                duration: "25 min",
                isCompleted: false,
              },
              {
                id: 202,
                title: "Social Engineering Tactics",
                type: "video",
                duration: "18 min",
                isCompleted: false,
              },
              {
                id: 203,
                title: "Malware Types and Analysis",
                type: "video",
                duration: "22 min",
                isCompleted: false,
              },
              {
                id: 204,
                title: "Threat Landscape Reading",
                type: "document",
                duration: "30 min",
                isCompleted: false,
              },
              {
                id: 205,
                title: "Threat Analysis Assignment",
                type: "assignment",
                duration: "60 min",
                isCompleted: false,
              },
            ],
          },
          {
            id: 3,
            title: "Security Controls",
            lessons: [
              {
                id: 301,
                title: "Defense in Depth Strategy",
                type: "video",
                duration: "20 min",
                isCompleted: false,
              },
              {
                id: 302,
                title: "Network Security Controls",
                type: "video",
                duration: "25 min",
                isCompleted: false,
              },
              {
                id: 303,
                title: "Endpoint Protection",
                type: "video",
                duration: "18 min",
                isCompleted: false,
              },
              {
                id: 304,
                title: "Security Controls Lab",
                type: "lab",
                duration: "45 min",
                isCompleted: false,
              },
              {
                id: 305,
                title: "Security Controls Quiz",
                type: "quiz",
                duration: "20 min",
                isCompleted: false,
              },
            ],
          },
          {
            id: 4,
            title: "Cryptography Basics",
            lessons: [
              {
                id: 401,
                title: "Encryption Fundamentals",
                type: "video",
                duration: "22 min",
                isCompleted: false,
              },
              {
                id: 402,
                title: "Symmetric vs. Asymmetric Encryption",
                type: "video",
                duration: "24 min",
                isCompleted: false,
              },
              {
                id: 403,
                title: "Hashing and Digital Signatures",
                type: "video",
                duration: "18 min",
                isCompleted: false,
              },
              {
                id: 404,
                title: "Cryptography Practice Lab",
                type: "lab",
                duration: "40 min",
                isCompleted: false,
              },
            ],
          },
        ],
        reviews: [
          {
            id: 1,
            user: "Michael Johnson",
            date: "April 15, 2025",
            rating: 5,
            comment:
              "Excellent course for beginners! The instructor explains complex concepts in a very understandable way.",
          },
          {
            id: 2,
            user: "Emma Rodriguez",
            date: "April 3, 2025",
            rating: 4,
            comment:
              "Very informative and practical. I would have liked more hands-on exercises, but overall great content.",
          },
          {
            id: 3,
            user: "David Chen",
            date: "March 28, 2025",
            rating: 5,
            comment:
              "This course helped me secure my first job in cybersecurity. The materials are up-to-date and relevant.",
          },
        ],
      };

      setCourse(mockCourse);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Check if user is enrolled - in a real app, this would check against API
  const isEnrolled = currentUser && currentUser.role === "student";

  // Handle enrollment
  const handleEnroll = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // In a real app, this would call an API to enroll the user
    alert("You have successfully enrolled in this course!");
    // Redirect to student dashboard
    navigate("/student-dashboard");
  };

  const getCategoryIcon = (categoryId) => {
    const categoryIcons = {
      it: Cpu,
      security: Shield,
      hacking: Code,
      emerging: Zap,
    };

    const IconComponent = categoryIcons[categoryId] || BookOpen;
    return <IconComponent className="text-indigo-600" size={20} />;
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="text-indigo-600" size={16} />;
      case "document":
        return <FileText className="text-indigo-600" size={16} />;
      case "quiz":
        return <Award className="text-indigo-600" size={16} />;
      case "assignment":
        return <FileText className="text-indigo-600" size={16} />;
      case "lab":
        return <Code className="text-indigo-600" size={16} />;
      default:
        return <BookOpen className="text-indigo-600" size={16} />;
    }
  };

  const handleStartLesson = (sectionId, lessonId) => {
    // In a real app, this would navigate to the lesson content
    alert(`Starting lesson ${lessonId} in section ${sectionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Return to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Courses
        </button>
      </div>

      {/* Course Header */}
      <div className="bg-indigo-900 text-white mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-3/5">
              <div className="flex items-center mb-4">
                {getCategoryIcon(course.category)}
                <span className="ml-2 text-indigo-200 text-sm font-medium capitalize">
                  {course.category} • {course.level}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-indigo-100 mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center text-sm mb-6">
                <div className="flex items-center mr-4 mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>
                    {course.rating} ({course.enrolled.toLocaleString()}{" "}
                    students)
                  </span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span>Last updated: {course.lastUpdated}</span>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center mr-2">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{course.instructor}</div>
                  <div className="text-sm text-indigo-200">
                    {course.instructorRole}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/5 mt-6 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6 text-gray-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="mb-4">
                  <div className="text-3xl font-bold mb-2">${course.price}</div>
                </div>
                <button
                  onClick={handleEnroll}
                  className="w-full mb-4 py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isEnrolled ? "Continue Learning" : "Enroll Now"}
                </button>
                <div className="text-sm text-gray-500 text-center mb-4">
                  30-Day Money-Back Guarantee
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">This course includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Video className="h-5 w-5 text-indigo-600 mr-2" />
                      <span>20+ hours on-demand video</span>
                    </li>
                    <li className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                      <span>15 downloadable resources</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-indigo-600 mr-2" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
                      <span>Direct instructor Q&A</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                      <span>Full lifetime access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "curriculum"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab("instructor")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "instructor"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="bg-white shadow rounded-lg p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Course
              </h2>
              <p className="text-gray-700 mb-6">{course.longDescription}</p>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What You'll Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-indigo-600" />
                      </div>
                      <p className="ml-3 text-gray-700">{prereq}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Course Content
                </h2>
                <div className="mt-2 text-sm text-gray-600">
                  {course.sections.length} sections •{" "}
                  {course.sections.reduce(
                    (total, section) => total + section.lessons.length,
                    0
                  )}{" "}
                  lessons • {course.duration} total length
                </div>
              </div>

              <div className="divide-y">
                {course.sections.map((section) => (
                  <div key={section.id} className="bg-gray-50">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center">
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">
                          {section.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {section.lessons.length} lessons
                      </span>
                    </button>

                    {expandedSections.includes(section.id) && (
                      <div className="bg-white divide-y">
                        {section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="px-6 py-4 flex items-center"
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                {getLessonIcon(lesson.type)}
                                <span className="ml-3 text-gray-900">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="ml-6 mt-1 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                            <div>
                              {lesson.isCompleted ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : isEnrolled ? (
                                <button
                                  onClick={() =>
                                    handleStartLesson(section.id, lesson.id)
                                  }
                                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                                >
                                  <PlayCircle className="h-5 w-5" />
                                </button>
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor Tab */}
          {activeTab === "instructor" && (
            <div className="bg-white shadow rounded-lg p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                  <Users className="h-12 w-12 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.instructor}
                  </h2>
                  <p className="text-gray-600 mb-2">{course.instructorRole}</p>
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="text-gray-600">
                      4.8 Instructor Rating • 15 Courses • 12,000+ Students
                    </span>
                  </div>
                  <p className="text-gray-700">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="bg-white shadow rounded-lg p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Student Reviews
                  </h2>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(course.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {course.rating} course rating • {course.reviews.length}{" "}
                      reviews
                    </span>
                  </div>
                </div>
                <button className="mt-4 lg:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Leave a Review
                </button>
              </div>

              <div className="divide-y">
                {course.reviews.map((review) => (
                  <div key={review.id} className="py-6">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user}
                        </h4>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
