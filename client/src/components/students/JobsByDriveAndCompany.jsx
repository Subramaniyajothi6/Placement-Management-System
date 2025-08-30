import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../../slices/jobSlice";
import { useEffect } from "react";


const JobsByDriveAndCompany = () => {
    const { driveId, companyId } = useParams();
    const dispatch = useDispatch();

    const jobs = useSelector(selectJobs);
    const loading = useSelector(selectJobsLoading);
    const error = useSelector(selectJobsError);

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    // Filter to jobs matching both driveId and companyId
    const filteredJobs = jobs.filter((job) => {
        const jobDriveId = job.placementDrive?._id || job.placementDrive;
        const jobCompanyId = typeof job.company === 'string' ? job.company : job.company?._id;
        return jobDriveId === driveId && jobCompanyId === companyId;
    });

    if (loading) return <p className="text-center mt-8">Loading jobs...</p>;
    if (error) return <p className="text-center mt-8 text-red-600">Error: {error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Jobs Posted by Company in Placement Drive
            </h2>

            {filteredJobs.length === 0 ? (
                <p className="text-center text-gray-500">No jobs found for this company in this placement drive.</p>
            ) : (
                <ul className="space-y-6">
                    {filteredJobs.map((job) => (
                        <Link to={`/student/applyJob/${driveId}/${companyId}/${job._id}`} key={job._id}>           
                        <li key={job._id} className="p-4 border rounded bg-gray-50">
                            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                            {job.description && <p className="mb-2">{job.description}</p>}
                            <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                            <p><strong>Salary:</strong> {job.salary || 'Not specified'}</p>
                            <p><strong>Skills Required:</strong> {job.skillsRequired?.join(', ') || 'Not specified'}</p>
                            <p>
                                <strong>Application Deadline:</strong>{' '}
                                {job.applicationDeadline
                                    ? new Date(job.applicationDeadline).toLocaleDateString()
                                    : 'Not specified'}
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
