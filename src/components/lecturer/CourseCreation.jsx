import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Plus,
  File,
  Video,
  FileText,
  Code,
  Presentation,
  Trash,
  Edit,
  AlignLeft,
  Tag,
  BookOpen,
} from "lucide-react";
import { COURSE_CATEGORIES } from "../../utils/constants";
import courseService from "../../services/courseService";
import { formatErrorMessage, validateFile } from "../../utils/helpers";

const CourseCreation = ({ editCourseId = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentTab, setCurrentTab] = useState("details");
  const [materials, setMaterials] = useState([]);
  const [materialFormData, setMaterialFormData] = useState({
    title: "",
    file: null,
    fileType: "pdf",
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Load course data if in edit mode
  useEffect(() => {
    if (editCourseId) {
      setIsEditMode(true);
      fetchCourseData();
    }
  }, [editCourseId]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      const course = await courseService.getCourseById(editCourseId);

      // Set form data
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "",
        tags: course.tags || [],
      });

      // Fetch course materials
      const materialsData = await courseService.getCourseMaterials(
        editCourseId
      );
      setMaterials(materialsData || []);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle material form input changes
  const handleMaterialChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files && files.length > 0) {
      setMaterialFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setMaterialFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();

      // Add tag if it doesn't already exist
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }));
      }

      setCurrentTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Submit course form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (isEditMode) {
        await courseService.updateCourse(editCourseId, formData);
        setSuccess("Course updated successfully!");
      } else {
        const result = await courseService.createCourse(formData);
        setSuccess("Course created successfully!");

        // Reset form if not in edit mode
        if (!isEditMode) {
          setFormData({
            title: "",
            description: "",
            category: "",
            tags: [],
          });
        }
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Submit material form
  const handleMaterialSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      // Validate file
      if (!materialFormData.file) {
        setError("Please select a file to upload");
        setIsLoading(false);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", materialFormData.title);
      formDataToSend.append("file", materialFormData.file);
      formDataToSend.append("fileType", materialFormData.fileType);

      await courseService.uploadCourseMaterial(
        editCourseId || formData.courseId,
        formDataToSend
      );

      // Refresh materials list
      const materialsData = await courseService.getCourseMaterials(
        editCourseId || formData.courseId
      );
      setMaterials(materialsData || []);

      // Reset material form
      setMaterialFormData({
        title: "",
        file: null,
        fileType: "pdf",
      });

      setSuccess("Material uploaded successfully!");
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Delete material
  const handleDeleteMaterial = async (materialId) => {
    if (!confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      setIsLoading(true);
      await api.delete(`/materials/${materialId}`);

      // Refresh materials list
      setMaterials(
        materials.filter((material) => material.material_id !== materialId)
      );

      setSuccess("Material deleted successfully!");
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Get material icon based on file type
  const getMaterialIcon = (fileType) => {
    switch (fileType) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "ppt":
        return <Presentation className="w-5 h-5" />;
      case "code":
        return <Code className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Course" : "Create New Course"}
        </h2>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccess(null)}
          >
            <X className="h-6 w-6" />
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <X className="h-6 w-6" />
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 ${
                currentTab === "details"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setCurrentTab("details")}
            >
              <AlignLeft className="w-5 h-5 inline mr-2" />
              Course Details
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 ${
                currentTab === "materials"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setCurrentTab("materials")}
              disabled={!isEditMode}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Course Materials
            </button>
          </li>
        </ul>
      </div>

      {/* Course Details Tab */}
      {currentTab === "details" && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Title*
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category*
              </label>
              <select
                name="category"
                id="category"
                required
                className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {COURSE_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <textarea
                name="description"
                id="description"
                rows="5"
                required
                className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags <span className="text-gray-500">(Press Enter to add)</span>
              </label>
              <div className="flex items-center">
                <Tag className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Add tags..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-600 hover:text-blue-800 focus:outline-none"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading
                  ? "Processing..."
                  : isEditMode
                  ? "Update Course"
                  : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Course Materials Tab */}
      {currentTab === "materials" && (
        <div>
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Add New Material
            </h3>
            <form onSubmit={handleMaterialSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="material-title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="material-title"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    value={materialFormData.title}
                    onChange={handleMaterialChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="file-type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type*
                  </label>
                  <select
                    name="fileType"
                    id="file-type"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    value={materialFormData.fileType}
                    onChange={handleMaterialChange}
                  >
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="ppt">PowerPoint</option>
                    <option value="doc">Document</option>
                    <option value="code">Code Sample</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  File*
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                  onChange={handleMaterialChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isLoading ? "Uploading..." : "Upload Material"}
              </button>
            </form>
          </div>

          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Course Materials
          </h3>

          {materials.length === 0 ? (
            <p className="text-gray-500 italic">No materials uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.material_id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-md mr-4">
                      {getMaterialIcon(material.file_type)}
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-800">
                        {material.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Added on{" "}
                        {new Date(material.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                    >
                      <File className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleDeleteMaterial(material.material_id)}
                      className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCreation;
