// /**
//  * Application constants
//  */

// // User roles
// export const USER_ROLES = {
//   ADMIN: "admin",
//   LECTURER: "lecturer",
//   STUDENT: "student",
// };

// // Course categories
// export const COURSE_CATEGORIES = [
//   { id: "it", name: "Information Technology" },
//   { id: "security", name: "Cybersecurity" },
//   { id: "hacking", name: "Ethical Hacking" },
//   { id: "hardware", name: "Computer Hardware" },
//   { id: "emerging", name: "Emerging Technologies" },
// ];

// // Material types
// export const MATERIAL_TYPES = [
//   { id: "video", name: "Video", icon: "PlayCircle" },
//   { id: "pdf", name: "PDF Document", icon: "FileText" },
//   { id: "ppt", name: "PowerPoint", icon: "PresentationScreen" },
//   { id: "doc", name: "Document", icon: "FileText" },
//   { id: "code", name: "Code Sample", icon: "Code" },
// ];

// // Quiz question types
// export const QUESTION_TYPES = {
//   MULTIPLE_CHOICE: "multiple_choice",
//   TRUE_FALSE: "true_false",
//   SHORT_ANSWER: "short_answer",
// };

// // Routes
// export const ROUTES = {
//   HOME: "/",
//   LOGIN: "/login",
//   REGISTER: "/register",
//   ADMIN_DASHBOARD: "/admin/dashboard",
//   LECTURER_DASHBOARD: "/lecturer/dashboard",
//   STUDENT_DASHBOARD: "/student/dashboard",
//   COURSE_DETAILS: "/course/:id",
//   COURSES: "/courses",
//   PROFILE: "/profile",

//   // New lecturer-specific routes
//   LECTURER_PROFILE: "/lecturer/profile",
//   LECTURER_COURSE_CREATE: "/lecturer/courses/create",
//   LECTURER_COURSE_EDIT: "/lecturer/courses/:id/edit",
//   LECTURER_COURSE_PROGRESS: "/lecturer/courses/:id/progress",
//   LECTURER_COURSE_INTERACTIONS: "/lecturer/courses/:id/interactions",
// };

// // API error messages
// export const ERROR_MESSAGES = {
//   DEFAULT: "Something went wrong. Please try again later.",
//   UNAUTHORIZED: "You are not authorized to perform this action.",
//   NOT_FOUND: "The requested resource was not found.",
//   VALIDATION: "Please check your input and try again.",
//   NETWORK: "Network error. Please check your internet connection.",
// };

// // Pagination
// export const PAGINATION = {
//   DEFAULT_LIMIT: 10,
//   DEFAULT_PAGE: 1,
// };

// // Local storage keys
// export const STORAGE_KEYS = {
//   TOKEN: "token",
//   USER: "user",
//   THEME: "theme",
// };

// // Toast notification durations
// export const TOAST_DURATION = {
//   SHORT: 3000,
//   MEDIUM: 5000,
//   LONG: 8000,
// };

// // File upload limits
// export const UPLOAD_LIMITS = {
//   MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
//   ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
//   ALLOWED_DOCUMENT_TYPES: [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ],
//   ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
// };

// export default {
//   USER_ROLES,
//   COURSE_CATEGORIES,
//   MATERIAL_TYPES,
//   QUESTION_TYPES,
//   ROUTES,
//   ERROR_MESSAGES,
//   PAGINATION,
//   STORAGE_KEYS,
//   TOAST_DURATION,
//   UPLOAD_LIMITS,
// };

/**
 * Application constants
 */

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  LECTURER: "lecturer",
  STUDENT: "student",
};

// Course categories
export const COURSE_CATEGORIES = [
  { id: "it", name: "Information Technology" },
  { id: "security", name: "Cybersecurity" },
  { id: "hacking", name: "Ethical Hacking" },
  { id: "hardware", name: "Computer Hardware" },
  { id: "emerging", name: "Emerging Technologies" },
];

// Material types
export const MATERIAL_TYPES = [
  { id: "video", name: "Video", icon: "PlayCircle" },
  { id: "pdf", name: "PDF Document", icon: "FileText" },
  { id: "ppt", name: "PowerPoint", icon: "PresentationScreen" },
  { id: "doc", name: "Document", icon: "FileText" },
  { id: "code", name: "Code Sample", icon: "Code" },
];

// Quiz question types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
  SHORT_ANSWER: "short_answer",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN_DASHBOARD: "/admin/dashboard",
  LECTURER_DASHBOARD: "/lecturer/dashboard",
  STUDENT_DASHBOARD: "/student/dashboard",
  COURSE_DETAILS: "/course/:id",
  COURSES: "/courses",
  PROFILE: "/profile",

  // New lecturer-specific routes
  LECTURER_PROFILE: "/lecturer/profile",
  LECTURER_COURSE_CREATE: "/lecturer/courses/create",
  LECTURER_COURSE_EDIT: "/lecturer/courses/:id/edit",
  LECTURER_COURSE_PROGRESS: "/lecturer/courses/:id/progress",
  LECTURER_COURSE_INTERACTIONS: "/lecturer/courses/:id/interactions",

  // New student-specific routes
  STUDENT_PROFILE: "/student/profile",
  STUDENT_COURSES: "/student/courses",
  STUDENT_COURSE_CONTENT: "/student/courses/:id/content",
  STUDENT_ACHIEVEMENTS: "/student/achievements",
  STUDENT_CERTIFICATES: "/student/certificates",
};

// Course statuses
export const COURSE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

// Assignment statuses
export const ASSIGNMENT_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  GRADED: "graded",
  OVERDUE: "overdue",
};

// Student progress statuses
export const PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_MATERIAL: "new_material",
  ASSIGNMENT_DUE: "assignment_due",
  ASSIGNMENT_GRADED: "assignment_graded",
  QUIZ_AVAILABLE: "quiz_available",
  DISCUSSION_REPLY: "discussion_reply",
  COURSE_ANNOUNCEMENT: "course_announcement",
};

// API error messages
export const ERROR_MESSAGES = {
  DEFAULT: "Something went wrong. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  NETWORK: "Network error. Please check your internet connection.",
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

// Toast notification durations
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
};

// API endpoints (for future use with backend)
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/api/auth/login",
  FORGOT_PASSWORD: "/forgot-password",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",

  // User endpoints
  USERS: "/api/users",
  USER_PROFILE: "/api/users/profile",

  // Course endpoints
  COURSES: "/api/courses",
  COURSE_DETAILS: "/api/courses/:id",
  COURSE_MATERIALS: "/api/courses/:id/materials",
  COURSE_ASSIGNMENTS: "/api/courses/:id/assignments",
  COURSE_QUIZZES: "/api/courses/:id/quizzes",
  COURSE_DISCUSSIONS: "/api/courses/:id/discussions",

  // Student endpoints
  STUDENT_COURSES: "/api/student/courses",
  STUDENT_PROGRESS: "/api/student/courses/:id/progress",
  STUDENT_ASSIGNMENTS: "/api/student/assignments",
  STUDENT_QUIZZES: "/api/student/quizzes",
  STUDENT_CERTIFICATE: "/api/student/courses/:id/certificate",
  STUDENT_ENROLLMENT: "/api/student/enroll/:id",
};

export default {
  USER_ROLES,
  COURSE_CATEGORIES,
  MATERIAL_TYPES,
  QUESTION_TYPES,
  ROUTES,
  COURSE_STATUS,
  ASSIGNMENT_STATUS,
  PROGRESS_STATUS,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  PAGINATION,
  STORAGE_KEYS,
  TOAST_DURATION,
  UPLOAD_LIMITS,
  API_ENDPOINTS,
};
