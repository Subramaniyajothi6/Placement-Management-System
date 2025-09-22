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
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const ViewProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);
  const navigate = useNavigate();

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
    toast.success("Profile updated successfully!");
  };

  if (loading || !form) {
    return (
      <p className="text-center py-8 text-lg text-gray-700 font-medium">
        Loading your profile…
      </p>
    );
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
    <div className="min-h-screen bg-indigo-50 " >


      <div className="p-6 max-w-7xl mx-auto ">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mb-6 px-5 py-2  rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          &larr; Back
        </button>
        <div className="container mx-auto p-8 bg-white rounded-lg shadow space-y-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
            My Profile
          </h2>
          <div className="flex justify-end">
            {!editMode && (
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow-md"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email (read-only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-800">Name</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full p-3 border rounded bg-gray-300 text-gray-900 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-800">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full p-3 border rounded bg-gray-300 text-gray-900 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Bio</label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border rounded resize-y focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                  maxLength={500}
                  placeholder="Write a short bio (max 500 characters)"
                />
              ) : (
                <div className="bg-gray-200 rounded p-4 text-gray-900 min-h-[100px]">
                  {form.bio || "No bio provided."}
                </div>
              )}
            </div>

            {/* Education */}
            <fieldset className="border border-gray-300 p-6 rounded space-y-6">
              <legend className="font-semibold text-lg mb-4 text-gray-800">Education</legend>
              {form.education.map((edu, i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 pb-4 last:border-none last:pb-0"
                >
                  {editMode ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) =>
                          handleArrayChange("education", i, "institution", e.target.value)
                        }
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      />
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          handleArrayChange("education", i, "degree", e.target.value)
                        }
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      />
                      <input
                        type="text"
                        placeholder="Field Of Study"
                        value={edu.fieldOfStudy}
                        onChange={(e) =>
                          handleArrayChange("education", i, "fieldOfStudy", e.target.value)
                        }
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      />
                      <div className="flex space-x-4">
                        <input
                          type="number"
                          placeholder="Start Year"
                          value={edu.startYear}
                          onChange={(e) =>
                            handleArrayChange("education", i, "startYear", e.target.value)
                          }
                          className="w-1/2 p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        />
                        <input
                          type="number"
                          placeholder="End Year"
                          value={edu.endYear}
                          onChange={(e) =>
                            handleArrayChange("education", i, "endYear", e.target.value)
                          }
                          className="w-1/2 p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        />
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:underline text-sm self-start mt-1"
                        onClick={() => removeItem("education", i)}
                        disabled={form.education.length === 1}
                      >
                        Remove Education
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-indigo-700 font-semibold text-lg">
                        {edu.degree}
                        {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                      </div>
                      <div className="text-gray-900 font-medium">{edu.institution}</div>
                      <div className="text-gray-700">
                        {edu.startYear} &#8211; {edu.endYear}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  type="button"
                  className="text-indigo-600 hover:underline text-sm"
                  onClick={() => addItem("education")}
                >
                  + Add Education
                </button>
              )}
            </fieldset>

            {/* Experience */}
            <fieldset className="border border-gray-300 p-6 rounded space-y-6">
              <legend className="font-semibold text-lg mb-4 text-gray-800">Experience</legend>
              {form.experience.map((exp, i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 pb-4 last:border-none last:pb-0"
                >
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)}
                        className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)}
                        className="w-full p-3 border rounded mb-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      />
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <input
                          type="date"
                          value={exp.startDate ? exp.startDate.slice(0, 10) : ""}
                          onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)}
                          className="p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        />
                        <input
                          type="date"
                          value={exp.endDate ? exp.endDate.slice(0, 10) : ""}
                          onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)}
                          className="p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)}
                        className="w-full p-3 border rounded resize-y focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-2"
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
                    <div className="space-y-1">
                      <div className="font-semibold text-indigo-700">
                        {exp.role} at {exp.company}
                      </div>
                      <div className="text-gray-700">
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
                  className="text-indigo-600 hover:underline text-sm"
                  onClick={() => addItem("experience")}
                >
                  + Add Experience
                </button>
              )}
            </fieldset>

            {/* Skills */}
            <fieldset className="border border-gray-300 p-6 rounded space-y-4">
              <legend className="font-semibold text-lg mb-4 text-gray-800">Skills</legend>
              <div className="flex flex-wrap gap-3">
                {form.skills.map((skill, i) =>
                  editMode ? (
                    <div key={i} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Skill"
                        value={skill}
                        onChange={(e) => handleArrayChange("skills", i, null, e.target.value)}
                        className="p-2 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
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
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                      key={i}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
              {editMode && (
                <button
                  type="button"
                  className="text-indigo-600 hover:underline text-sm mt-2"
                  onClick={() => addItem("skills")}
                >
                  + Add Skill
                </button>
              )}
            </fieldset>

            {/* Portfolio Links */}
            <fieldset className="border border-gray-300 p-6 rounded space-y-4">
              <legend className="font-semibold text-lg mb-4 text-gray-800">Portfolio Links</legend>
              <div className="space-y-2">
                {form.portfolioLinks.map((link, i) =>
                  editMode ? (
                    <div key={i} className="flex items-center space-x-2">
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={link}
                        onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
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
                    <a href={link} target="_blank" rel="noopener noreferrer" key={i} className="block text-indigo-600 hover:underline">
                      {link}
                    </a>
                  )
                )}
              </div>
              {editMode && (
                <button
                  type="button"
                  className="text-indigo-600 hover:underline text-sm mt-2"
                  onClick={() => addItem("portfolioLinks")}
                >
                  + Add Link
                </button>
              )}
            </fieldset>

            {/* Resume */}
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Resume URL</label>
              {editMode ? (
                <input
                  name="resume"
                  type="url"
                  value={form.resume}
                  onChange={handleChange}
                  placeholder="Enter link to your resume"
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                />
              ) : form.resume ? (
                <a
                  href={form.resume}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              ) : (
                <span className="text-gray-500">No resume uploaded.</span>
              )}
            </div>

            {/* Save Button */}
            {editMode && (
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow"
                disabled={loading}
              >
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
