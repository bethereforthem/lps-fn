

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Mail, Lock } from "lucide-react";
// import authService from "../services/authService";
// import { formatErrorMessage } from "../utils/helpers";

// const ForgotPasswordPage = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [resetToken, setResetToken] = useState(""); // Store token from OTP verification
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//     setErrorMessage("");
//     setSuccessMessage("");
//   };

//   const handleRequestReset = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       setErrorMessage("Email is required");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setErrorMessage("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const response = await authService.requestReset({ email: email.trim() });

//       console.log("Request reset response:", response);

//       // Check various success indicators - be more flexible
//       if (
//         response &&
//         (response.success === true ||
//           response.message ||
//           response.data?.message ||
//           // If there's no error, assume success
//           !response.error)
//       ) {
//         const message =
//           response.message ||
//           response.data?.message ||
//           "Password reset OTP has been sent to your email";
//         setSuccessMessage(message);
//         // Move to step 2 after short delay to show success message
//         setTimeout(() => {
//           setStep(2);
//         }, 1000);
//       } else {
//         setErrorMessage(
//           response.error || "Failed to send reset email. Please try again."
//         );
//       }
//     } catch (error) {
//       console.error("Password reset request error:", error);
//       console.error("Error response data:", error.response?.data);

//       // If we get a 200 response but axios treats it as error
//       if (error.response?.status === 200 || error.response?.status === 201) {
//         const message =
//           error.response?.data?.message ||
//           "Password reset OTP has been sent to your email";
//         setSuccessMessage(message);
//         setTimeout(() => {
//           setStep(2);
//         }, 1000);
//         setIsLoading(false);
//         return;
//       }

//       let errorMsg = "Failed to send reset email.";
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
//       const response = await authService.verifyResetOTP({
//         email: email.trim(),
//         otp: otp.trim(),
//       });

//       console.log("=== VERIFY OTP RESPONSE ===");
//       console.log("Full response:", response);
//       console.log("Response keys:", Object.keys(response));
//       console.log("Token:", response.token);
//       console.log("ResetToken:", response.resetToken);
//       console.log("Data:", response.data);

//       // Try to find the token in various places
//       let token = null;

//       if (response.token) {
//         token = response.token;
//       } else if (response.resetToken) {
//         token = response.resetToken;
//       } else if (response.data?.token) {
//         token = response.data.token;
//       } else if (response.data?.resetToken) {
//         token = response.data.resetToken;
//       } else if (response.accessToken) {
//         token = response.accessToken;
//       }

//       console.log("Extracted token:", token);

//       // Check for success
//       if (response || token) {
//         // Store the token even if it's null - we'll handle it in next step
//         setResetToken(token || "verified");
//         const message =
//           response.message ||
//           response.data?.message ||
//           "OTP verified! Please enter your new password.";
//         setSuccessMessage(message);
//         setTimeout(() => {
//           setStep(3);
//         }, 1000);
//       } else {
//         setErrorMessage("Invalid or expired OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("=== OTP VERIFICATION ERROR ===");
//       console.error("Error:", error);
//       console.error("Error response:", error.response);
//       console.error("Error response data:", error.response?.data);
//       console.error("Error response status:", error.response?.status);

//       // Check if it's actually successful despite error
//       if (error.response?.status === 200 || error.response?.status === 201) {
//         const data = error.response?.data;
//         let token = data?.token || data?.resetToken || data?.accessToken;

//         console.log("Success in error - Token:", token);

//         setResetToken(token || "verified");
//         const message =
//           data?.message || "OTP verified! Please enter your new password.";
//         setSuccessMessage(message);
//         setTimeout(() => {
//           setStep(3);
//         }, 1000);
//         setIsLoading(false);
//         return;
//       }

//       let errorMsg = "Invalid or expired OTP.";
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

//   const handleResendOTP = async () => {
//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");
//     setOtp(""); // Clear OTP input

//     try {
//       const response = await authService.requestReset({ email: email.trim() });

//       console.log("Resend OTP response:", response);

//       if (
//         response &&
//         (response.success === true ||
//           response.message ||
//           response.data?.message ||
//           !response.error)
//       ) {
//         const message =
//           response.message ||
//           response.data?.message ||
//           "OTP has been resent to your email";
//         setSuccessMessage(message);
//       } else {
//         setErrorMessage("Failed to resend OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Resend OTP error:", error);

//       // Handle successful response in catch block
//       if (error.response?.status === 200 || error.response?.status === 201) {
//         const message =
//           error.response?.data?.message || "OTP has been resent to your email";
//         setSuccessMessage(message);
//         setIsLoading(false);
//         return;
//       }

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

//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (!otp || !newPassword || !confirmPassword) {
//       setErrorMessage("All fields are required");
//       return;
//     }

//     if (newPassword.length < 6) {
//       setErrorMessage("Password must be at least 6 characters long");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setErrorMessage("Passwords do not match");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const response = await authService.resetPassword({
//         email: email.trim(),
//         otp: otp.trim(),
//         newPassword: newPassword,
//       });

//       if (response.success) {
//         setSuccessMessage("Password reset successful! Redirecting to login...");
//         setTimeout(() => {
//           navigate("/login");
//         }, 2000);
//       } else {
//         setErrorMessage("Failed to reset password. Please try again.");
//       }
//     } catch (error) {
//       console.error("Password reset error:", error);
//       const errorMsg = formatErrorMessage(error);
//       setErrorMessage(errorMsg || "Failed to reset password");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const currentYear = new Date().getFullYear();

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
//       <div className="absolute top-4 left-4">
//         <button
//           onClick={() => navigate("/login")}
//           className="text-indigo-600 hover:text-indigo-800 flex items-center"
//         >
//           <ArrowLeft size={20} className="mr-1" />
//           Back to Login
//         </button>
//       </div>

//       <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="bg-indigo-900 px-6 py-8 text-white text-center">
//           <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
//           <p className="text-indigo-200">
//             {step === 1
//               ? "Enter your email to receive a reset code"
//               : step === 2
//               ? "Enter the OTP code sent to your email"
//               : "Create your new password"}
//           </p>
//         </div>

//         {/* Form */}
//         <div className="p-6">
//           {errorMessage && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//               {errorMessage}
//             </div>
//           )}

//           {successMessage && (
//             <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
//               {successMessage}
//             </div>
//           )}

//           {step === 1 ? (
//             <form onSubmit={handleRequestReset}>
//               <div className="mb-6">
//                 <label
//                   htmlFor="email"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail size={20} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={handleEmailChange}
//                     className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="your@email.com"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                   isLoading
//                     ? "bg-indigo-400 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//               >
//                 {isLoading ? "Sending..." : "Send Reset Code"}
//               </button>
//             </form>
//           ) : step === 2 ? (
//             <form onSubmit={handleVerifyOTP}>
//               <div className="mb-6">
//                 <label
//                   htmlFor="otp"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   Verification Code
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
//                   Enter the 6-digit code sent to {email}
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
//                 {isLoading ? "Verifying..." : "Verify Code"}
//               </button>

//               <div className="mt-4 text-center space-y-2">
//                 <p className="text-sm text-gray-600">
//                   Didn't receive the code?
//                 </p>
//                 <button
//                   type="button"
//                   onClick={handleResendOTP}
//                   disabled={isLoading}
//                   className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Resend OTP
//                 </button>
//                 <div>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setStep(1);
//                       setOtp("");
//                       setErrorMessage("");
//                       setSuccessMessage("");
//                     }}
//                     className="text-sm text-gray-600 hover:text-gray-800"
//                     disabled={isLoading}
//                   >
//                     Change email address
//                   </button>
//                 </div>
//               </div>
//             </form>
//           ) : (
//             <form onSubmit={handleResetPassword}>
//               <div className="mb-4">
//                 <label
//                   htmlFor="newPassword"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={20} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="newPassword"
//                     type="password"
//                     value={newPassword}
//                     onChange={(e) => {
//                       setNewPassword(e.target.value);
//                       setErrorMessage("");
//                     }}
//                     className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Enter new password"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">
//                   Must be at least 6 characters
//                 </p>
//               </div>

//               <div className="mb-6">
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-gray-700 text-sm font-medium mb-2"
//                 >
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={20} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="confirmPassword"
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => {
//                       setConfirmPassword(e.target.value);
//                       setErrorMessage("");
//                     }}
//                     className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Confirm new password"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                   isLoading
//                     ? "bg-indigo-400 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//               >
//                 {isLoading ? "Resetting..." : "Reset Password"}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>

//       <div className="mt-6 text-center text-gray-500 text-sm">
//         &copy; {currentYear} Learning Portal System. All rights reserved.
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import authService from "../services/authService";
import { formatErrorMessage } from "../utils/helpers";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(""); // Store token from OTP verification
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await authService.requestReset({ email: email.trim() });

      console.log("Request reset response:", response);

      // Check various success indicators - be more flexible
      if (
        response &&
        (response.success === true ||
          response.message ||
          response.data?.message ||
          // If there's no error, assume success
          !response.error)
      ) {
        const message =
          response.message ||
          response.data?.message ||
          "Password reset OTP has been sent to your email";
        setSuccessMessage(message);
        // Move to step 2 after short delay to show success message
        setTimeout(() => {
          setStep(2);
        }, 1000);
      } else {
        setErrorMessage(
          response.error || "Failed to send reset email. Please try again."
        );
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      console.error("Error response data:", error.response?.data);

      // If we get a 200 response but axios treats it as error
      if (error.response?.status === 200 || error.response?.status === 201) {
        const message =
          error.response?.data?.message ||
          "Password reset OTP has been sent to your email";
        setSuccessMessage(message);
        setTimeout(() => {
          setStep(2);
        }, 1000);
        setIsLoading(false);
        return;
      }

      let errorMsg = "Failed to send reset email.";
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
      const response = await authService.verifyResetOTP({
        email: email.trim(),
        otp: otp.trim(),
      });

      console.log("=== VERIFY OTP RESPONSE ===");
      console.log("Full response:", response);
      console.log("Response keys:", Object.keys(response));
      console.log("Token:", response.token);
      console.log("ResetToken:", response.resetToken);
      console.log("Data:", response.data);

      // Try to find the token in various places
      let token = null;

      if (response.token) {
        token = response.token;
      } else if (response.resetToken) {
        token = response.resetToken;
      } else if (response.data?.token) {
        token = response.data.token;
      } else if (response.data?.resetToken) {
        token = response.data.resetToken;
      } else if (response.accessToken) {
        token = response.accessToken;
      }

      console.log("Extracted token:", token);

      // Check for success
      if (response || token) {
        // Store the token even if it's null - we'll handle it in next step
        setResetToken(token || "verified");
        const message =
          response.message ||
          response.data?.message ||
          "OTP verified! Please enter your new password.";
        setSuccessMessage(message);
        setTimeout(() => {
          setStep(3);
        }, 1000);
      } else {
        setErrorMessage("Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      console.error("=== OTP VERIFICATION ERROR ===");
      console.error("Error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      // Check if it's actually successful despite error
      if (error.response?.status === 200 || error.response?.status === 201) {
        const data = error.response?.data;
        let token = data?.token || data?.resetToken || data?.accessToken;

        console.log("Success in error - Token:", token);

        setResetToken(token || "verified");
        const message =
          data?.message || "OTP verified! Please enter your new password.";
        setSuccessMessage(message);
        setTimeout(() => {
          setStep(3);
        }, 1000);
        setIsLoading(false);
        return;
      }

      let errorMsg = "Invalid or expired OTP.";
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
    setOtp(""); // Clear OTP input

    try {
      const response = await authService.requestReset({ email: email.trim() });

      console.log("Resend OTP response:", response);

      if (
        response &&
        (response.success === true ||
          response.message ||
          response.data?.message ||
          !response.error)
      ) {
        const message =
          response.message ||
          response.data?.message ||
          "OTP has been resent to your email";
        setSuccessMessage(message);
      } else {
        setErrorMessage("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      // Handle successful response in catch block
      if (error.response?.status === 200 || error.response?.status === 201) {
        const message =
          error.response?.data?.message || "OTP has been resent to your email";
        setSuccessMessage(message);
        setIsLoading(false);
        return;
      }

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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword,
      });

      if (response.success) {
        setSuccessMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMsg = formatErrorMessage(error);
      setErrorMessage(errorMsg || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/login")}
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Login
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 px-6 py-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-indigo-200">
            {step === 1
              ? "Enter your email to receive a reset code"
              : step === 2
              ? "Enter the OTP code sent to your email"
              : "Create your new password"}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestReset}>
              <div className="mb-6">
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
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
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
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Verification Code
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
                  Enter the 6-digit code sent to {email}
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
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>

              <div className="mt-4 text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Resend OTP
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                    disabled={isLoading}
                  >
                    Change email address
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="mb-6">
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
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                </div>
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
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        &copy; {currentYear} Learning Portal System. All rights reserved.
      </div>
    </div>
  );
};

export default ForgotPasswordPage;