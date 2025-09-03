import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import {
  clearSelectedStudent,
  fetchStudents,
  selectStudentError,
  selectStudentLoading,
  selectStudents,
  updateStudent,
} from "../slices/studentSlice";

const ViewProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);

  // Fetch all students on mount
  useEffect(() => {
    dispatch(fetchStudents());
    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch]);

  // Find this user's student profile when data changes
  useEffect(() => {
    if (students && user?._id) {
      const student = students.find(
        (stu) => String(stu.userId) === String(user._id)
      );
      setForm(
        student
          ? {
              ...student,
              bio: student.bio || "",
              education: student.education?.length
                ? student.education
                : [
                    {
                      institution: "",
                      degree: "",
                      fieldOfStudy: "",
                      startYear: "",
                      endYear: "",
                    },
                  ],
              experience: student.experience?.length
                ? student.experience
                : [
                    {
                      company: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ],
              skills: student.skills?.length ? student.skills : [""],
              portfolioLinks: student.portfolioLinks?.length
                ? student.portfolioLinks
                : [""],
              resume: student.resume || "",
            }
          : null
      );
    }
  }, [students, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, idx, key, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      if (key) {
        arr[idx] = { ...arr[idx], [key]: value };
      } else {
        arr[idx] = value;
      }
      return { ...prev, [field]: arr };
    });
  };

  const addItem = (field) => {
    setForm((prev) => {
      let item;
      switch (field) {
        case "education":
          item = {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startYear: "",
            endYear: "",
          };
          break;
        case "experience":
          item = {
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            description: "",
          };
          break;
        case "skills":
        case "portfolioLinks":
          item = "";
          break;
        default:
          item = "";
      }
      return { ...prev, [field]: [...prev[field], item] };
    });
  };

  const removeItem = (field, idx) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form) return;
    const payload = {
      bio: form.bio,
      education: form.education,
      experience: form.experience,
      skills: form.skills.filter((s) => s.trim() !== ""),
      portfolioLinks: form.portfolioLinks.filter((l) => l.trim() !== ""),
      resume: form.resume?.trim() || "",
    };
    dispatch(updateStudent({ id: form._id, data: payload }));
    setEditMode(false);
    alert("Profile updated successfully!");
  };

  if (loading || !form) {
    return <p className="text-center py-8 text-lg text-gray-600">Loading your profile…</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!form) {
    return (
      <div className="max-w-lg mx-auto p-8 bg-white text-center shadow rounded">
        <h2 className="text-xl mb-4 font-bold">No Profile Found</h2>
        <p>
          Your student profile hasn&apos;t been created yet. Please contact your admin or use the profile creation page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="flex justify-end">
        {!editMode && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email (read-only) */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 font-semibold">Bio</label>
          {editMode ? (
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
              maxLength={500}
              placeholder="Write a short bio (max 500 characters)"
            />
          ) : (
            <div className="bg-gray-50 rounded p-3 text-gray-700">{form.bio || "No bio provided."}</div>
          )}
        </div>

        {/* Education */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Education</legend>
          {form.education.map((edu, i) => (
            <div key={i} className="mb-4 border-b pb-4">
              {editMode ? (
                <>
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
                  />
                  <input
                    type="number"
                    placeholder="End Year"
                    value={edu.endYear}
                    onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    type="button"
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => removeItem("education", i)}
                    disabled={form.education.length === 1}
                  >
                    Remove Education
                  </button>
                </>
              ) : (
                <div className="mb-2">
                  <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div>{edu.institution} ({edu.startYear} - {edu.endYear})</div>
                </div>
              )}
            </div>
          ))}
          {editMode && (
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => addItem("education")}
            >
              + Add Education
            </button>
          )}
        </fieldset>

        {/* Experience */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Experience</legend>
          {form.experience.map((exp, i) => (
            <div key={i} className="mb-4 border-b pb-4">
              {editMode ? (
                <>
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
                    value={exp.startDate ? exp.startDate.slice(0, 10) : ""}
                    onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="date"
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
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => removeItem("experience", i)}
                    disabled={form.experience.length === 1}
                  >
                    Remove Experience
                  </button>
                </>
              ) : (
                <div className="mb-2">
                  <div className="font-semibold">{exp.role} at {exp.company}</div>
                  <div>
                    {exp.startDate?.slice(0, 10)} to {exp.endDate?.slice(0, 10)}
                  </div>
                  <div className="text-gray-600">{exp.description}</div>
                </div>
              )}
            </div>
          ))}
          {editMode && (
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => addItem("experience")}
            >
              + Add Experience
            </button>
          )}
        </fieldset>

        {/* Skills */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Skills</legend>
          {form.skills.map((skill, i) =>
            editMode ? (
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
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => removeItem("skills", i)}
                  disabled={form.skills.length === 1}
                >
                  Remove
                </button>
              </div>
            ) : (
              <span
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2"
                key={i}
              >{skill}</span>
            )
          )}
          {editMode && (
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => addItem("skills")}
            >
              + Add Skill
            </button>
          )}
        </fieldset>

        {/* Portfolio Links */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Portfolio Links</legend>
          {form.portfolioLinks.map((link, i) =>
            editMode ? (
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
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => removeItem("portfolioLinks", i)}
                  disabled={form.portfolioLinks.length === 1}
                >
                  Remove
                </button>
              </div>
            ) : (
              <a href={link} target="_blank" rel="noopener noreferrer" key={i} className="block text-blue-600 hover:underline">
                {link}
              </a>
            )
          )}
          {editMode && (
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => addItem("portfolioLinks")}
            >
              + Add Link
            </button>
          )}
        </fieldset>

        {/* Resume */}
        <div>
          <label className="block mb-1 font-semibold">Resume URL</label>
          {editMode ? (
            <input
              name="resume"
              type="url"
              value={form.resume}
              onChange={handleChange}
              placeholder="Enter link to your resume"
              className="w-full p-2 border rounded"
            />
          ) : form.resume ? (
            <a
              href={form.resume}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          ) : (
            <span className="text-gray-500">No resume uploaded.</span>
          )}
        </div>

        {editMode && (
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default ViewProfilePage;
