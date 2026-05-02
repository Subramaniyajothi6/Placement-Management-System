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
import toast from "react-hot-toast";

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
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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

  // Validation helpers
  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    return "";
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    if (!phone.trim()) return "Phone number is required.";
    if (digits.length !== 10) return "Phone number must have exactly 10 digits.";
    return "";
  };

  const validateEducationYear = (startYear, endYear) => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (startYear) {
      const syNum = Number(startYear);
      if (isNaN(syNum) || syNum < 1900 || syNum > currentYear) {
        errors.startYear = "Start Year must be a valid year.";
      }
    }
    if (endYear) {
      const eyNum = Number(endYear);
      if (isNaN(eyNum) || eyNum < 1900 || eyNum > currentYear + 10) {
        errors.endYear = "End Year must be a valid year.";
      }
    }
    if (startYear && endYear && Number(startYear) > Number(endYear)) {
      errors.yearOrder = "Start Year cannot be greater than End Year.";
    }

    return errors;
  };

  const validateExperienceDates = (startDate, endDate) => {
    const errors = {};

    const isValidDate = (d) => !d || !isNaN(new Date(d).getTime());

    if (!isValidDate(startDate)) errors.startDate = "Start Date is invalid.";
    if (!isValidDate(endDate)) errors.endDate = "End Date is invalid.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.dateOrder = "Start Date cannot be after End Date.";
    }

    return errors;
  };

  const validateUrl = (value) => {
  if (!value.trim()) return ""; // no error if empty (not required)
  try {
    new URL(value);
    return "";
  } catch {
    return "Invalid URL format.";
  }
};
  // Handlers with live validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [name]: value }));

    let errorMsg = "";
    if (name === "email") errorMsg = validateEmail(value);
    else if (name === "phone") errorMsg = validatePhone(value);

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setIsDirty(true);
    setForm((prev) => {
      const newArray = [...prev[field]];
      if (key) {
        newArray[index] = { ...newArray[index], [key]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });

    setErrors((prev) => {
      const newErrors = { ...prev };


      if (field === "education" && key && (key === "startYear" || key === "endYear")) {
        const edu = form.education[index];
        const testStart = key === "startYear" ? value : edu.startYear;
        const testEnd = key === "endYear" ? value : edu.endYear;

        const eduErrors = validateEducationYear(testStart, testEnd);

        delete newErrors[`education_startYear_${index}`];
        delete newErrors[`education_endYear_${index}`];
        delete newErrors[`education_yearOrder_${index}`];

        if (eduErrors.startYear) newErrors[`education_startYear_${index}`] = eduErrors.startYear;
        if (eduErrors.endYear) newErrors[`education_endYear_${index}`] = eduErrors.endYear;
        if (eduErrors.yearOrder) newErrors[`education_yearOrder_${index}`] = eduErrors.yearOrder;
      }

      if (field === "experience" && key && (key === "startDate" || key === "endDate")) {
        const exp = form.experience[index];
        const testStart = key === "startDate" ? value : exp.startDate;
        const testEnd = key === "endDate" ? value : exp.endDate;

        const expErrors = validateExperienceDates(testStart, testEnd);

        delete newErrors[`experience_startDate_${index}`];
        delete newErrors[`experience_endDate_${index}`];
        delete newErrors[`experience_dateOrder_${index}`];

        if (expErrors.startDate) newErrors[`experience_startDate_${index}`] = expErrors.startDate;
        if (expErrors.endDate) newErrors[`experience_endDate_${index}`] = expErrors.endDate;
        if (expErrors.dateOrder) newErrors[`experience_dateOrder_${index}`] = expErrors.dateOrder;
      }
      if (field === "portfolioLinks" && !key) {
        const error = validateUrl(value);
        if (error) newErrors[`portfolioLinks_${index}`] = error;
        else delete newErrors[`portfolioLinks_${index}`];
      }

      return newErrors;
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
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`${field}_`) && key.includes(`_${index}`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    try {
      const action = await dispatch(uploadStudentResume({ file }));
      if (uploadStudentResume.fulfilled.match(action)) {
        setForm((prev) => ({
          ...prev,
          resume: action.payload,
        }));
        toast.success("Resume uploaded successfully!");
        setErrors((prev) => ({ ...prev, resume: "" }));
      } else {
        toast.error("Resume upload failed: " + action.payload);
      }
    } catch (error) {
      toast.error("Unexpected error uploading resume: " + error.message);
    }
  };

  const validateForm = () => {
    // We can call the per-field helper functions and do a full validation on submit
    const newErrors = {};

    // Email and phone (also live validated but final check here)
    let emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    let phoneError = validatePhone(form.phone);
    if (phoneError) newErrors.phone = phoneError;

    // Validate education and experience years/dates
    form.education.forEach((edu, idx) => {
      const eduErrors = validateEducationYear(edu.startYear, edu.endYear);
      if (eduErrors.startYear) newErrors[`education_startYear_${idx}`] = eduErrors.startYear;
      if (eduErrors.endYear) newErrors[`education_endYear_${idx}`] = eduErrors.endYear;
      if (eduErrors.yearOrder) newErrors[`education_yearOrder_${idx}`] = eduErrors.yearOrder;
    });

    form.experience.forEach((exp, idx) => {
      const expErrors = validateExperienceDates(exp.startDate, exp.endDate);
      if (expErrors.startDate) newErrors[`experience_startDate_${idx}`] = expErrors.startDate;
      if (expErrors.endDate) newErrors[`experience_endDate_${idx}`] = expErrors.endDate;
      if (expErrors.dateOrder) newErrors[`experience_dateOrder_${idx}`] = expErrors.dateOrder;
    });
    form.portfolioLinks.forEach((link, i) => {
      const error = validateUrl(link);
      if (error) newErrors[`portfolioLinks_${i}`] = error;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;


  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    const payload = {
      userId: form.userId,
      bio: form.bio,
      education: form.education,
      experience: form.experience,
      skills: form.skills.filter((s) => s.trim() !== ""),
      portfolioLinks: form.portfolioLinks.filter((l) => l.trim() !== ""),
      resume: form.resume.trim(),
    };

    try {
      await dispatch(createStudent(payload)).unwrap();
      setIsDirty(false);
      toast.success("Profile created successfully!");
      navigate("/student/dashboard");
      setForm(initialState);
      setErrors({});
    } catch {
      // error displayed via the error selector above the form
    }
  };

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(`/student/dashboard`)}
        className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        aria-label="Go Back"
      >
        <FaArrowLeft className="text-xs" /> Back
      </button>

      <div className="max-w-5xl mx-auto bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
        <h2 className="text-2xl font-black mb-1 text-white">Create Your Profile</h2>
        <p className="text-gray-400 text-sm mb-8">Fill in your details to set up your student profile.</p>

        {loading && <p className="text-center text-gray-400 text-sm mb-4">Processing...</p>}
        {error && <p className="text-center text-red-400 text-sm mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-1.5 text-sm font-medium text-gray-300">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block mb-1.5 text-sm font-medium text-gray-300">
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
              className={`${inputClass} resize-y`}
            />
            {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
          </div>

          {/* Education */}
          <fieldset className="border border-white/[0.08] rounded-xl p-6 space-y-6">
            <legend className="text-sm font-semibold text-gray-300 px-2">Education</legend>
            {form.education.map((edu, i) => (
              <div key={i} className="border-b border-white/[0.06] pb-6 last:border-none last:pb-0 space-y-3">
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Field Of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleArrayChange("education", i, "fieldOfStudy", e.target.value)}
                  className={inputClass}
                />
                <div className="flex space-x-4">
                  <div className="flex flex-col w-1/2">
                    <input
                      type="number"
                      placeholder="Start Year"
                      value={edu.startYear}
                      onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)}
                      className={inputClass}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    {errors[`education_startYear_${i}`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`education_startYear_${i}`]}</p>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2">
                    <input
                      type="number"
                      placeholder="End Year"
                      value={edu.endYear}
                      onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)}
                      className={inputClass}
                      min="1900"
                      max={new Date().getFullYear() + 10}
                    />
                    {errors[`education_endYear_${i}`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`education_endYear_${i}`]}</p>
                    )}
                  </div>
                </div>
                {errors[`education_yearOrder_${i}`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`education_yearOrder_${i}`]}</p>
                )}
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 text-sm underline"
                  onClick={() => {
                    if (window.confirm("Remove this education entry?")) {
                      removeItem("education", i);
                    }
                  }}
                  disabled={form.education.length === 1}
                >
                  Remove Education
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300 text-sm underline"
              onClick={() => addItem("education")}
            >
              + Add Education
            </button>
          </fieldset>

          {/* Experience */}
          <fieldset className="border border-white/[0.08] rounded-xl p-6 space-y-6">
            <legend className="text-sm font-semibold text-gray-300 px-2">Experience</legend>
            {form.experience.map((exp, i) => (
              <div key={i} className="border-b border-white/[0.06] pb-6 last:border-none last:pb-0 space-y-3">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)}
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={exp.startDate ? exp.startDate.slice(0, 10) : ""}
                      onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)}
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                    {errors[`experience_startDate_${i}`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`experience_startDate_${i}`]}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="date"
                      placeholder="End Date"
                      value={exp.endDate ? exp.endDate.slice(0, 10) : ""}
                      onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)}
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                    {errors[`experience_endDate_${i}`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`experience_endDate_${i}`]}</p>
                    )}
                  </div>
                </div>
                {errors[`experience_dateOrder_${i}`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`experience_dateOrder_${i}`]}</p>
                )}
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)}
                  className={`${inputClass} resize-y`}
                  rows={3}
                />
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 text-sm underline"
                  onClick={() => {
                    if (window.confirm("Remove this experience entry?")) {
                      removeItem("experience", i);
                    }
                  }}
                  disabled={form.experience.length === 1}
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300 text-sm underline"
              onClick={() => addItem("experience")}
            >
              + Add Experience
            </button>
          </fieldset>

          {/* Skills */}
          <fieldset className="border border-white/[0.08] rounded-xl p-6 space-y-4">
            <legend className="text-sm font-semibold text-gray-300 px-2">Skills</legend>
            {form.skills.map((skill, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) => handleArrayChange("skills", i, null, e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 text-sm underline"
                  onClick={() => removeItem("skills", i)}
                  disabled={form.skills.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300 text-sm underline"
              onClick={() => addItem("skills")}
            >
              + Add Skill
            </button>
          </fieldset>

          <fieldset className="border border-white/[0.08] rounded-xl p-6 space-y-4">
  <legend className="text-sm font-semibold text-gray-300 px-2">Portfolio Links</legend>
  {form.portfolioLinks.map((link, i) => (
    <div key={i} className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="url"
          placeholder="https://example.com"
          value={link}
          onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)}
          className={`w-full p-3 rounded-xl border bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition text-sm ${
            errors[`portfolioLinks_${i}`] ? "border-red-500/50 focus:ring-red-500/40" : "border-white/10 focus:ring-indigo-500/50"
          }`}
        />
        <button
          type="button"
          className="text-red-400 hover:text-red-300 text-sm underline"
          onClick={() => removeItem("portfolioLinks", i)}
          disabled={form.portfolioLinks.length === 1}
        >
          Remove
        </button>
      </div>
      {errors[`portfolioLinks_${i}`] && (
        <p className="text-red-600 text-sm ml-1">{errors[`portfolioLinks_${i}`]}</p>
      )}
    </div>
  ))}
  <button
    type="button"
    className="text-indigo-400 hover:text-indigo-300 text-sm underline"
    onClick={() => addItem("portfolioLinks")}
  >
    + Add Link
  </button>
</fieldset>




          {/* Resume Upload */}
          <div>
            <label htmlFor="resumeFile" className="block mb-1.5 text-sm font-medium text-gray-300">
              Upload Resume (PDF, DOC, DOCX)
            </label>
            <input
              id="resumeFile"
              name="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleResumeUpload(e.target.files[0])}
              className="w-full p-2 rounded-xl border border-white/10 bg-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />
            {form.resume && (
              <a
                href={form.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-indigo-400 hover:text-indigo-300 underline text-sm"
              >
                View uploaded resume
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-900/40"
          >
            {loading ? "Creating..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
