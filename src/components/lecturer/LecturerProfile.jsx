import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Map,
  FileText,
  Edit,
  Camera,
  Book,
  GraduationCap,
  Award,
  Save,
  X,
} from "lucide-react";
import api from "../../services/api";
import { formatErrorMessage } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

const LecturerProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileStats, setProfileStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
  });

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    bio: "",
    expertise: [],
    education: [],
    certifications: [],
    profileImage: null,
  });

  // Fetch lecturer profile data on component mount
  useEffect(() => {
    if (currentUser) {
      fetchProfile();
      fetchProfileStats();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/lecturers/profile`);

      setFormData({
        fname: response.data.fname || currentUser.fname || "",
        lname: response.data.lname || currentUser.lname || "",
        email: response.data.email || currentUser.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        department: response.data.department || "",
        bio: response.data.bio || "",
        expertise: response.data.expertise || [],
        education: response.data.education || [],
        certifications: response.data.certifications || [],
        profileImage:
          response.data.profile_image_url || "/api/placeholder/150/150",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Use current user data as fallback
      if (currentUser) {
        setFormData({
          fname: currentUser.fname || "",
          lname: currentUser.lname || "",
          email: currentUser.email || "",
          phone: "",
          address: "",
          department: "",
          bio: "",
          expertise: [],
          education: [],
          certifications: [],
          profileImage: "/api/placeholder/150/150",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileStats = async () => {
    try {
      const response = await api.get(`/lecturers/stats`);
      setProfileStats({
        totalCourses: response.data.total_courses || 0,
        totalStudents: response.data.total_students || 0,
        totalMaterials: response.data.total_materials || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(e.target.files[0]),
        profileImageFile: e.target.files[0],
      }));
    }
  };

  const handleExpertiseChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newExpertise = e.target.value.trim();

      if (!formData.expertise.includes(newExpertise)) {
        setFormData((prev) => ({
          ...prev,
          expertise: [...prev.expertise, newExpertise],
        }));
      }

      e.target.value = "";
    }
  };

  const removeExpertise = (item) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((exp) => exp !== item),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: "", issuer: "", year: "" },
      ],
    }));
  };

  const updateCertification = (index, field, value) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const data = new FormData();
      data.append("fname", formData.fname);
      data.append("lname", formData.lname);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("department", formData.department);
      data.append("bio", formData.bio);
      data.append("expertise", JSON.stringify(formData.expertise));
      data.append("education", JSON.stringify(formData.education));
      data.append("certifications", JSON.stringify(formData.certifications));

      if (formData.profileImageFile) {
        data.append("profile_image", formData.profileImageFile);
      }

      await api.put("/lecturers/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Also update the user context if necessary
      if (updateUserProfile) {
        updateUserProfile({
          fname: formData.fname,
          lname: formData.lname,
        });
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="bg-indigo-600 rounded-t-lg p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              <img
                src={formData.profileImage || "/api/placeholder/150/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100"
              >
                <Camera className="h-5 w-5 text-gray-600" />
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-2xl font-bold">
              {formData.fname} {formData.lname}
            </h1>
            <p className="text-indigo-100">
              {formData.department || "Lecturer"}
            </p>
            <div className="mt-2">
              {formData.expertise &&
                formData.expertise.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-indigo-700 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))}
              {formData.expertise && formData.expertise.length > 3 && (
                <span className="inline-block bg-indigo-700 rounded-full px-3 py-1 text-sm font-semibold text-white">
                  +{formData.expertise.length - 3} more
                </span>
              )}
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="mt-4 md:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-25 transition"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring focus:ring-indigo-300 disabled:opacity-25 transition"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {profileStats.totalCourses}
            </div>
            <div className="text-sm text-gray-500">Courses Created</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {profileStats.totalStudents}
            </div>
            <div className="text-sm text-gray-500">Total Students</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {profileStats.totalMaterials}
            </div>
            <div className="text-sm text-gray-500">Materials Uploaded</div>
          </div>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-6 mt-6">
          <span className="block sm:inline">{success}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccess(null)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-6 mt-6">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Profile Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="fname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="fname"
                name="fname"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.fname}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lname"
                name="lname"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.lname}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                  value={formData.email}
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <div className="flex items-center">
              <Map className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                id="address"
                name="address"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              value={formData.department}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <div className="flex">
              <FileText className="h-5 w-5 text-gray-400 mr-2 mt-2" />
              <textarea
                id="bio"
                name="bio"
                rows="4"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
              ></textarea>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Areas of Expertise
            </label>
            {isEditing && (
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Add expertise (press Enter)"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                  onKeyDown={handleExpertiseChange}
                />
              </div>
            )}
            <div className="flex flex-wrap">
              {formData.expertise.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2 mb-2"
                >
                  {item}
                  {isEditing && (
                    <button
                      type="button"
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4"
                      onClick={() => removeExpertise(item)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {formData.expertise.length === 0 && !isEditing && (
                <span className="text-gray-500 text-sm">
                  No expertise added yet
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Education
              </label>
              {isEditing && (
                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Education
                </button>
              )}
            </div>
            {formData.education.length === 0 && !isEditing ? (
              <p className="text-gray-500 text-sm">
                No education history added yet
              </p>
            ) : (
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-indigo-500 mr-2 mt-1" />
                        <div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Degree"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "degree",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="Institution"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={edu.institution}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "institution",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="Year"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={edu.year}
                                onChange={(e) =>
                                  updateEducation(index, "year", e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-md font-medium">
                                {edu.degree}
                              </p>
                              <p className="text-sm text-gray-500">
                                {edu.institution}, {edu.year}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Certifications
              </label>
              {isEditing && (
                <button
                  type="button"
                  onClick={addCertification}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Certification
                </button>
              )}
            </div>
            {formData.certifications.length === 0 && !isEditing ? (
              <p className="text-gray-500 text-sm">
                No certifications added yet
              </p>
            ) : (
              <div className="space-y-4">
                {formData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <Award className="h-5 w-5 text-indigo-500 mr-2 mt-1" />
                        <div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Certification Name"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={cert.name}
                                onChange={(e) =>
                                  updateCertification(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="Issuing Organization"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={cert.issuer}
                                onChange={(e) =>
                                  updateCertification(
                                    index,
                                    "issuer",
                                    e.target.value
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="Year"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                value={cert.year}
                                onChange={(e) =>
                                  updateCertification(
                                    index,
                                    "year",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <>
                              <p className="text-md font-medium">{cert.name}</p>
                              <p className="text-sm text-gray-500">
                                {cert.issuer}, {cert.year}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LecturerProfile;
