import { ERROR_MESSAGES, UPLOAD_LIMITS } from "./constants";

/**
 * Format date to local string
 * @param {String|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {String} Formatted date
 */
export const formatDate = (date, options = {}) => {
  try {
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return new Date(date).toLocaleDateString(undefined, {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

/**
 * Format datetime to local string
 * @param {String|Date} date - Date to format
 * @returns {String} Formatted datetime
 */
export const formatDateTime = (date) => {
  return formatDate(date, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format time ago (relative time)
 * @param {String|Date} date - Date to format
 * @returns {String} Relative time
 */
export const timeAgo = (date) => {
  try {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("Time ago formatting error:", error);
    return "some time ago";
  }
};

/**
 * Truncate text to specified length
 * @param {String} text - Text to truncate
 * @param {Number} length - Maximum length
 * @returns {String} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Get file extension from filename
 * @param {String} filename - Filename
 * @returns {String} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Check if file is valid based on type and size
 * @param {File} file - File to check
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {Number} maxSize - Maximum file size in bytes
 * @returns {Object} Validation result {valid, error}
 */
export const validateFile = (
  file,
  allowedTypes = [],
  maxSize = UPLOAD_LIMITS.MAX_FILE_SIZE
) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type if allowedTypes are provided
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Format error message from API error
 * @param {Error} error - Error object
 * @returns {String} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.DEFAULT;

  // Handle axios error
  if (error.response) {
    const { status, data } = error.response;

    // Handle standard error responses
    if (data && data.message) {
      return data.message;
    }

    // Handle validation errors
    if (data && data.errors && Array.isArray(data.errors)) {
      return data.errors.map((err) => err.msg).join(", ");
    }

    // Handle HTTP status codes
    switch (status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return ERROR_MESSAGES.VALIDATION;
      default:
        return ERROR_MESSAGES.DEFAULT;
    }
  }

  // Handle network errors
  if (error.request) {
    return ERROR_MESSAGES.NETWORK;
  }

  // Handle other errors
  return error.message || ERROR_MESSAGES.DEFAULT;
};

/**
 * Calculate progress percentage
 * @param {Number} completed - Completed items
 * @param {Number} total - Total items
 * @returns {Number} Progress percentage
 */
export const calculateProgress = (completed, total) => {
  if (!total || total === 0) return 0;
  const percentage = (completed / total) * 100;
  return Math.min(Math.round(percentage), 100);
};

/**
 * Generate random color
 * @returns {String} Hex color code
 */
export const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  formatDate,
  formatDateTime,
  timeAgo,
  truncateText,
  getFileExtension,
  validateFile,
  formatErrorMessage,
  calculateProgress,
  generateRandomColor,
  debounce,
};
