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
    <div className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-6 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
        Jobs Posted by Company in Placement Drive
      </h1>

      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {!loading && !error && filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No jobs found for this company in this placement drive.
        </p>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <ul className="space-y-6">
          {filteredJobs.map((job) => (
            <Link
              to={`/student/applyJob/${driveId}/${companyId}/${job._id}`}
              key={job._id}
              className="block focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg"
            >
              <li className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 transition cursor-pointer">
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
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobsByDriveAndCompany;
