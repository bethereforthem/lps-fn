// import React from "react";
// import CourseDetailsComponent from "../components/student/CourseDetails";
// import { useAuth } from "../context/AuthContext";

// const CourseDetails = () => {
//   // This page is accessible to all users, even if not logged in
//   // They'll be prompted to log in when they try to enroll

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <CourseDetailsComponent />
//     </div>
//   );
// };

// export default CourseDetails;

import React from "react";
import { useParams } from "react-router-dom";
import CourseDetails from "../components/student/CourseDetails";

const CourseDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* We're using the CourseDetails component directly, which already has all the 
          necessary navigation, content display, and enrollment functionality */}
      <CourseDetails />
    </div>
  );
};

export default CourseDetailsPage;
