import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  clearJobError,
  createJob,
  resetJobState,
  selectJobsError,
  selectJobsLoading,
  selectJobsSuccess,
} from "../../slices/jobSlice";

const PostJob = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
  const isSuccess = useSelector(selectJobsSuccess);


  const { placementDriveId } = useParams();

  const [formData, setFormData] = useState({
    placementDrive: "",
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
    }));
  }, [placementDriveId]);



  useEffect(() => {
    if (isSuccess) {
      alert("Job posted successfully!");
      dispatch(resetJobState());
      setFormData({
        placementDrive: placementDriveId || "",
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
  }, [isSuccess, dispatch, placementDriveId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skillsRequired") {
      const skillsArray = value.split(",").map((skill) => skill.trim());
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

    // Optional front-end validation
    if (!formData.title || !formData.placementDrive ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      if (isNaN(deadline.getTime())) {
        alert("Please enter a valid application deadline date.");
        return;
      }
    }

    dispatch(createJob(formData));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">
        {placementDriveId ? "Post a New Job for Drive" : "Post a New Job"}
      </h2>

      {error && <p className="text-red-600 mb-4">{Array.isArray(error) ? error.join(", ") : error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Salary</label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="e.g., ₹25,000 - ₹35,000"
        />

        <label className="block mb-2 font-semibold">Skills Required (comma separated)</label>
        <input
          type="text"
          name="skillsRequired"
          value={formData.skillsRequired.join(", ")}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="React, JavaScript, CSS etc."
        />

        <label className="block mb-2 font-semibold">Openings</label>
        <input
          type="number"
          name="openings"
          min="1"
          value={formData.openings}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Application Deadline</label>
        <input
          type="date"
          name="applicationDeadline"
          value={formData.applicationDeadline}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
