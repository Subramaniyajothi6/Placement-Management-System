import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { selectAuthUser } from "../../slices/authSlice";
import { clearJobError, createJob, resetJobState, selectJobsError, selectJobsLoading, selectJobsSuccess } from "../../slices/jobSlice";
import toast from "react-hot-toast";

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
  const isSuccess = useSelector(selectJobsSuccess);
  const companies = useSelector(selectAllCompanies);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const userId = user?._id;
  const companyId = companies.filter((c) => c.user === userId).map((c) => c._id)[0] || "";

  const { placementDriveId } = useParams();

  const [formData, setFormData] = useState({
    placementDrive: "",
    company: "",
    title: "",
    description: "",
    location: "",
    salary: "",
    skillsRequired: [],
    openings: 1,
    applicationDeadline: "",
  });

  const [deadlineError, setDeadlineError] = useState("");
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
    setFormData((prev) => ({
      ...prev,
      placementDrive: placementDriveId || "",
      company: companyId,
    }));
  }, [placementDriveId, companyId]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetJobState());
      setFormData({
        placementDrive: placementDriveId || "",
        company: companyId,
        title: "",
        description: "",
        location: "",
        salary: "",
        skillsRequired: [],
        openings: 1,
        applicationDeadline: "",
      });
      setDeadlineError("");
    }

    return () => {
      dispatch(clearJobError());
    };
  }, [isSuccess, dispatch, placementDriveId, companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsDirty(true);

    if (name === "applicationDeadline") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setDeadlineError(""); // Reset previous errors

      if (value) {
        const deadline = new Date(value);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Compare only dates
        if (isNaN(deadline.getTime())) {
          setDeadlineError("Please enter a valid date.");
        } else if (deadline <= now) {
          setDeadlineError("Date must be in the future.");
        }
      }
      if (error) dispatch(clearJobError());
      return;
    }

    if (name === "skillsRequired") {
      const skillsArray = value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, skillsRequired: skillsArray }));
    } else if (name === "openings") {
      const num = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, openings: isNaN(num) ? 1 : num }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (error) dispatch(clearJobError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (isNaN(deadline.getTime())) {
        setDeadlineError("Please enter a valid date.");
        return;
      } else if (deadline <= now) {
        setDeadlineError("Date must be in the future.");
        return;
      }
    }
    setDeadlineError(""); // Clear previous error if valid

    if (!formData.title || !formData.placementDrive) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await dispatch(createJob(formData)).unwrap();
      setIsDirty(false);
      toast.success("Job posted successfully!");
      navigate("/company/dashboard");
    } catch {
      // error displayed via the error selector above the form
    }
  };

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-300";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          &larr; Back
        </button>

        <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8">
          <h2 className="text-2xl font-black text-white mb-1">
            {placementDriveId ? "Post a Job for Drive" : "Post a New Job"}
          </h2>
          <p className="text-gray-400 text-sm mb-8">Fill in the details below to create a job listing.</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm text-center">
                {Array.isArray(error) ? error.join(", ") : error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className={labelClass}>
                Job Title <span className="text-red-400">*</span>
              </label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required placeholder="Enter job title" className={inputClass} />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Provide a detailed job description" className={inputClass} />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>Location</label>
              <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Job location" className={inputClass} />
            </div>

            <div>
              <label htmlFor="salary" className={labelClass}>Salary</label>
              <input id="salary" name="salary" type="text" value={formData.salary} onChange={handleChange} placeholder="e.g., ₹25,000 - ₹35,000" className={inputClass} />
            </div>

            <div>
              <label htmlFor="skillsRequired" className={labelClass}>
                Skills Required <span className="text-gray-500 font-normal">(comma separated)</span>
              </label>
              <input id="skillsRequired" name="skillsRequired" type="text" value={formData.skillsRequired.join(", ")} onChange={handleChange} placeholder="React, JavaScript, CSS etc." className={inputClass} />
            </div>

            <div>
              <label htmlFor="openings" className={labelClass}>Number of Openings</label>
              <input id="openings" name="openings" type="number" min={1} value={formData.openings} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label htmlFor="applicationDeadline" className={labelClass}>Application Deadline</label>
              <input id="applicationDeadline" name="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange} className={`${inputClass} [color-scheme:dark]`} />
              {deadlineError && <span className="text-red-400 text-xs mt-1 block">{deadlineError}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40 mt-2"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
