import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect } from "react";

const JobsByDriveAndCompany = () => {
  const { driveId, companyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const error = useSelector(selectJobsError);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Filter jobs to those matching both driveId and companyId
  const filteredJobs = jobs.filter((job) => {
    const jobDriveId = job.placementDrive?._id || job.placementDrive;
    const jobCompanyId = typeof job.company === "string" ? job.company : job.company?._id;
    return jobDriveId === driveId && jobCompanyId === companyId;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/student/applyJob/${driveId}`)}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          &larr; Back
        </button>

        <h1 className="text-2xl font-black mb-8 text-white">
          Jobs Posted by Company in Placement Drive
        </h1>

        {loading && <p className="text-center text-gray-400 text-sm">Loading jobs...</p>}
        {error && <p className="text-center text-red-400 text-sm">Error: {error}</p>}

        {!loading && !error && filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No jobs found for this company in this placement drive.
          </p>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <ul className="space-y-4">
            {filteredJobs.map((job) => (
              <Link
                to={`/student/applyJob/${driveId}/${companyId}/${job._id}`}
                key={job._id}
                className="block focus:outline-none focus:ring-2 focus:ring-indigo-500/40 rounded-xl"
              >
                <li className="p-6 bg-[#1e293b] border border-white/[0.08] rounded-xl hover:bg-[#243347] hover:border-white/[0.14] transition cursor-pointer">
                  <h2 className="text-base font-semibold text-white mb-2">{job.title}</h2>
                  {job.description && <p className="mb-3 text-gray-400 text-sm">{job.description}</p>}
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Location:</span> <span className="text-gray-300">{job.location || "Not specified"}</span></p>
                    <p><span className="text-gray-500">Salary:</span> <span className="text-gray-300">{job.salary || "Not specified"}</span></p>
                    <p><span className="text-gray-500">Skills:</span> <span className="text-gray-300">{job.skillsRequired?.join(", ") || "Not specified"}</span></p>
                    <p><span className="text-gray-500">Deadline:</span> <span className="text-gray-300">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Not specified"}</span></p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobsByDriveAndCompany;
