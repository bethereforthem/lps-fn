// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   User,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   CheckCircle,
// } from "lucide-react";
// import authService from "../services/authService";
// import { formatErrorMessage } from "../utils/helpers";

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Verification

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "student", // Default role is student
//   });

//   const [otp, setOtp] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Clear error for this field when user types
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//     setErrorMessage("");
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Validate first name
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }

//     // Validate last name
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     }

//     // Validate email
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     // Validate password
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     // Validate confirm password
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       setIsLoading(true);
//       setErrorMessage("");
//       setSuccessMessage("");

//       try {
//         // Prepare registration data - backend expects fname and lname
//         const registrationData = {
//           fname: formData.firstName.trim(),
//           lname: formData.lastName.trim(),
//           email: formData.email.trim(),
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//           role: formData.role,
//         };

//         console.log("Sending registration data:", registrationData);

//         // Call the registration API
//         const response = await authService.register(registrationData);

//         console.log("Registration response:", response);
//         console.log("Response status:", response.status);

//         // Check if registration was successful
//         if (response && (response.success || response.message)) {
//           setSuccessMessage(
//             response.message ||
//               "Registration successful! Please check your email for OTP."
//           );

//           // Move to OTP verification step
//           setStep(2);
//         } else {
//           setErrorMessage("Registration failed. Please try again.");
//         }
//       } catch (error) {
//         console.error("Registration error:", error);
//         console.error("Error response data:", error.response?.data);
//         console.error("Error response status:", error.response?.status);
//         console.error("Error message:", error.message);

//         // Get specific error message from API
//         let errorMsg = "Registration failed. Please try again.";

//         if (error.response?.data) {
//           // Check different possible error message formats
//           if (error.response.data.message) {
//             errorMsg = error.response.data.message;
//           } else if (error.response.data.error) {
//             errorMsg = error.response.data.error;
//           } else if (error.response.data.errors) {
//             // Handle validation errors array
//             if (Array.isArray(error.response.data.errors)) {
//               errorMsg = error.response.data.errors
//                 .map((e) => e.msg || e.message)
//                 .join(", ");
//             } else {
//               errorMsg = JSON.stringify(error.response.data.errors);
//             }
//           }
//         } else {
//           errorMsg = formatErrorMessage(error);
//         }

//         setErrorMessage(errorMsg);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();

//     if (!otp || otp.length !== 6) {
//       setErrorMessage("Please enter a valid 6-digit OTP");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const verificationData = {
//         email: formData.email.trim(),
//         otp: otp.trim(),
//       };

//       console.log("Verifying OTP:", verificationData);

//       // Call the OTP verification API
//       const response = await authService.verifyEmail(verificationData);

//       console.log("OTP verification response:", response);

//       if (response && (response.success || response.verified)) {
//         setSuccessMessage("Email verified successfully!");
//         setRegistrationSuccess(true);
//       } else {
//         setErrorMessage("Invalid or expired OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       const errorMsg = formatErrorMessage(error);
//       setErrorMessage(errorMsg || "OTP verification failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       console.log("Resending OTP to:", formData.email.trim());

//       const response = await authService.resendOTP({
//         email: formData.email.trim(),
//       });

//       console.log("Resend OTP response:", response);

//       if (response && (response.success || response.message)) {
//         setSuccessMessage(
//           response.message || "OTP has been resent to your email"
//         );
//         setOtp(""); // Clear the OTP input
//       } else {
//         setErrorMessage("Failed to resend OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Resend OTP error:", error);
//       console.error("Resend OTP error response:", error.response?.data);

//       // Get specific error message
//       let errorMsg = "Failed to resend OTP.";
//       if (error.response?.data?.message) {
//         errorMsg = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMsg = error.response.data.error;
//       } else {
//         errorMsg = formatErrorMessage(error);
//       }

//       setErrorMessage(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const navigateToLogin = () => {
//     navigate("/login");
//   };

//   // Get current year dynamically
//   const currentYear = new Date().getFullYear();

//   // Registration Success Screen
//   if (registrationSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
//         <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="bg-green-600 px-6 py-8 text-white text-center">
//             <CheckCircle size={64} className="mx-auto mb-4" />
//             <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//               Registration Successful!
//             </h1>
//             <p className="text-sm sm:text-base">
//               Your account has been created and verified
//             </p>
//           </div>
//           <div className="p-6 text-center">
//             <p className="mb-6 text-gray-700 text-sm sm:text-base">
//               {formData.role === "student"
//                 ? "Your student account has been created successfully. You can now log in to access your courses."
//                 : "Your lecturer account request has been submitted. An administrator will review and approve your account shortly."}
//             </p>
//             <button
//               onClick={navigateToLogin}
//               className="w-full sm:inline-block sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
//             >
//               Proceed to Login
//             </button>
//           </div>
//         </div>

//         <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
//           &copy; {currentYear} Learning Portal System. All rights reserved.
//         </div>
//       </div>
//     );
//   }

//   // OTP Verification Step
//   if (step === 2) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
//         <div className="absolute top-4 left-4">
//           <button
//             onClick={() => setStep(1)}
//             className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm sm:text-base"
//           >
//             <ArrowLeft size={20} className="mr-1" />
//             Back
//           </button>
//         </div>

//         <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Header */}
//           <div className="bg-indigo-900 px-6 py-8 text-white text-center">
//             <Mail size={48} className="mx-auto mb-4" />
//             <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//               Verify Your Email
//             </h1>
//             <p className="text-indigo-200 text-sm sm:text-base">
//               Enter the OTP sent to {formData.email}
//             </p>
//           </div>

//           {/* Form Content */}
//           <div className="p-6">
//             {errorMessage && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//                 {errorMessage}
//               </div>
//             )}

//             {successMessage && (
//               <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
//                 {successMessage}
//               </div>
//             )}

//             <form onSubmit={handleVerifyOTP}>
//               <div className="mb-6">
//                 <label
//                   htmlFor="otp"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   OTP Code
//                 </label>
//                 <input
//                   id="otp"
//                   type="text"
//                   value={otp}
//                   onChange={(e) => {
//                     setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
//                     setErrorMessage("");
//                   }}
//                   className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="000000"
//                   maxLength="6"
//                   required
//                   disabled={isLoading}
//                 />
//                 <p className="mt-2 text-xs text-gray-500 text-center">
//                   Please enter the 6-digit code sent to your email
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading || otp.length !== 6}
//                 className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                   isLoading || otp.length !== 6
//                     ? "bg-indigo-400 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//               >
//                 {isLoading ? "Verifying..." : "Verify OTP"}
//               </button>

//               <div className="mt-6 text-center">
//                 <p className="text-gray-600 text-sm mb-2">
//                   Didn't receive the code?
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleResendOTP}
//                   disabled={isLoading}
//                   className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
//                 >
//                   Resend OTP
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
//           &copy; {currentYear} Learning Portal System. All rights reserved.
//         </div>
//       </div>
//     );
//   }

//   // Registration Form (Step 1)
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
//       <div className="absolute top-4 left-4">
//         <button
//           onClick={() => navigate("/")}
//           className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm sm:text-base"
//         >
//           <ArrowLeft size={20} className="mr-1" />
//           <span className="hidden sm:inline">Back to Home</span>
//           <span className="sm:hidden">Back</span>
//         </button>
//       </div>

//       <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="bg-indigo-900 px-6 py-6 sm:py-8 text-white text-center">
//           <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//             Create Account
//           </h1>
//           <p className="text-indigo-200 text-sm sm:text-base">
//             Join our learning community
//           </p>
//         </div>

//         {/* Form Content */}
//         <div className="p-4 sm:p-6">
//           {errorMessage && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//               {errorMessage}
//             </div>
//           )}

//           {successMessage && (
//             <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
//               {successMessage}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//               {/* First Name */}
//               <div>
//                 <label
//                   htmlFor="firstName"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={20} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       errors.firstName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="John"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 {errors.firstName && (
//                   <p className="mt-1 text-red-500 text-xs">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label
//                   htmlFor="lastName"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   Last Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={20} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       errors.lastName ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder="Doe"
//                     disabled={isLoading}
//                   />
//                 </div>
//                 {errors.lastName && (
//                   <p className="mt-1 text-red-500 text-xs">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 text-sm font-medium mb-2"
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail size={20} className="text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="your@email.com"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 text-sm font-medium mb-2"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock size={20} className="text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="••••••••"
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOff size={20} className="text-gray-400" />
//                   ) : (
//                     <Eye size={20} className="text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div className="mb-4">
//               <label
//                 htmlFor="confirmPassword"
//                 className="block text-gray-700 text-sm font-medium mb-2"
//               >
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock size={20} className="text-gray-400" />
//                 </div>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                     errors.confirmPassword
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="••••••••"
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={toggleConfirmPasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   disabled={isLoading}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff size={20} className="text-gray-400" />
//                   ) : (
//                     <Eye size={20} className="text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-red-500 text-xs">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Role Selection */}
//             <div className="mb-6">
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Register as
//               </label>
//               <div className="grid grid-cols-2 gap-3 sm:gap-4">
//                 <div
//                   className={`flex items-center justify-center p-3 rounded-md cursor-pointer border transition-colors ${
//                     formData.role === "student"
//                       ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                       : "border-gray-300 hover:bg-gray-50"
//                   } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                   onClick={() =>
//                     !isLoading &&
//                     handleChange({ target: { name: "role", value: "student" } })
//                   }
//                 >
//                   <span className="font-medium text-sm sm:text-base">
//                     Student
//                   </span>
//                 </div>
//                 <div
//                   className={`flex items-center justify-center p-3 rounded-md cursor-pointer border transition-colors ${
//                     formData.role === "lecturer"
//                       ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                       : "border-gray-300 hover:bg-gray-50"
//                   } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                   onClick={() =>
//                     !isLoading &&
//                     handleChange({
//                       target: { name: "role", value: "lecturer" },
//                     })
//                   }
//                 >
//                   <span className="font-medium text-sm sm:text-base">
//                     Lecturer
//                   </span>
//                 </div>
//               </div>
//               {formData.role === "lecturer" && (
//                 <p className="mt-2 text-xs sm:text-sm text-amber-600">
//                   Note: Lecturer accounts require admin approval before
//                   activation.
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                 isLoading
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }`}
//             >
//               {isLoading ? "Creating Account..." : "Create Account"}
//             </button>

//             <div className="mt-6 text-center">
//               <p className="text-gray-600 text-sm">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={navigateToLogin}
//                   disabled={isLoading}
//                   className="text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
//         &copy; {currentYear} Learning Portal System. All rights reserved.
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import authService from "../services/authService";
import { formatErrorMessage } from "../utils/helpers";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Verification

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role is student
  });

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      try {
        // Prepare registration data - backend expects fname and lname
        const registrationData = {
          fname: formData.firstName.trim(),
          lname: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        };

        console.log("Sending registration data:", registrationData);

        // Call the registration API
        const response = await authService.register(registrationData);

        console.log("Registration response:", response);
        console.log("Response status:", response.status);

        // Check if registration was successful
        if (response && (response.success || response.message)) {
          setSuccessMessage(
            response.message ||
              "Registration successful! Please check your email for OTP."
          );

          // Move to OTP verification step
          setStep(2);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error message:", error.message);

        // Get specific error message from API
        let errorMsg = "Registration failed. Please try again.";

        if (error.response?.data) {
          // Check different possible error message formats
          if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (error.response.data.error) {
            errorMsg = error.response.data.error;
          } else if (error.response.data.errors) {
            // Handle validation errors array
            if (Array.isArray(error.response.data.errors)) {
              errorMsg = error.response.data.errors
                .map((e) => e.msg || e.message)
                .join(", ");
            } else {
              errorMsg = JSON.stringify(error.response.data.errors);
            }
          }
        } else {
          errorMsg = formatErrorMessage(error);
        }

        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const verificationData = {
        email: formData.email.trim(),
        otp: otp.trim(),
      };

      console.log("Verifying OTP:", verificationData);

      // Call the OTP verification API
      const response = await authService.verifyEmail(verificationData);

      console.log("OTP verification response:", response);

      // Check multiple possible success indicators
      if (
        response &&
        (response.success === true ||
          response.verified === true ||
          response.message?.toLowerCase().includes("verified") ||
          response.message?.toLowerCase().includes("success"))
      ) {
        setSuccessMessage(response.message || "Email verified successfully!");
        // Wait a moment to show success message, then move to success screen
        setTimeout(() => {
          setRegistrationSuccess(true);
        }, 1500);
      } else {
        setErrorMessage(
          response.message || "Invalid or expired OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      console.error("OTP verification error response:", error.response?.data);

      // Get specific error message
      let errorMsg = "OTP verification failed.";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else {
        errorMsg = formatErrorMessage(error);
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("Resending OTP to:", formData.email.trim());

      const response = await authService.resendOTP({
        email: formData.email.trim(),
      });

      console.log("Resend OTP response:", response);

      if (response && (response.success || response.message)) {
        setSuccessMessage(
          response.message || "OTP has been resent to your email"
        );
        setOtp(""); // Clear the OTP input
      } else {
        setErrorMessage("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      console.error("Resend OTP error response:", error.response?.data);

      // Get specific error message
      let errorMsg = "Failed to resend OTP.";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else {
        errorMsg = formatErrorMessage(error);
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  // Registration Success Screen
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 px-6 py-8 text-white text-center">
            <CheckCircle size={64} className="mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Registration Successful!
            </h1>
            <p className="text-sm sm:text-base">
              Your account has been created and verified
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="mb-6 text-gray-700 text-sm sm:text-base">
              {formData.role === "student"
                ? "Your student account has been created successfully. You can now log in to access your courses."
                : "Your lecturer account request has been submitted. An administrator will review and approve your account shortly."}
            </p>
            <button
              onClick={navigateToLogin}
              className="w-full sm:inline-block sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Proceed to Login
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
          &copy; {currentYear} Learning Portal System. All rights reserved.
        </div>
      </div>
    );
  }

  // OTP Verification Step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setStep(1)}
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm sm:text-base"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back
          </button>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-900 px-6 py-8 text-white text-center">
            <Mail size={48} className="mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Verify Your Email
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base">
              Enter the OTP sent to {formData.email}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setErrorMessage("");
                  }}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="000000"
                  maxLength="6"
                  required
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Please enter the 6-digit code sent to your email
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading || otp.length !== 6
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
          &copy; {currentYear} Learning Portal System. All rights reserved.
        </div>
      </div>
    );
  }

  // Registration Form (Step 1)
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm sm:text-base"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 px-6 py-6 sm:py-8 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Create Account
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base">
            Join our learning community
          </p>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Register as
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div
                  className={`flex items-center justify-center p-3 rounded-md cursor-pointer border transition-colors ${
                    formData.role === "student"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 hover:bg-gray-50"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    !isLoading &&
                    handleChange({ target: { name: "role", value: "student" } })
                  }
                >
                  <span className="font-medium text-sm sm:text-base">
                    Student
                  </span>
                </div>
                <div
                  className={`flex items-center justify-center p-3 rounded-md cursor-pointer border transition-colors ${
                    formData.role === "lecturer"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 hover:bg-gray-50"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    !isLoading &&
                    handleChange({
                      target: { name: "role", value: "lecturer" },
                    })
                  }
                >
                  <span className="font-medium text-sm sm:text-base">
                    Lecturer
                  </span>
                </div>
              </div>
              {formData.role === "lecturer" && (
                <p className="mt-2 text-xs sm:text-sm text-amber-600">
                  Note: Lecturer accounts require admin approval before
                  activation.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={navigateToLogin}
                  disabled={isLoading}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm px-4">
        &copy; {currentYear} Learning Portal System. All rights reserved.
      </div>
    </div>
  );
};

export default RegisterPage;
