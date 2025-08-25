import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import applicationApi from "../../api/applicationsApi";


const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Hired', value: 'Hired' },
];

const ApplicationReviewPage = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const jobsError = useSelector(selectJobsError);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ jobId: '', status: '' });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch applications based on filters
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.jobId) params.jobId = filters.jobId;
      if (filters.status) params.status = filters.status;

      const response = await applicationApi.getCompanyApplications(params);
      setApplications(response.data.data);
    } catch (err) {
      setError('Failed to fetch applications', err.message);
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Application Review</h1>

      {/* Handle job loading/error states */}
      {jobsLoading && <div>Loading jobs...</div>}
      {jobsError && <div className="text-red-600">Error loading jobs: {jobsError}</div>}

      {/* Filter controls */}
      {!jobsLoading && !jobsError && (
        <div className="flex space-x-4 mb-6">
          <select
            name="jobId"
            value={filters.jobId}
            onChange={handleFilterChange}
            className="p-2 border rounded w-1/3"
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border rounded w-1/3"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading/Error */}
      {loading && <div>Loading applications...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* Applications Table */}
      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Applicant Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Job Title</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Applied On</th>
              <th className="border border-gray-300 p-2 text-left">Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No applications found.
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{app.candidate?.name || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{app.candidate?.email || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{app.job?.title || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{app.status}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {app.resume ? (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    'No resume'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationReviewPage;
