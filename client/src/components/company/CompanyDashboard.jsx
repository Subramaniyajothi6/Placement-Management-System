import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyDashboard, selectDashboardApplicationsReceived, selectDashboardError, selectDashboardErrorMessage, selectDashboardJobsPosted, selectDashboardLoading, selectDashboardUpcomingInterviews } from '../../slices/companySlice';

const CompanyDashboard = () => {
    const dispatch = useDispatch();
    const jobsPosted = useSelector(selectDashboardJobsPosted);
    const applicationsReceived = useSelector(selectDashboardApplicationsReceived);
    const upcomingInterviews = useSelector(selectDashboardUpcomingInterviews);
  const isLoading = useSelector(selectDashboardLoading);
  const isError = useSelector(selectDashboardError);
  const errorMessage = useSelector(selectDashboardErrorMessage);


  console.log(upcomingInterviews);

  useEffect(() => {
    dispatch(fetchCompanyDashboard());
  }, [dispatch]);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p>Error: {errorMessage}</p>;


  return (
    
    <>
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Company Dashboard</h2>
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-blue-100 p-6 rounded shadow text-center">
          <h3 className="text-xl mb-2">Jobs Posted</h3>
          <p className="text-4xl font-semibold">{jobsPosted}</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow text-center">
          <h3 className="text-xl mb-2">Applications Received</h3>
          <p className="text-4xl font-semibold">{applicationsReceived}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded shadow text-center">
          <h3 className="text-xl mb-2">Upcoming Interviews</h3>
          <p className="text-4xl font-semibold">{upcomingInterviews}</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default CompanyDashboard