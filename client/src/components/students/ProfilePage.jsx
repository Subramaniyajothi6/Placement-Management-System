import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../slices/authSlice";
import {
  createStudent,
  selectStudentLoading,
  selectStudentError,
  uploadStudentResume,
} from "../../slices/studentSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);
  const navigate = useNavigate();

  const initialState = {
    userId: user?._id,
    name: "",
    email: "",
    phone: "",
    bio: "",
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      },
    ],
    experience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [""],
    portfolioLinks: [""],
    resume: "",
  };

  const [form, setForm] = useState(initialState);

  // Initialize form fields from logged-in user on mount
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        userId: user._id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      if (key) {
        newArray[index] = { ...newArray[index], [key]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  const addItem = (field) => {
    setForm((prev) => {
      let newItem;
      switch (field) {
        case "education":
          newItem = { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" };
          break;
        case "experience":
          newItem = { company: "", role: "", startDate: "", endDate: "", description: "" };
          break;
        case "skills":
        case "portfolioLinks":
          newItem = "";
          break;
        default:
          newItem = "";
      }
      return { ...prev, [field]: [...prev[field], newItem] };
    });
  };

  const removeItem = (field, index) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray.length ? newArray : [""] };
    });
  };

const handleResumeUpload = async (file) => {
  if (!file) return;
  console.log(user);
  try {
    const action = await dispatch(uploadStudentResume({ file }));
    if (uploadStudentResume.fulfilled.match(action)) {
      setForm((prev) => ({
        ...prev,
        resume: action.payload, // just the URL string now
      }));
      alert("Resume uploaded successfully!");
    } else {
      alert("Resume upload failed: " + action.payload);
    }
  } catch (error) {
    alert("Unexpected error uploading resume: " + error.message);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      userId: form.userId,
      bio: form.bio,
      education: form.education,
      experience: form.experience,
      skills: form.skills.filter((s) => s.trim() !== ""),
      portfolioLinks: form.portfolioLinks.filter((l) => l.trim() !== ""),
      resume: form.resume.trim(),
    };

    dispatch(createStudent(payload));
    alert("Profile created successfully!");
    setForm(initialState);
  };

  return (
    <div className="relative min-h-screen bg-indigo-50 py-12 px-6 sm:px-12 lg:px-20">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-6 z-50 flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-lg"
        aria-label="Go Back"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-10">
        <h2 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Create Your Profile</h2>

        {loading && <p className="text-center text-gray-600 mb-4">Processing...</p>}
        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-800">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-2 font-semibold text-gray-800">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block mb-2 font-semibold text-gray-800">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              placeholder="Write a short bio (max 500 characters)"
              className="w-full p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Education */}
          <fieldset className="border border-gray-300 rounded-md p-6 space-y-6">
            <legend className="font-semibold text-lg text-gray-800 mb-4">Education</legend>
            {form.education.map((edu, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-none last:pb-0 space-y-3">
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleArrayChange("education", i, "institution", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <input
                  type="text"
                  placeholder="Field Of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleArrayChange("education", i, "fieldOfStudy", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="Start Year"
                    value={edu.startYear}
                    onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)}
                    className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  <input
                    type="number"
                    placeholder="End Year"
                    value={edu.endYear}
                    onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)}
                    className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    min="1900"
                    max={new Date().getFullYear() + 10}
                  />
                </div>
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => removeItem("education", i)}
                  disabled={form.education.length === 1}
                >
                  Remove Education
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => addItem("education")}
            >
              + Add Education
            </button>
          </fieldset>

          {/* Experience */}
          <fieldset className="border border-gray-300 rounded-md p-6 space-y-6">
            <legend className="font-semibold text-lg text-gray-800 mb-4">Experience</legend>
            {form.experience.map((exp, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-none last:pb-0 space-y-3">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={exp.startDate ? exp.startDate.slice(0, 10) : ""}
                    onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={exp.endDate ? exp.endDate.slice(0, 10) : ""}
                    onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  rows={3}
                />
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => removeItem("experience", i)}
                  disabled={form.experience.length === 1}
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => addItem("experience")}
            >
              + Add Experience
            </button>
          </fieldset>

          {/* Skills */}
          <fieldset className="border border-gray-300 rounded-md p-6 space-y-4">
            <legend className="font-semibold text-lg text-gray-800 mb-4">Skills</legend>
            {form.skills.map((skill, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) => handleArrayChange("skills", i, null, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => removeItem("skills", i)}
                  disabled={form.skills.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => addItem("skills")}
            >
              + Add Skill
            </button>
          </fieldset>

          {/* Portfolio Links */}
          <fieldset className="border border-gray-300 rounded-md p-6 space-y-4">
            <legend className="font-semibold text-lg text-gray-800 mb-4">Portfolio Links</legend>
            {form.portfolioLinks.map((link, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => removeItem("portfolioLinks", i)}
                  disabled={form.portfolioLinks.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => addItem("portfolioLinks")}
            >
              + Add Link
            </button>
          </fieldset>

          {/* Resume Upload */}
          <div>
            <label htmlFor="resumeFile" className="block mb-2 font-semibold text-gray-800">
              Upload Resume (PDF, DOC, DOCX)
            </label>
            <input
              id="resumeFile"
              name="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleResumeUpload(e.target.files[0])}
              className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {form.resume && (
              <a
                href={form.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-indigo-600 underline"
              >
                View uploaded resume
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition shadow"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
