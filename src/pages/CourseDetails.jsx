import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  FileText,
  Play,
  CheckCircle,
} from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, you would fetch this from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Create a mock course based on the ID
      const mockCourse = {
        id: parseInt(id) || 1,
        title: "Cybersecurity Fundamentals",
        instructor: "Dr. Sarah Mitchell",
        category: "Security",
        rating: 4.8,
        studentsEnrolled: 845,
        description:
          "Learn the core concepts of cybersecurity including threat models, security protocols, and defense mechanisms. This comprehensive course provides a foundation for anyone looking to start or advance in the cybersecurity field.",
        image: "/api/placeholder/800/400",
        lastUpdated: "March 15, 2025",
        duration: "6 weeks",
        skillLevel: "Beginner to Intermediate",
        prerequisites: "Basic understanding of computer networks",
        whatYouWillLearn: [
          "Understand fundamental cybersecurity concepts and terminology",
          "Identify common threats and vulnerabilities in computer systems",
          "Implement basic security controls to protect information assets",
          "Develop security policies and procedures for organizations",
          "Respond to and recover from security incidents",
        ],
        syllabus: [
          {
            title: "Introduction to Cybersecurity",
            lessons: [
              "Overview of Cybersecurity Landscape",
              "Key Terminology and Concepts",
              "History of Cyber Attacks",
            ],
            duration: "1 week",
          },
          {
            title: "Threat Landscape",
            lessons: [
              "Types of Cyber Threats",
              "Threat Actors and Motivations",
              "Attack Vectors and Techniques",
            ],
            duration: "1 week",
          },
          {
            title: "Security Controls",
            lessons: [
              "Administrative Controls",
              "Technical Controls",
              "Physical Controls",
            ],
            duration: "1 week",
          },
          {
            title: "Network Security",
            lessons: [
              "Network Architecture",
              "Firewall Configuration",
              "Intrusion Detection Systems",
            ],
            duration: "1 week",
          },
          {
            title: "Cryptography",
            lessons: [
              "Encryption Basics",
              "Authentication Mechanisms",
              "Public Key Infrastructure",
            ],
            duration: "1 week",
          },
          {
            title: "Incident Response and Recovery",
            lessons: [
              "Incident Response Planning",
              "Forensic Analysis",
              "Disaster Recovery and Business Continuity",
            ],
            duration: "1 week",
          },
        ],
        isEnrolled: false,
      };

      setCourse(mockCourse);
      setLoading(false);
    }, 800); // Simulate loading delay
  }, [id]);

  const handleEnroll = () => {
    // In a real app, this would be an API call to enroll
    alert("Enrollment feature will be implemented in the next phase!");
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={goBack}
            className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </button>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Course Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-indigo-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={goBack}
            className="mb-6 inline-flex items-center text-indigo-200 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </button>
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="mt-2 text-indigo-200">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center text-sm">
                <span className="mr-4">
                  <span className="font-medium">Instructor:</span>{" "}
                  {course.instructor}
                </span>
                <span className="mr-4">
                  <span className="font-medium">Category:</span>{" "}
                  {course.category}
                </span>
                <span className="mr-4">
                  <span className="font-medium">Rating:</span> {course.rating}
                  /5.0
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.studentsEnrolled} students enrolled</span>
                </span>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <button
                onClick={handleEnroll}
                className="block w-full md:w-auto px-6 py-3 bg-white text-indigo-900 rounded-md font-medium hover:bg-indigo-50"
              >
                {course.isEnrolled ? "Continue Learning" : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "syllabus"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("syllabus")}
            >
              Syllabus
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Course
              </h2>
              <p className="text-gray-700 mb-6">{course.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Duration
                    </h3>
                    <p className="text-sm text-gray-500">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Skill Level
                    </h3>
                    <p className="text-sm text-gray-500">{course.skillLevel}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Prerequisites
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.prerequisites}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Last Updated
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Featured Video
              </h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-indigo-500 mx-auto mb-3" />
                  <p className="text-gray-600">Course introduction video</p>
                  <p className="text-gray-500 text-sm">
                    (Preview available after enrollment)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "syllabus" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Course Syllabus
            </h2>
            <div className="space-y-6">
              {course.syllabus.map((module, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Module {index + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-gray-500">{module.duration}</p>
                    </div>
                    <span className="text-sm text-indigo-600">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-start">
                          <Play className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Student Reviews
            </h2>
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">
                Reviews will be available after enrollment.
              </p>
              <button
                onClick={handleEnroll}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
              >
                Enroll to Access Reviews
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
