import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate} from "react-router";
import { deleteJob, fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect } from "react";
import { selectAuthUser } from "../../slices/authSlice";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";

const CompanyJobsList = () => {
    const currentUser = useSelector(selectAuthUser);
    const company = useSelector(selectAllCompanies)
    
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);

  // console.log("User:", currentUser);
  // const companyId = currentUser.companyId;
  // console.log("Jobs:", jobs);
// console.log("Company ID:", companyId);
const companyIdFromUser = company.filter(c => c.user===currentUser._id)[0]?._id;
// console.log("Company ID from User:", companyIdFromUser);
// console.log("company:", company.filter(c => c.user===currentUser._id));


useEffect(() => {
  dispatch(fetchJobs());
  dispatch(fetchCompanies());
}, [dispatch]);

const filteredJobs = jobs.filter((job) => {
  return  job.company  === companyIdFromUser;
});
// console.log("Filtered Jobs:", filteredJobs);

  // Handle delete job
  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(jobId));
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/companydashboard")}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white transition"
        >
          &larr; Back
        </button>

        <h1 className="text-2xl font-black mb-8 text-white">Jobs Posted by This Company</h1>

        {loading && <p className="text-center text-gray-400 text-sm">Loading jobs...</p>}
        {error && <p className="text-center text-red-400 text-sm">Error: {error}</p>}

        {!loading && !error && filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No jobs found for this company.</p>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <ul className="space-y-4">
            {filteredJobs.map((job) => (
              <li key={job._id} className="p-6 bg-[#1e293b] border border-white/[0.08] rounded-xl hover:bg-[#243347] transition">
                <h2 className="text-base font-semibold text-white mb-2">{job.title}</h2>
                {job.description && <p className="mb-3 text-gray-400 text-sm">{job.description}</p>}
                <div className="space-y-1 text-sm mb-4">
                  <p><span className="text-gray-500">Location:</span> <span className="text-gray-300">{job.location || "Not specified"}</span></p>
                  <p><span className="text-gray-500">Salary:</span> <span className="text-gray-300">{job.salary || "Not specified"}</span></p>
                  <p><span className="text-gray-500">Skills:</span> <span className="text-gray-300">{job.skillsRequired?.join(", ") || "Not specified"}</span></p>
                  <p><span className="text-gray-500">Deadline:</span> <span className="text-gray-300">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Not specified"}</span></p>
                </div>
                <div className="flex gap-3">
                  <Link to={`/company/editJob/${job._id}`} className="px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition">Edit</Link>
                  <button onClick={() => handleDelete(job._id)} className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompanyJobsList;
