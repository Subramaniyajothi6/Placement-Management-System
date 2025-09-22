import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchJobById, resetJobState, selectJobsError, selectJobsLoading, selectSelectedJob, updateJob } from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditJob = () => {
  const {id:jobId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select job data and loading/error states from Redux
  const job = useSelector(selectSelectedJob);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);
 
  // Local form state for controlled inputs
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skillsRequired: [],
    applicationDeadline: "",
  });

  
  useEffect(() => {
    dispatch(fetchJobById(jobId));
    
    return () => dispatch(resetJobState());
  }, [dispatch, jobId]);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        salary: job.salary || "",
        skillsRequired: job.skillsRequired || [],
        applicationDeadline: job.applicationDeadline
          ? job.applicationDeadline.slice(0, 10)
          : "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    setForm((prev) => ({
      ...prev,
      skillsRequired: e.target.value.split(",").map((skill) => skill.trim()),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateJob({ id: jobId, data: form })).then((res) => {
      if (!res.error) {
        toast.success("Job updated successfully!");
        navigate("/company/companyJobs"); 
      }
    });
  };

  const handleCancel = () => {
    navigate("/company/companyJobs");
  };

  if (loading) return <p className="text-center text-gray-600">Loading job...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block mb-1 font-semibold">Salary</label>
          <input
            type="text"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Skills Required */}
        <div>
          <label className="block mb-1 font-semibold">Skills Required (comma separated)</label>
          <input
            type="text"
            name="skillsRequired"
            value={form.skillsRequired.join(", ")}
            onChange={handleSkillsChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Application Deadline */}
        <div>
          <label className="block mb-1 font-semibold">Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            disabled={loading}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
