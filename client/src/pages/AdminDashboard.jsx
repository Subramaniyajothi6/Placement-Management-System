import { useDispatch, useSelector } from "react-redux";
import { fetchPlacementDrives, selectPlacementDrives, selectPlacementDrivesError, selectPlacementDrivesLoading } from "../slices/placementDriveSlice";
import { fetchApplications, selectAllApplications, selectApplicationError, selectApplicationLoading } from "../slices/applicationSlice";
import { fetchJobs, selectJobs, selectJobsError, selectJobsLoading } from "../slices/jobSlice";
import { fetchInterviews, selectAllInterviews, selectInterviewError, selectInterviewErrorMessage, selectInterviewLoading } from "../slices/interviewSlice";
import { useEffect } from "react";


const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Placement Drives
  const placementDrives = useSelector(selectPlacementDrives);
  const placementDrivesLoading = useSelector(selectPlacementDrivesLoading);
  const placementDrivesError = useSelector(selectPlacementDrivesError);

  // Applications
  const applications = useSelector(selectAllApplications);
  const applicationLoading = useSelector(selectApplicationLoading);
  const applicationError = useSelector(selectApplicationError);

  // Jobs
  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const jobsError = useSelector(selectJobsError);

  // Interviews
  const interviews = useSelector(selectAllInterviews);
  const interviewLoading = useSelector(selectInterviewLoading);
  const interviewError = useSelector(selectInterviewError);
  const interviewErrorMessage = useSelector(selectInterviewErrorMessage);

  useEffect(() => {
    dispatch(fetchPlacementDrives());
    dispatch(fetchApplications());
    dispatch(fetchJobs());
    dispatch(fetchInterviews());
  }, [dispatch]);

 
  // Count offers made or students placed: based on interviews with result 'Selected'
  const offersMade = interviews.filter(i => i.result === 'Selected').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {(placementDrivesLoading || applicationLoading || jobsLoading || interviewLoading) && (
        <p>Loading data...</p>
      )}
      {applicationError && <p className="text-red-600">Error: {applicationError}</p>}
      {placementDrivesError && <p className="text-red-600">Error: {placementDrivesError}</p>}
      {jobsError && <p className="text-red-600">Error: {jobsError}</p>}
      {interviewError && <p className="text-red-600">Error: {interviewErrorMessage}</p>}
    
      {(placementDrivesError || applicationError || jobsError || interviewError) && (
        <p className="text-red-600">Error loading dashboard data....</p>
      )}

      {!placementDrivesLoading && !applicationLoading && !jobsLoading && !interviewLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="bg-blue-100 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Placement Drives</h2>
            <p className="text-4xl font-bold">{placementDrives.length ?? 0}</p>
          </div>
          <div className="bg-green-100 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Applications</h2>
            <p className="text-4xl font-bold">{applications?.length ?? 0}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Jobs Posted</h2>
            <p className="text-4xl font-bold">{jobs.length ?? 0}</p>
          </div>
          <div className="bg-purple-100 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Interviews Scheduled</h2>
            <p className="text-4xl font-bold">{interviews.length ?? 0}</p>
          </div>
          <div className="bg-pink-100 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Offers Made</h2>
            <p className="text-4xl font-bold">{offersMade ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
