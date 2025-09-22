import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompanyDashboard,
  selectDashboardApplicationsReceived,
  selectDashboardError,
  selectDashboardErrorMessage,
  selectDashboardJobsPosted,
  selectDashboardLoading,
  selectDashboardUpcomingInterviews,
} from '../../slices/companySlice';
import { useNavigate } from 'react-router';

const CompanyDashboard = () => {
  const dispatch = useDispatch();
  const jobsPosted = useSelector(selectDashboardJobsPosted);
  const applicationsReceived = useSelector(selectDashboardApplicationsReceived);
  const upcomingInterviews = useSelector(selectDashboardUpcomingInterviews);
  const isLoading = useSelector(selectDashboardLoading);
  const isError = useSelector(selectDashboardError);
  const errorMessage = useSelector(selectDashboardErrorMessage);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCompanyDashboard());
  }, [dispatch]);

  if (isLoading)
    return (
      <p className="text-center py-12 text-lg text-gray-600">Loading dashboard...</p>
    );

  if (isError)
    return (
      <p className="text-center py-12 text-red-600 font-semibold">
        Error: {errorMessage}
      </p>
    );

  const stats = [
    {
      label: 'Jobs Posted',
      count: jobsPosted,
      bgColor: 'bg-blue-100',
      hoverBgColor: 'hover:bg-blue-200',
      navigateTo: '/company/companyJobs',
    },
    {
      label: 'Applications Received',
      count: applicationsReceived,
      bgColor: 'bg-green-100',
      hoverBgColor: 'hover:bg-green-200',
      navigateTo: '/company/applications',
    },
    {
      label: 'Upcoming Interviews',
      count: upcomingInterviews,
      bgColor: 'bg-yellow-100',
      hoverBgColor: 'hover:bg-yellow-200',
      navigateTo: '/company/interview',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 rounded bg-indigo-300 text-indigo-900 font-semibold hover:bg-gray-300 transition"
      >
        &larr; Back
      </button>

      <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700">
        Company Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map(({ label, count, bgColor, hoverBgColor, navigateTo }) => (
          <button
            key={label}
            onClick={() => navigate(navigateTo)}
            className={`${bgColor} ${hoverBgColor} p-8 rounded-xl shadow-md text-center transition transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-400`}
            aria-label={`Navigate to ${label}`}
            type="button"
          >
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">{label}</h3>
            <p className="text-5xl font-extrabold text-indigo-700">{count}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanyDashboard;
