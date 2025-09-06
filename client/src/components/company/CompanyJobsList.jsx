import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate} from "react-router";
import { deleteJob, fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect } from "react";
import { selectAuthUser } from "../../slices/authSlice";

const CompanyJobsList = () => {
    const user = useSelector(selectAuthUser);
    
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);

  console.log("User:", user);
  const companyId = user.companyId;
  console.log("Jobs:", jobs);
// console.log("Company ID:", companyId);


useEffect(() => {
  dispatch(fetchJobs());
}, [dispatch]);

const filteredJobs = jobs.filter((job) => {
  return  job.company  === companyId;
});
console.log("Filtered Jobs:", filteredJobs);

  // Handle delete job
  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(jobId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/companydashboard")}
        className="mb-6 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
        Jobs Posted by This Company
      </h1>

      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {!loading && !error && filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No jobs found for this company.
        </p>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <ul className="space-y-6">
          {filteredJobs.map((job) => (
            <li
              key={job._id}
              className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">{job.title}</h2>
              {job.description && <p className="mb-4 text-gray-700">{job.description}</p>}
              <p className="mb-1">
                <strong>Location:</strong>{" "}
                <span className="text-gray-800">{job.location || "Not specified"}</span>
              </p>
              <p className="mb-1">
                <strong>Salary:</strong>{" "}
                <span className="text-gray-800">{job.salary || "Not specified"}</span>
              </p>
              <p className="mb-1">
                <strong>Skills Required:</strong>{" "}
                <span className="text-gray-800">
                  {job.skillsRequired?.join(", ") || "Not specified"}
                </span>
              </p>
              <p>
                <strong>Application Deadline:</strong>{" "}
                <span className="text-gray-800">
                  {job.applicationDeadline
                    ? new Date(job.applicationDeadline).toLocaleDateString()
                    : "Not specified"}
                </span>
              </p>
              <div className="mt-4 flex gap-4">
                <Link
                  to={`/company/editJob/${job._id}`}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyJobsList;
