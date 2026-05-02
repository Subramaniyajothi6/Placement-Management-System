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
import { FaArrowLeft } from "react-icons/fa";
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

  useEffect(() => {
    dispatch(fetchStudents());
    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch]);

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
              : [{ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }],
            experience: student.experience?.length
              ? student.experience
              : [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
            skills: student.skills?.length ? student.skills : [""],
            portfolioLinks: student.portfolioLinks?.length ? student.portfolioLinks : [""],
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
      if (key) arr[idx] = { ...arr[idx], [key]: value };
      else arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addItem = (field) => {
    setForm((prev) => {
      let item;
      switch (field) {
        case "education": item = { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }; break;
        case "experience": item = { company: "", role: "", startDate: "", endDate: "", description: "" }; break;
        default: item = "";
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
    return <p className="text-center py-12 text-gray-400 text-sm">Loading your profile…</p>;
  }

  if (error) {
    return <p className="text-center py-12 text-red-400 text-sm">{error}</p>;
  }

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm [color-scheme:dark]";
  const readonlyClass = "w-full p-3 rounded-xl border border-white/[0.06] bg-[#172033] text-gray-400 text-sm cursor-not-allowed";
  const viewClass = "p-3 rounded-xl bg-[#172033] border border-white/[0.06] text-gray-300 text-sm min-h-[44px]";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-2xl font-black text-white">My Profile</h2>
              <p className="text-gray-400 text-sm mt-1">Your student profile details</p>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email (read-only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-300">Name</label>
                <input type="text" value={user?.name || ""} readOnly className={readonlyClass} />
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-300">Email</label>
                <input type="email" value={user?.email || ""} readOnly className={readonlyClass} />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-300">Bio</label>
              {editMode ? (
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} maxLength={500}
                  placeholder="Write a short bio (max 500 characters)"
                  className={`${inputClass} resize-y`} />
              ) : (
                <div className={viewClass}>{form.bio || <span className="text-gray-600 italic">No bio provided.</span>}</div>
              )}
            </div>

            {/* Education */}
            <fieldset className="border border-white/[0.08] rounded-xl p-5 space-y-5">
              <legend className="text-sm font-semibold text-gray-300 px-2">Education</legend>
              {form.education.map((edu, i) => (
                <div key={i} className="border-b border-white/[0.06] pb-5 last:border-none last:pb-0 space-y-3">
                  {editMode ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)} className={inputClass} />
                        <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} className={inputClass} />
                        <input type="text" placeholder="Field Of Study" value={edu.fieldOfStudy} onChange={(e) => handleArrayChange("education", i, "fieldOfStudy", e.target.value)} className={inputClass} />
                        <div className="flex gap-3">
                          <input type="number" placeholder="Start Year" value={edu.startYear} onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)} className={inputClass} />
                          <input type="number" placeholder="End Year" value={edu.endYear} onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <button type="button" onClick={() => removeItem("education", i)} disabled={form.education.length === 1} className="text-red-400 hover:text-red-300 text-sm underline disabled:opacity-40">
                        Remove Education
                      </button>
                    </>
                  ) : (
                    <div className="text-sm space-y-0.5">
                      <p className="text-indigo-400 font-semibold">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</p>
                      <p className="text-gray-200">{edu.institution}</p>
                      <p className="text-gray-500">{edu.startYear} – {edu.endYear}</p>
                    </div>
                  )}
                </div>
              ))}
              {editMode && (
                <button type="button" onClick={() => addItem("education")} className="text-indigo-400 hover:text-indigo-300 text-sm underline">
                  + Add Education
                </button>
              )}
            </fieldset>

            {/* Experience */}
            <fieldset className="border border-white/[0.08] rounded-xl p-5 space-y-5">
              <legend className="text-sm font-semibold text-gray-300 px-2">Experience</legend>
              {form.experience.map((exp, i) => (
                <div key={i} className="border-b border-white/[0.06] pb-5 last:border-none last:pb-0 space-y-3">
                  {editMode ? (
                    <>
                      <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)} className={inputClass} />
                      <input type="text" placeholder="Role" value={exp.role} onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)} className={inputClass} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="date" value={exp.startDate ? exp.startDate.slice(0, 10) : ""} onChange={(e) => handleArrayChange("experience", i, "startDate", e.target.value)} className={inputClass} />
                        <input type="date" value={exp.endDate ? exp.endDate.slice(0, 10) : ""} onChange={(e) => handleArrayChange("experience", i, "endDate", e.target.value)} className={inputClass} />
                      </div>
                      <textarea placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)} className={`${inputClass} resize-y`} rows={3} />
                      <button type="button" onClick={() => removeItem("experience", i)} disabled={form.experience.length === 1} className="text-red-400 hover:text-red-300 text-sm underline disabled:opacity-40">
                        Remove Experience
                      </button>
                    </>
                  ) : (
                    <div className="text-sm space-y-0.5">
                      <p className="text-indigo-400 font-semibold">{exp.role} at {exp.company}</p>
                      <p className="text-gray-500">{exp.startDate?.slice(0, 10)} – {exp.endDate?.slice(0, 10)}</p>
                      {exp.description && <p className="text-gray-400">{exp.description}</p>}
                    </div>
                  )}
                </div>
              ))}
              {editMode && (
                <button type="button" onClick={() => addItem("experience")} className="text-indigo-400 hover:text-indigo-300 text-sm underline">
                  + Add Experience
                </button>
              )}
            </fieldset>

            {/* Skills */}
            <fieldset className="border border-white/[0.08] rounded-xl p-5 space-y-4">
              <legend className="text-sm font-semibold text-gray-300 px-2">Skills</legend>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill, i) =>
                  editMode ? (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" placeholder="Skill" value={skill} onChange={(e) => handleArrayChange("skills", i, null, e.target.value)} className="p-2 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition w-36" />
                      <button type="button" onClick={() => removeItem("skills", i)} disabled={form.skills.length === 1} className="text-red-400 hover:text-red-300 text-sm underline disabled:opacity-40">Remove</button>
                    </div>
                  ) : (
                    skill.trim() && (
                      <span key={i} className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                        {skill}
                      </span>
                    )
                  )
                )}
              </div>
              {editMode && (
                <button type="button" onClick={() => addItem("skills")} className="text-indigo-400 hover:text-indigo-300 text-sm underline">
                  + Add Skill
                </button>
              )}
            </fieldset>

            {/* Portfolio Links */}
            <fieldset className="border border-white/[0.08] rounded-xl p-5 space-y-3">
              <legend className="text-sm font-semibold text-gray-300 px-2">Portfolio Links</legend>
              {form.portfolioLinks.map((link, i) =>
                editMode ? (
                  <div key={i} className="flex items-center gap-2">
                    <input type="url" placeholder="https://example.com" value={link} onChange={(e) => handleArrayChange("portfolioLinks", i, null, e.target.value)} className={`${inputClass} flex-1`} />
                    <button type="button" onClick={() => removeItem("portfolioLinks", i)} disabled={form.portfolioLinks.length === 1} className="text-red-400 hover:text-red-300 text-sm underline disabled:opacity-40">Remove</button>
                  </div>
                ) : (
                  link.trim() && (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="block text-indigo-400 hover:text-indigo-300 hover:underline text-sm truncate">
                      {link}
                    </a>
                  )
                )
              )}
              {editMode && (
                <button type="button" onClick={() => addItem("portfolioLinks")} className="text-indigo-400 hover:text-indigo-300 text-sm underline">
                  + Add Link
                </button>
              )}
            </fieldset>

            {/* Resume */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-300">Resume URL</label>
              {editMode ? (
                <input name="resume" type="url" value={form.resume} onChange={handleChange} placeholder="Enter link to your resume" className={inputClass} />
              ) : form.resume ? (
                <a href={form.resume} className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm" target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              ) : (
                <span className="text-gray-600 text-sm italic">No resume uploaded.</span>
              )}
            </div>

            {editMode && (
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-900/40">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="px-6 py-3 border border-white/10 text-gray-300 rounded-xl text-sm font-semibold hover:bg-[#243347] transition">
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
