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

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-400">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-400">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth={2} />
  </svg>
);

const stats = (jobsPosted, applicationsReceived, upcomingInterviews) => [
  {
    label: 'Jobs Posted',
    count: jobsPosted,
    Icon: BriefcaseIcon,
    iconBg: 'bg-blue-500/10',
    ring: 'hover:ring-blue-500/20',
    navigateTo: '/company/companyJobs',
  },
  {
    label: 'Applications Received',
    count: applicationsReceived,
    Icon: ClipboardIcon,
    iconBg: 'bg-green-500/10',
    ring: 'hover:ring-green-500/20',
    navigateTo: '/company/applications',
  },
  {
    label: 'Upcoming Interviews',
    count: upcomingInterviews,
    Icon: CalendarIcon,
    iconBg: 'bg-yellow-500/10',
    ring: 'hover:ring-yellow-500/20',
    navigateTo: '/company/interview',
  },
];

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 font-medium">Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Company Dashboard</h1>
          <p className="text-gray-400 text-sm">Overview of your recruitment activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats(jobsPosted, applicationsReceived, upcomingInterviews).map(
            ({ label, count, Icon, iconBg, ring, navigateTo }) => (
              <button
                key={label}
                onClick={() => navigate(navigateTo)}
                type="button"
                aria-label={`Navigate to ${label}`}
                className={`bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6 text-left transition-all hover:bg-[#243347] hover:-translate-y-0.5 hover:ring-2 ${ring} focus:outline-none focus:ring-2 focus:ring-indigo-500/40 group`}
              >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon />
                </div>
                <p className="text-4xl font-black text-white mb-1 tabular-nums">{count ?? 0}</p>
                <p className="text-sm font-medium text-gray-400 group-hover:text-indigo-400 transition-colors">
                  {label}
                </p>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
