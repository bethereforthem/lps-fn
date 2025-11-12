import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Video,
  Code,
  Presentation,
  File,
  CheckCircle,
  Circle,
  MessageSquare,
  Send,
  Download,
  Clock,
  Award,
  PlayCircle,
  Loader,
} from "lucide-react";
import courseService from "../../services/courseService";
import { formatDate, formatErrorMessage } from "../../utils/helpers";

const CourseContent = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentTab, setCurrentTab] = useState("materials");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);

  // Fetch course data on component mount
  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Fetch course details and content
  const fetchCourseData = async () => {
    try {
      setIsLoading(true);

      // Fetch course details
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);

      // Fetch course materials
      const materialsData = await courseService.getCourseMaterials(courseId);
      setMaterials(materialsData || []);

      // Fetch course assignments
      const assignmentsData = await courseService.getCourseAssignments(
        courseId
      );
      setAssignments(assignmentsData || []);

      // Fetch course quizzes
      const quizzesData = await courseService.getCourseQuizzes(courseId);
      setQuizzes(quizzesData || []);

      // Fetch course discussions
      const discussionsData = await fetchDiscussions();
      setDiscussions(discussionsData || []);

      // Fetch student progress
      const progressData = await fetchStudentProgress();
      setProgress(progressData.progress || 0);
      setCompletedModules(progressData.completedModules || []);

      // Check if student completed the course
      if (progressData.progress === 100) {
        setShowCertificate(true);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course discussions
  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/discussions`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching discussions:", err);
      return [];
    }
  };

  // Fetch student progress
  const fetchStudentProgress = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/progress`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching progress:", err);
      return { progress: 0, completedModules: [] };
    }
  };

  // Mark material as completed
  const markAsCompleted = async (materialId) => {
    try {
      await fetch(`/api/courses/${courseId}/materials/${materialId}/complete`, {
        method: "POST",
      });

      // Update UI without refetching everything
      setCompletedModules((prev) => [...prev, materialId]);

      // Recalculate progress
      const totalModules =
        materials.length + assignments.length + quizzes.length;
      const completedCount = [...completedModules, materialId].length;
      const newProgress = Math.round((completedCount / totalModules) * 100);
      setProgress(newProgress);

      // Check if course is now completed
      if (newProgress === 100) {
        setShowCertificate(true);
      }
    } catch (err) {
      setError("Failed to mark material as completed");
    }
  };

  // Submit assignment
  const submitAssignment = async (assignmentId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await courseService.submitAssignment(assignmentId, formData);

      // Refresh assignments data
      const assignmentsData = await courseService.getCourseAssignments(
        courseId
      );
      setAssignments(assignmentsData || []);

      // Update progress
      const progressData = await fetchStudentProgress();
      setProgress(progressData.progress || 0);
      setCompletedModules(progressData.completedModules || []);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  // Submit discussion message
  const submitMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setSubmittingMessage(true);

      await fetch(`/api/courses/${courseId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      // Refresh discussions
      const discussionsData = await fetchDiscussions();
      setDiscussions(discussionsData || []);

      // Clear message input
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message");
    } finally {
      setSubmittingMessage(false);
    }
  };

  // Start quiz
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
  };

  // Handle quiz answer selection
  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Submit quiz
  const submitQuiz = async () => {
    try {
      await courseService.submitQuizAttempt(selectedQuiz.quiz_id, {
        answers: quizAnswers,
      });

      // Reset quiz state
      setSelectedQuiz(null);
      setQuizAnswers({});

      // Refresh quiz data
      const quizzesData = await courseService.getCourseQuizzes(courseId);
      setQuizzes(quizzesData || []);

      // Update progress
      const progressData = await fetchStudentProgress();
      setProgress(progressData.progress || 0);
      setCompletedModules(progressData.completedModules || []);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  // Download certificate
  const downloadCertificate = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/certificate`);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${course.title} Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download certificate");
    }
  };

  // Get icon for material type
  const getMaterialIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "ppt":
        return <Presentation className="w-5 h-5" />;
      case "code":
        return <Code className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  // Render material item
  const renderMaterialItem = (material) => {
    const isCompleted = completedModules.includes(material.material_id);

    return (
      <div
        key={material.material_id}
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md mr-3">
              {getMaterialIcon(material.file_type)}
            </div>
            <h4 className="font-medium">{material.title}</h4>
          </div>
          <div>
            {isCompleted ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-1" />
                Completed
              </span>
            ) : (
              <button
                onClick={() => markAsCompleted(material.material_id)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Circle className="w-5 h-5 mr-1" />
                Mark as completed
              </button>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-500">
              Added on {formatDate(material.uploaded_at)}
            </span>
            <span className="text-sm text-gray-500">
              {material.file_type.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <a
              href={material.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Download className="w-5 h-5 mr-1" />
              Download
            </a>

            {material.file_type === "video" && (
              <a
                href={material.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlayCircle className="w-5 h-5 mr-1" />
                Watch Video
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render assignment item
  const renderAssignmentItem = (assignment) => {
    const isSubmitted = assignment.submission !== null;
    const isPastDue = new Date(assignment.due_date) < new Date();

    return (
      <div
        key={assignment.assignment_id}
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <div
          className={`p-4 border-b ${
            isSubmitted
              ? "bg-green-50"
              : isPastDue
              ? "bg-red-50"
              : "bg-yellow-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{assignment.title}</h4>
            <div>
              {isSubmitted ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  Submitted
                </span>
              ) : isPastDue ? (
                <span className="flex items-center text-red-600">
                  <Clock className="w-5 h-5 mr-1" />
                  Past Due
                </span>
              ) : (
                <span className="flex items-center text-yellow-600">
                  <Clock className="w-5 h-5 mr-1" />
                  Due {formatDate(assignment.due_date)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-gray-700 mb-4">{assignment.description}</p>

          {isSubmitted ? (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Your submission</span>
                <span className="text-sm text-gray-500">
                  {formatDate(assignment.submission.submitted_at)}
                </span>
              </div>

              <div className="flex items-center">
                <File className="w-5 h-5 mr-2 text-blue-600" />
                <a
                  href={assignment.submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Submission
                </a>
              </div>

              {assignment.submission.grade !== null && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Grade</span>
                    <span className="font-medium">
                      {assignment.submission.grade}/100
                    </span>
                  </div>

                  {assignment.submission.feedback && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Feedback</span>
                      <p className="text-sm text-gray-700 mt-1">
                        {assignment.submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fileInput = e.target.elements.file;
                if (fileInput.files.length > 0) {
                  submitAssignment(
                    assignment.assignment_id,
                    fileInput.files[0]
                  );
                }
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor={`file-${assignment.assignment_id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Upload your assignment
                </label>
                <input
                  type="file"
                  name="file"
                  id={`file-${assignment.assignment_id}`}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                  disabled={isPastDue}
                />
              </div>

              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isPastDue
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isPastDue}
              >
                Submit Assignment
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  // Render quiz item
  const renderQuizItem = (quiz) => {
    const isCompleted = quiz.attempts && quiz.attempts.length > 0;

    return (
      <div
        key={quiz.quiz_id}
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        <div
          className={`p-4 border-b ${
            isCompleted ? "bg-green-50" : "bg-blue-50"
          }`}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{quiz.title}</h4>
            {isCompleted && (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-1" />
                Completed
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-500">
              {quiz.questions?.length || 0} Questions
            </span>
            {isCompleted && (
              <span className="font-medium text-blue-600">
                Score: {quiz.attempts[0].score}%
              </span>
            )}
          </div>

          {isCompleted ? (
            <div className="flex justify-between">
              <button
                onClick={() => startQuiz(quiz)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <PlayCircle className="w-5 h-5 mr-1" />
                Retake Quiz
              </button>

              <span className="text-sm text-gray-500">
                Last attempt: {formatDate(quiz.attempts[0].attempted_at)}
              </span>
            </div>
          ) : (
            <button
              onClick={() => startQuiz(quiz)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Start Quiz
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render quiz questions
  const renderQuizQuestions = () => {
    if (!selectedQuiz || !selectedQuiz.questions) return null;

    return (
      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="p-4 bg-blue-50 border-b">
          <h3 className="font-medium text-lg">{selectedQuiz.title}</h3>
          <p className="text-sm text-gray-500">
            {selectedQuiz.questions.length} Questions
          </p>
        </div>

        <div className="p-4">
          {selectedQuiz.questions.map((question, index) => (
            <div key={question.question_id} className="mb-6 last:mb-0">
              <div className="flex mb-2">
                <span className="font-medium text-gray-700">
                  Question {index + 1}:
                </span>
              </div>
              <p className="mb-3">{question.question_text}</p>

              <div className="space-y-2 ml-4">
                {JSON.parse(question.options).map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="radio"
                      id={`q${question.question_id}-opt${optIndex}`}
                      name={`question-${question.question_id}`}
                      value={option}
                      checked={quizAnswers[question.question_id] === option}
                      onChange={() =>
                        handleQuizAnswer(question.question_id, option)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`q${question.question_id}-opt${optIndex}`}
                      className="ml-2 block text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setSelectedQuiz(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitQuiz}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              disabled={
                Object.keys(quizAnswers).length !==
                selectedQuiz.questions.length
              }
            >
              Submit Answers
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render discussions
  const renderDiscussions = () => {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-medium text-lg">Discussion Forum</h3>
          <p className="text-sm text-gray-500">
            Ask questions and discuss with your peers and lecturer
          </p>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {discussions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                No messages yet. Be the first to post!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.is_lecturer
                      ? "bg-blue-50 border-blue-100 border"
                      : message.is_current_user
                      ? "bg-green-50 border-green-100 border"
                      : "bg-gray-50 border-gray-100 border"
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span
                      className={`font-medium ${
                        message.is_lecturer ? "text-blue-600" : ""
                      }`}
                    >
                      {message.user_name} {message.is_lecturer && "(Lecturer)"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.created_at, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <form onSubmit={submitMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submittingMessage}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-r-md text-white ${
                submittingMessage
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={submittingMessage || !newMessage.trim()}
            >
              {submittingMessage ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="bg-white rounded-lg shadow-md">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchCourseData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Course Header */}
          <div className="p-6 border-b">
            {course && (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {course.category.charAt(0).toUpperCase() +
                        course.category.slice(1)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <div className="bg-gray-200 rounded-full h-2.5 w-32 mr-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            progress === 100
                              ? "bg-green-600"
                              : progress > 50
                              ? "bg-blue-600"
                              : "bg-yellow-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {progress}% Complete
                      </span>
                    </div>

                    {showCertificate && (
                      <button
                        onClick={downloadCertificate}
                        className="flex items-center text-green-600 hover:text-green-800"
                      >
                        <Award className="w-5 h-5 mr-1" />
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>

                {course.description && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">{course.description}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Course Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  currentTab === "materials"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setCurrentTab("materials")}
              >
                <BookOpen className="w-5 h-5 inline mr-1" />
                Materials
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  currentTab === "assignments"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setCurrentTab("assignments")}
              >
                <FileText className="w-5 h-5 inline mr-1" />
                Assignments
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  currentTab === "quizzes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setCurrentTab("quizzes")}
              >
                <CheckCircle className="w-5 h-5 inline mr-1" />
                Quizzes
              </button>
              <button
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  currentTab === "discussions"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setCurrentTab("discussions")}
              >
                <MessageSquare className="w-5 h-5 inline mr-1" />
                Discussions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {currentTab === "materials" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Course Materials
                </h3>

                {materials.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No materials available for this course yet
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {materials.map(renderMaterialItem)}
                  </div>
                )}
              </div>
            )}

            {currentTab === "assignments" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">
                  Assignments
                </h3>

                {assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No assignments available for this course yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {assignments.map(renderAssignmentItem)}
                  </div>
                )}
              </div>
            )}

            {currentTab === "quizzes" && (
              <div className="space-y-6">
                {selectedQuiz ? (
                  renderQuizQuestions()
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-800">
                      Quizzes
                    </h3>

                    {quizzes.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">
                          No quizzes available for this course yet
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quizzes.map(renderQuizItem)}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {currentTab === "discussions" && (
              <div className="space-y-6">{renderDiscussions()}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseContent;
