import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../slices/authSlice";
import { createStudent, selectStudentLoading, selectStudentError } from "../../slices/studentSlice";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);

  const initialState =    {
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
        endYear: ""
      }
    ],
    experience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: ""
      }
    ],
    skills: [""],
    portfolioLinks: [""],
    resume: "",
  }

  const [form, setForm] = useState(
    initialState
 );

  // Initialize form fields from logged-in user on mount
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data, filtering out empty strings in arrays
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>

      {loading && <p className="text-center text-gray-600">Processing...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1 font-semibold">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label htmlFor="bio" className="block mb-1 font-semibold">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
            maxLength={500}
            placeholder="Write a short bio (max 500 characters)"
          />
        </div>

        {/* Education */}
        <fieldset className="border p-4 rounded mb-6">
          <legend className="font-semibold mb-2">Education</legend>
          {form.education.map((edu, i) => (
            <div key={i} className="mb-4 border-b pb-4">
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Field Of Study"
                value={edu.fieldOfStudy}
                onChange={(e) => handleArrayChange("education", i, "fieldOfStudy", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="number"
                placeholder="Start Year"
                value={edu.startYear}
                onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)}
                className="w-full p-2 border rounded mb-2"
                min="1900"
                max={new Date().getFullYear()}
              />
              <input
                type="number"
                placeholder="End Year"
                value={edu.endYear}
                onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)}
                className="w-full p-2 border rounded mb-2"
                min="1900"
                max={new Date().getFullYear() + 10}
              />
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
        <fieldset className="border p-4 rounded mb-6">
          <legend className="font-semibold mb-2">Experience</legend>
          {form.experience.map((exp, i) => (
            <div key={i} className="mb-4 border-b pb-4">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={exp.startDate ? exp.startDate.slice(0, 10) : ""}
                onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                placeholder="End Date"
                value={exp.endDate ? exp.endDate.slice(0, 10) : ""}
                onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)}
                className="w-full p-2 border rounded mb-2"
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
        <fieldset className="border p-4 rounded mb-6">
          <legend className="font-semibold mb-2">Skills</legend>
          {form.skills.map((skill, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Skill"
                value={skill}
                onChange={(e) => handleArrayChange("skills", i, null, e.target.value)}
                className="w-full p-2 border rounded"
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
        <fieldset className="border p-4 rounded mb-6">
          <legend className="font-semibold mb-2">Portfolio Links</legend>
          {form.portfolioLinks.map((link, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)}
                className="w-full p-2 border rounded"
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

        {/* Resume URL */}
        <div className="mb-6">
          <label htmlFor="resume" className="block mb-1 font-semibold">Resume URL</label>
          <input
            id="resume"
            name="resume"
            type="url"
            value={form.resume}
            onChange={handleChange}
            placeholder="Enter link to your resume"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;

