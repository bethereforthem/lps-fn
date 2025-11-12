import React, { useState, useEffect } from "react";
import {
  Users,
  Book,
  CheckCircle,
  Clock,
  Award,
  Filter,
  Search,
  Download,
  Mail,
  ArrowUpDown,
  UserCheck,
} from "lucide-react";
import api from "../../services/api";
import courseService from "../../services/courseService";
import {
  formatDate,
  formatErrorMessage,
  calculateProgress,
} from "../../utils/helpers";

const StudentProgress = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'completed'
  const [sortConfig, setSortConfig] = useState({
    key: "progress",
    direction: "desc",
  });

  // Fetch student progress data on component mount
  useEffect(() => {
    if (courseId) {
      fetchStudentProgress();
      fetchCourseDetails();
    }
  }, [courseId]);

  // Fetch student progress from API
  const fetchStudentProgress = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.getStudentProgress(courseId);
      setStudents(data || []);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort students
  const filteredStudents = students
    .filter((student) => {
      // Filter by search term
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && student.progress === 100) ||
        (filterStatus === "active" && student.progress < 100);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      const key = sortConfig.key;

      if (a[key] < b[key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Export student progress as CSV
  const exportCsv = () => {
    if (!students.length) return;

    // Prepare CSV headers
    const headers = [
      "Student Name",
      "Email",
      "Enrollment Date",
      "Progress",
      "Completed Modules",
      "Total Modules",
      "Assignments Submitted",
      "Quiz Score",
    ];

    // Prepare CSV data
    const csvData = students.map((student) => [
      student.name,
      student.email,
      formatDate(student.enrolled_at),
      `${student.progress}%`,
      student.completed_modules,
      student.total_modules,
      student.assignments_submitted,
      student.quiz_score || "N/A",
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student-progress-${courseId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send reminder email to a student
  const sendReminder = async (studentId) => {
    try {
      await api.post(`/courses/${courseId}/students/${studentId}/reminder`);
      alert("Reminder sent successfully!");
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  // Generate certificate for student
  const generateCertificate = async (studentId) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/students/${studentId}/certificate`
      );

      // Open the certificate in a new tab
      window.open(response.data.certificate_url, "_blank");
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Progress</h2>
          {course && (
            <p className="text-gray-600">
              Course: <span className="font-medium">{course.title}</span>
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={exportCsv}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
            disabled={!students.length}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => fetchStudentProgress()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {course && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {students.length}
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {students.filter((s) => s.progress === 100).length}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  students.filter((s) => s.progress > 0 && s.progress < 100)
                    .length
                }
              </p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <Book className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Not Started</p>
              <p className="text-2xl font-bold text-gray-800">
                {students.filter((s) => s.progress === 0).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Search and Filter Tools */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search students by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Students</option>
            <option value="completed">Completed</option>
            <option value="active">In Progress</option>
          </select>
        </div>
      </div>

      {/* Students Progress Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  className="flex items-center"
                  onClick={() => handleSort("name")}
                >
                  Student
                  {sortConfig.key === "name" && (
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  className="flex items-center"
                  onClick={() => handleSort("enrolled_at")}
                >
                  Enrolled
                  {sortConfig.key === "enrolled_at" && (
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  className="flex items-center"
                  onClick={() => handleSort("progress")}
                >
                  Progress
                  {sortConfig.key === "progress" && (
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  className="flex items-center"
                  onClick={() => handleSort("completed_modules")}
                >
                  Modules
                  {sortConfig.key === "completed_modules" && (
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  className="flex items-center"
                  onClick={() => handleSort("assignments_submitted")}
                >
                  Assignments
                  {sortConfig.key === "assignments_submitted" && (
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  className="flex items-center"
                  onClick={() => handleSort("quiz_score")}
                >
                  Quiz Avg
                  {sortConfig.key === "quiz_score" && (
                    <ArrowUpDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
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
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(student.enrolled_at)}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 w-32">
                        <div
                          className={`h-2.5 rounded-full ${
                            student.progress === 100
                              ? "bg-green-600"
                              : student.progress > 50
                              ? "bg-blue-600"
                              : "bg-yellow-600"
                          }`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.completed_modules} / {student.total_modules}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.assignments_submitted} /{" "}
                      {student.total_assignments}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.quiz_score !== null
                        ? `${student.quiz_score}%`
                        : "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => sendReminder(student.student_id)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="Send reminder email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>

                      {student.progress === 100 && (
                        <button
                          onClick={() =>
                            generateCertificate(student.student_id)
                          }
                          className="p-1 text-green-600 hover:text-green-900"
                          title="Generate certificate"
                        >
                          <Award className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProgress;
