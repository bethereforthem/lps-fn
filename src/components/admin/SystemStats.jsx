import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  UserCheck,
  Award,
  TrendingUp,
  FileText,
  MessageSquare,
  Activity,
} from "lucide-react";
import api from "../../services/api";
import { formatErrorMessage } from "../../utils/helpers";

const StatCard = ({ title, value, icon, color }) => {
  const IconComponent = icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <div className={`p-2 rounded-full ${color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-end space-x-2">
        <span className="text-3xl font-bold">{value || 0}</span>
      </div>
    </div>
  );
};

const SystemStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completedCourses: 0,
    totalMaterials: 0,
    totalDiscussions: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("all"); // 'all', 'month', 'week'

  // Fetch stats on component mount and when timeframe changes
  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/stats?timeframe=${timeframe}`);
      setStats(response.data);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Create activity data for chart
  const recentEnrollmentData = stats.recentEnrollments || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">System Statistics</h2>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setTimeframe("all")}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300 rounded-l-lg`}
          >
            All Time
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("month")}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === "month"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border-t border-b border-gray-300`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("week")}
            className={`px-4 py-2 text-sm font-medium ${
              timeframe === "week"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300 rounded-r-lg`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Lecturers"
              value={stats.totalLecturers}
              icon={UserCheck}
              color="bg-purple-500"
            />
            <StatCard
              title="Total Courses"
              value={stats.totalCourses}
              icon={BookOpen}
              color="bg-green-500"
            />
            <StatCard
              title="Total Enrollments"
              value={stats.totalEnrollments}
              icon={TrendingUp}
              color="bg-yellow-500"
            />
            <StatCard
              title="Completed Courses"
              value={stats.completedCourses}
              icon={Award}
              color="bg-indigo-500"
            />
            <StatCard
              title="Course Materials"
              value={stats.totalMaterials}
              icon={FileText}
              color="bg-pink-500"
            />
            <StatCard
              title="Discussion Messages"
              value={stats.totalDiscussions}
              icon={MessageSquare}
              color="bg-red-500"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={Activity}
              color="bg-teal-500"
            />
          </div>

          {/* Additional Stats Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Courses */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Top Courses
              </h3>
              {stats.topCourses && stats.topCourses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.topCourses.map((course, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.enrollments}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${course.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="ml-2">
                                {course.completionRate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No course data available</p>
              )}
            </div>

            {/* Active Lecturers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Active Lecturers
              </h3>
              {stats.activeLecturers && stats.activeLecturers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lecturer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Courses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.activeLecturers.map((lecturer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lecturer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lecturer.courses}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lecturer.students}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No lecturer data available</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentActivity.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {activity.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              activity.action.includes("enroll")
                                ? "bg-green-100 text-green-800"
                                : activity.action.includes("complete")
                                ? "bg-blue-100 text-blue-800"
                                : activity.action.includes("create")
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {activity.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SystemStats;
