import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  X,
  AlertCircle,
  Users,
  Search,
  Filter,
  RefreshCw,
  CornerDownLeft,
} from "lucide-react";
import api from "../../services/api";
import { formatErrorMessage, formatDate } from "../../utils/helpers";

const StudentInteraction = ({ courseId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [activeTab, setActiveTab] = useState("questions");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, resolved

  const [questions, setQuestions] = useState([]);
  const [course, setCourse] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchQuestions();
    }
  }, [courseId]);

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  // Fetch questions/discussions
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/courses/${courseId}/questions`);
      setQuestions(response.data || []);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search questions
  const filteredQuestions = questions.filter((question) => {
    // Filter by search term
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.student_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && !question.is_resolved) ||
      (filterStatus === "resolved" && question.is_resolved);

    return matchesSearch && matchesStatus;
  });

  // Submit reply to question
  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!replyContent.trim() || !selectedQuestion) return;

    try {
      setIsLoading(true);
      setError(null);

      await api.post(
        `/courses/${courseId}/questions/${selectedQuestion.id}/replies`,
        {
          content: replyContent,
        }
      );

      // Refresh the questions to get the updated replies
      await fetchQuestions();

      // Reset form
      setReplyContent("");
      setSuccess("Reply posted successfully");

      // After 3 seconds, clear the success message
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a question as resolved
  const markAsResolved = async (questionId) => {
    try {
      setIsLoading(true);

      await api.put(`/courses/${courseId}/questions/${questionId}/resolve`);

      // Update local state to reflect change
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, is_resolved: true } : q
        )
      );

      setSuccess("Question marked as resolved");

      // After 3 seconds, clear the success message
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Select a question to view details
  const selectQuestion = (question) => {
    setSelectedQuestion(question);
    setReplyContent("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-800">
              Student Interactions
            </h2>
            {course && (
              <p className="text-sm text-gray-600">
                Course: <span className="font-medium">{course.title}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === "questions"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("questions")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Q&A
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === "comments"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            <Users className="w-4 h-4 mr-2" />
            Comments
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {activeTab === "questions" && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Questions</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <button
                onClick={fetchQuestions}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>

            {/* Split View: Questions List and Question Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Questions List */}
              <div className="lg:col-span-1 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Questions
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {isLoading && !filteredQuestions.length ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading questions...
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No questions found
                    </div>
                  ) : (
                    filteredQuestions.map((question) => (
                      <div
                        key={question.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                          selectedQuestion?.id === question.id
                            ? "bg-indigo-50"
                            : ""
                        }`}
                        onClick={() => selectQuestion(question)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {question.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {question.student_name} ·{" "}
                              {formatDate(question.created_at)}
                            </p>
                          </div>
                          {question.is_resolved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {question.content}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {question.replies?.length || 0} replies
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Question Details and Replies */}
              <div className="lg:col-span-2 border border-gray-200 rounded-md overflow-hidden">
                {!selectedQuestion ? (
                  <div className="h-full flex items-center justify-center p-8 bg-gray-50">
                    <div className="text-center">
                      <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No question selected
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Select a question from the list to view details and
                        reply
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Question Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {selectedQuestion.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedQuestion.student_name} ·{" "}
                            {formatDate(selectedQuestion.created_at)}
                          </p>
                        </div>
                        {!selectedQuestion.is_resolved && (
                          <button
                            onClick={() => markAsResolved(selectedQuestion.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark as Resolved
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Content and Replies */}
                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                      {/* Question Content */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="prose prose-sm max-w-none text-gray-900">
                          {selectedQuestion.content}
                        </div>
                      </div>

                      {/* Replies */}
                      <div className="divide-y divide-gray-200">
                        {selectedQuestion.replies?.length > 0 ? (
                          selectedQuestion.replies.map((reply) => (
                            <div key={reply.id} className="p-4">
                              <div className="flex space-x-3">
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">
                                      {reply.is_lecturer ? (
                                        <span className="text-indigo-600">
                                          You (Lecturer)
                                        </span>
                                      ) : (
                                        <span>{reply.author_name}</span>
                                      )}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {formatDate(reply.created_at)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No replies yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reply Form */}
                    <div className="bg-gray-50 p-4 border-t border-gray-200">
                      <form onSubmit={handleSubmitReply}>
                        <div className="flex items-start space-x-4">
                          <div className="min-w-0 flex-1">
                            <div className="relative">
                              <textarea
                                rows="3"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Write your reply..."
                                value={replyContent}
                                onChange={(e) =>
                                  setReplyContent(e.target.value)
                                }
                                disabled={isLoading}
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading || !replyContent.trim()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>Loading...</>
                            ) : (
                              <>
                                <CornerDownLeft className="w-4 h-4 mr-2" />
                                Post Reply
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Comments Feature
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Course comments functionality will be implemented in the next
              phase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInteraction;
