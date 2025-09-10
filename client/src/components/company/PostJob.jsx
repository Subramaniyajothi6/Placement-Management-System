import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { selectAuthUser } from "../../slices/authSlice";
import { clearJobError, createJob, resetJobState, selectJobsError, selectJobsLoading, selectJobsSuccess } from "../../slices/jobSlice";

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
  // console.log("companies", companies.filter((c) => c.user === userId).map((c) => c._id)[0]);
  // console.log("Company ID:", companyId);

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
    }

    return () => {
      dispatch(clearJobError());
    };
  }, [isSuccess, dispatch, placementDriveId, companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.title || !formData.placementDrive) {
      alert("Please fill in all required fields.");
      return;
    }
    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      if (isNaN(deadline.getTime())) {
        alert("Please enter a valid date.");
        return;
      }
    }
    dispatch(createJob(formData));
    alert("Job posted successfully!");
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200 mt-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
      >
        &larr; Back
      </button>

      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
        {placementDriveId ? "Post a New Job for Drive" : "Post a New Job"}
      </h2>

      {error && (
        <p className="mb-6 text-center text-red-600 font-semibold">
          {Array.isArray(error) ? error.join(", ") : error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block mb-1 font-semibold text-gray-800">
            Job Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter job title"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-semibold text-gray-800">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Provide a detailed job description"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          ></textarea>
        </div>

        <div>
          <label htmlFor="location" className="block mb-1 font-semibold text-gray-800">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Job location"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="salary" className="block mb-1 font-semibold text-gray-800">
            Salary
          </label>
          <input
            id="salary"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., ₹25,000 - ₹35,000"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="skillsRequired" className="block mb-1 font-semibold text-gray-800">
            Skills Required <span className="text-gray-500 font-normal">(comma separated)</span>
          </label>
          <input
            id="skillsRequired"
            name="skillsRequired"
            type="text"
            value={formData.skillsRequired.join(", ")}
            onChange={handleChange}
            placeholder="React, JavaScript, CSS etc."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="openings" className="block mb-1 font-semibold text-gray-800">
            Number of Openings
          </label>
          <input
            id="openings"
            name="openings"
            type="number"
            min={1}
            value={formData.openings}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="applicationDeadline" className="block mb-1 font-semibold text-gray-800">
            Application Deadline
          </label>
          <input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white transition ${
            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } shadow`}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
