import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { useEffect, useState } from "react";
import applicationApi from "../../api/applicationsApi";

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
    navigate("/companyDashboard");
  };

  const selectClass = "p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm w-full sm:w-1/3 [&>option]:bg-[#1e293b] [&>option]:text-white";

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
          aria-label="Go back"
        >
          &larr; Back
        </button>

        <h1 className="text-2xl font-black mb-6 text-white">Application Review</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select name="jobId" value={filters.jobId} onChange={handleFilterChange} className={selectClass} aria-label="Filter by Job">
            <option value="">All Jobs</option>
            {filteredJobs.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange} className={selectClass} aria-label="Filter by Status">
            {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {jobsLoading && <p className="text-center text-gray-400 text-sm py-10">Loading jobs...</p>}
        {jobsError && <p className="text-center text-red-400 text-sm py-10">{jobsError}</p>}
        {loading && <p className="text-center text-gray-400 text-sm py-10">Loading applications...</p>}
        {error && <p className="text-center text-red-400 text-sm py-10">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="min-w-full divide-y divide-white/[0.06]">
              <thead className="bg-[#1e293b]">
                <tr>
                  {["Applicant Name","Email","Job Title","Status","Applied On","Resume"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {applications.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-500 text-sm">No applications found.</td></tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-white/[0.04] cursor-pointer transition"
                      onClick={() => navigate(`/company/applications/${app._id}`)}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(`/company/applications/${app._id}`); }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-200 text-sm">{app.candidate?.name || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">{app.candidate?.email || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">{app.job?.title || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-200 text-sm font-semibold">{app.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {app.resume ? (
                          <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline" onClick={(e) => e.stopPropagation()}>View Resume</a>
                        ) : <span className="text-gray-600">No resume</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationReviewPage;
