import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../slices/authSlice";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { clearJobError, createJob, resetJobState, selectJobsError, selectJobsLoading, selectJobsSuccess } from "../../slices/jobSlice";


const PostJob = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
  const isSuccess = useSelector(selectJobsSuccess);

  const { _id: companyIdFromUser } = useSelector(selectAuthUser);
  const { placementDriveId } = useParams(); 

  const [formData, setFormData] = useState({
    placementDrive: "",
    company: "",
    title: "",
    description: "",
    location: "",
    jobType: "full-time",
    applicationDeadline: "",
  });

  useEffect(() => {
    // When placementDriveId or companyIdFromUser changes, update formData accordingly
    setFormData((prev) => ({
      ...prev,
      placementDrive: placementDriveId || "",
      
    }));
  }, [placementDriveId]);

  useEffect(() => {
    // When companyIdFromUser changes, update formData accordingly
    setFormData((prev) => ({
      ...prev,
      company: companyIdFromUser || "",
    }));
  }, [companyIdFromUser]);

  useEffect(() => {
    if (isSuccess) {
      alert("Job posted successfully!");
      dispatch(resetJobState());
      setFormData({
        placementDrive: placementDriveId || "",
        company: companyIdFromUser || "",
        title: "",
        description: "",
        location: "",
        jobType: "full-time",
        applicationDeadline: "",
      });
    }

    return () => {
      dispatch(clearJobError());
    };
  }, [isSuccess, dispatch, placementDriveId, companyIdFromUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) dispatch(clearJobError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createJob(formData));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">
        {placementDriveId ? "Post a New Job for Drive" : "Post a New Job"}
      </h2>

      {error && <p className="text-red-600 mb-4">{error.message}</p>}

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
          required
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

        <label className="block mb-2 font-semibold">Job Type</label>
        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="full-time">Full-time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>

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
