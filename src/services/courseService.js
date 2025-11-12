import api from "./api";

const COURSE_ENDPOINTS = {
  COURSES: "/courses",
  ENROLL: "/enrollments",
  MATERIALS: "/materials",
  ASSIGNMENTS: "/assignments",
  SUBMISSIONS: "/submissions",
  QUIZZES: "/quizzes",
  QUIZ_ATTEMPTS: "/quiz-attempts",
};

const courseService = {
  /**
   * Get all courses
   * @param {Object} params - Query parameters (filter, sort, etc.)
   * @returns {Promise} Promise with courses data
   */
  getAllCourses: async (params = {}) => {
    try {
      const response = await api.get(COURSE_ENDPOINTS.COURSES, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get course by ID
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with course data
   */
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`${COURSE_ENDPOINTS.COURSES}/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new course (lecturer only)
   * @param {Object} courseData - Course data
   * @returns {Promise} Promise with created course
   */
  createCourse: async (courseData) => {
    try {
      const response = await api.post(COURSE_ENDPOINTS.COURSES, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update course (lecturer only)
   * @param {String} courseId - Course ID
   * @param {Object} courseData - Updated course data
   * @returns {Promise} Promise with updated course
   */
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(
        `${COURSE_ENDPOINTS.COURSES}/${courseId}`,
        courseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete course (lecturer only)
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with deletion result
   */
  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(
        `${COURSE_ENDPOINTS.COURSES}/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Enroll in course (student only)
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with enrollment result
   */
  enrollInCourse: async (courseId) => {
    try {
      const response = await api.post(COURSE_ENDPOINTS.ENROLL, { courseId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Unenroll from course (student only)
   * @param {String} enrollmentId - Enrollment ID
   * @returns {Promise} Promise with unenrollment result
   */
  unenrollFromCourse: async (enrollmentId) => {
    try {
      const response = await api.delete(
        `${COURSE_ENDPOINTS.ENROLL}/${enrollmentId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get enrolled courses (student only)
   * @returns {Promise} Promise with enrolled courses data
   */
  getEnrolledCourses: async () => {
    try {
      const response = await api.get(`${COURSE_ENDPOINTS.ENROLL}/my-courses`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get course materials
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with course materials
   */
  getCourseMaterials: async (courseId) => {
    try {
      const response = await api.get(
        `${COURSE_ENDPOINTS.MATERIALS}/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload course material (lecturer only)
   * @param {String} courseId - Course ID
   * @param {FormData} materialData - Material data with file
   * @returns {Promise} Promise with upload result
   */
  uploadCourseMaterial: async (courseId, materialData) => {
    try {
      const response = await api.post(
        `${COURSE_ENDPOINTS.MATERIALS}/course/${courseId}`,
        materialData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get course assignments
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with course assignments
   */
  getCourseAssignments: async (courseId) => {
    try {
      const response = await api.get(
        `${COURSE_ENDPOINTS.ASSIGNMENTS}/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create assignment (lecturer only)
   * @param {String} courseId - Course ID
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise} Promise with created assignment
   */
  createAssignment: async (courseId, assignmentData) => {
    try {
      const response = await api.post(
        `${COURSE_ENDPOINTS.ASSIGNMENTS}/course/${courseId}`,
        assignmentData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit assignment (student only)
   * @param {String} assignmentId - Assignment ID
   * @param {FormData} submissionData - Submission data with file
   * @returns {Promise} Promise with submission result
   */
  submitAssignment: async (assignmentId, submissionData) => {
    try {
      const response = await api.post(
        `${COURSE_ENDPOINTS.SUBMISSIONS}/assignment/${assignmentId}`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get course quizzes
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with course quizzes
   */
  getCourseQuizzes: async (courseId) => {
    try {
      const response = await api.get(
        `${COURSE_ENDPOINTS.QUIZZES}/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create quiz (lecturer only)
   * @param {String} courseId - Course ID
   * @param {Object} quizData - Quiz data with questions
   * @returns {Promise} Promise with created quiz
   */
  createQuiz: async (courseId, quizData) => {
    try {
      const response = await api.post(
        `${COURSE_ENDPOINTS.QUIZZES}/course/${courseId}`,
        quizData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit quiz attempt (student only)
   * @param {String} quizId - Quiz ID
   * @param {Object} attemptData - Attempt data with answers
   * @returns {Promise} Promise with attempt result and score
   */
  submitQuizAttempt: async (quizId, attemptData) => {
    try {
      const response = await api.post(
        `${COURSE_ENDPOINTS.QUIZ_ATTEMPTS}/quiz/${quizId}`,
        attemptData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get student progress for a course (lecturer only)
   * @param {String} courseId - Course ID
   * @returns {Promise} Promise with student progress data
   */
  getStudentProgress: async (courseId) => {
    try {
      const response = await api.get(
        `${COURSE_ENDPOINTS.COURSES}/${courseId}/student-progress`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default courseService;
