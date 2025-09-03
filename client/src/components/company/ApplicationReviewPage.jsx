import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  selectJobs,
  selectJobsError,
  selectJobsLoading,
} from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import applicationApi from "../../api/applicationsApi";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { useNavigate } from "react-router";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Submitted", value: "Submitted" },
  { label: "Under Review", value: "Under Review" },
  { label: "Shortlisted", value: "Shortlisted" },
  { label: "Rejected", value: "Rejected" },
  { label: "Hired", value: "Hired" },
];

const ApplicationReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const jobsError = useSelector(selectJobsError);
  const user = useSelector((state) => state.auth.user);
  const companies = useSelector(selectAllCompanies);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ jobId: "", status: "" });

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Filter companies for the current user
  const userCompanies = companies.filter((c) => c.user === user._id);
  const userCompanyIds = userCompanies.map((c) => c._id);

  // Filter jobs belonging to companies of current user
  const filteredJobs = jobs.filter((j) => userCompanyIds.includes(j.company));

  // Fetch applications based on filters
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.jobId) params.jobId = filters.jobId;
      if (filters.status) params.status = filters.status;

      const response = await applicationApi.getCompanyApplications({ params });
      setApplications(response.data.data);
    } catch (err) {
      setError("Failed to fetch applications: " + (err.message || ""));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Back button handler
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 text-indigo-600 hover:underline font-semibold focus:outline-none"
        aria-label="Go back"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Application Review
      </h1>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row sm:space-x-6 mb-6 space-y-4 sm:space-y-0">
        <select
          name="jobId"
          value={filters.jobId}
          onChange={handleFilterChange}
          className="p-3 border rounded shadow-sm w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          aria-label="Filter by Job"
        >
          <option value="">All Jobs</option>
          {filteredJobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-3 border rounded shadow-sm w-full sm:w-1/3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          aria-label="Filter by Application Status"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading/Error */}
      {jobsLoading && (
        <p className="text-center text-gray-600 py-10">Loading jobs...</p>
      )}
      {jobsError && (
        <p className="text-center text-red-600 py-10">{jobsError}</p>
      )}
      {loading && (
        <p className="text-center text-gray-700 py-10">
          Loading applications...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 py-10">{error}</p>
      )}

      {/* Applications Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">
                  Applicant Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">
                  Resume
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-600">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-indigo-50 cursor-pointer transition"
                    onClick={() => {
                      navigate(`/company/applications/${app._id}`);
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/company/applications/${app._id}`);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {app.candidate?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {app.candidate?.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {app.job?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
                      {app.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.resume ? (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Resume
                        </a>
                      ) : (
                        "No resume"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationReviewPage;
