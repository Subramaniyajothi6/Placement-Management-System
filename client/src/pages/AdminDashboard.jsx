import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlacementDrives, selectPlacementDrives,
  selectPlacementDrivesError, selectPlacementDrivesLoading,
} from "../slices/placementDriveSlice";
import {
  fetchApplications, selectAllApplications,
  selectApplicationError, selectApplicationLoading,
} from "../slices/applicationSlice";
import {
  fetchJobs, selectJobs,
  selectJobsError, selectJobsLoading,
} from "../slices/jobSlice";
import {
  fetchInterviews, selectAllInterviews,
  selectInterviewError, selectInterviewErrorMessage, selectInterviewLoading,
} from "../slices/interviewSlice";
import { useEffect } from "react";

const DriveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-400">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-400">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-400">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth={2} />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink-400">
    <path d="M8 21h8M12 17v4" />
    <path d="M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h1" />
    <path d="M17 4h3a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4h-1" />
    <path d="M6 4h12v8a6 6 0 0 1-12 0V4z" />
  </svg>
);

const statCards = [
  { key: "drives",     Icon: DriveIcon,    label: "Placement Drives",      iconBg: "bg-blue-500/10",   ring: "hover:ring-blue-500/20" },
  { key: "apps",       Icon: ClipboardIcon, label: "Applications",          iconBg: "bg-green-500/10",  ring: "hover:ring-green-500/20" },
  { key: "jobs",       Icon: BriefcaseIcon, label: "Jobs Posted",           iconBg: "bg-indigo-500/10", ring: "hover:ring-indigo-500/20" },
  { key: "interviews", Icon: CalendarIcon,  label: "Interviews Scheduled",  iconBg: "bg-yellow-500/10", ring: "hover:ring-yellow-500/20" },
  { key: "offers",     Icon: TrophyIcon,    label: "Offers Made",           iconBg: "bg-pink-500/10",   ring: "hover:ring-pink-500/20" },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const placementDrives = useSelector(selectPlacementDrives);
  const placementDrivesLoading = useSelector(selectPlacementDrivesLoading);
  const placementDrivesError = useSelector(selectPlacementDrivesError);

  const applications = useSelector(selectAllApplications);
  const applicationLoading = useSelector(selectApplicationLoading);
  const applicationError = useSelector(selectApplicationError);

  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const jobsError = useSelector(selectJobsError);

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

  const isLoading = placementDrivesLoading || applicationLoading || jobsLoading || interviewLoading;
  const offersMade = interviews.filter((i) => i.result === "Selected").length;

  const counts = {
    drives:     placementDrives.length ?? 0,
    apps:       applications?.length ?? 0,
    jobs:       jobs.length ?? 0,
    interviews: interviews.length ?? 0,
    offers:     offersMade,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Platform-wide placement activity at a glance</p>
        </div>

        {/* Errors */}
        {(applicationError || placementDrivesError || jobsError || interviewError) && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            Error loading some dashboard data. Please refresh.
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {statCards.map(({ key }) => (
              <div key={key} className="bg-[#1e293b] rounded-2xl p-6 border border-white/[0.08] animate-pulse">
                <div className="w-12 h-12 bg-[#243347] rounded-xl mb-5" />
                <div className="h-8 bg-[#243347] rounded-lg mb-2 w-2/3" />
                <div className="h-4 bg-[#243347] rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {statCards.map(({ key, Icon, label, iconBg, ring }) => (
              <div
                key={key}
                className={`bg-[#1e293b] rounded-2xl p-6 border border-white/[0.08] hover:bg-[#243347] hover:-translate-y-0.5 hover:ring-2 ${ring} transition-all`}
              >
                <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon />
                </div>
                <p className="text-4xl font-black text-white mb-1 tabular-nums">{counts[key]}</p>
                <p className="text-sm font-medium text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
