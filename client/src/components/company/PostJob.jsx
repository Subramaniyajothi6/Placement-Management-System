import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearJobError, createJob, resetJobState } from "../../slices/jobSlice";


const PostJob = () => {
  const dispatch = useDispatch();
  const { loading, error, isSuccess } = useSelector((state) => state.jobs);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'full-time',
    applicationDeadline: '',
  });

  useEffect(() => {
    if (isSuccess) {
      alert('Job posted successfully!');
      dispatch(resetJobState());
      setFormData({
        title: '',
        description: '',
        location: '',
        jobType: 'full-time',
        applicationDeadline: '',
      });
    }

    return () => {
      dispatch(clearJobError());
    };
  }, [isSuccess, dispatch]);

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
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

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
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
