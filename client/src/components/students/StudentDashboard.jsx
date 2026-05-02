import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, formatDateTime } from "../../utils/dateUtils";
import {
  fetchMyInterviews,
  selectInterviewError,
  selectInterviewLoading,
  selectInterviewsByStudent,
} from "../../slices/interviewSlice";
import {
  fetchMyApplications,
  selectAllApplications,
  selectApplicationError,
  selectApplicationLoading,
} from "../../slices/applicationSlice";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const statusColors = {
  Submitted: "bg-gray-500/15 text-gray-300",
  "Under Review": "bg-yellow-500/15 text-yellow-300",
  Shortlisted: "bg-blue-500/15 text-blue-300",
  Rejected: "bg-red-500/15 text-red-300",
  Hired: "bg-green-500/15 text-green-300",
};

const MEETING_BASE_URL = import.meta.env.VITE_MEETING_BASE_URL ?? "https://placementmanagementsystem-project.netlify.app";

const StudentDashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Interviews state
  const userId = useSelector((state) => state.auth.user?._id);
  const interviews = useSelector((state) => selectInterviewsByStudent(state, userId));
  const interviewLoading = useSelector(selectInterviewLoading);
  const interviewError = useSelector(selectInterviewError);

  // Applications state
  const applications = useSelector(selectAllApplications);
  const applicationLoading = useSelector(selectApplicationLoading);
  const applicationError = useSelector(selectApplicationError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchMyInterviews());
      dispatch(fetchMyApplications());
    }
  }, [dispatch, userId]);

  return (
    <div className="min-h-screen py-8 sm:py-6 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition mb-6"
        aria-label="Go back"
      >
        <FaArrowLeft className="mr-2 text-xs" /> Back
      </button>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Interview Schedule Section */}
        <section className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6" aria-live="polite" aria-atomic="false">
          <h2 className="text-2xl font-bold mb-6 text-white">My Interview Schedule</h2>

          {interviewLoading ? (
            <p className="text-center text-gray-400 text-sm">Loading interviews...</p>
          ) : interviewError ? (
            <p className="text-center text-red-400 font-semibold text-sm">Error: {interviewError}</p>
          ) : !interviews.length ? (
            <p className="text-center text-gray-500 italic text-sm">No interviews scheduled.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="min-w-full divide-y divide-white/[0.06]">
                <thead className="bg-[#1e293b]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Job/Drive</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location / Link</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Interviewer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {interviews.map(
                    ({
                      _id,
                      job,
                      interviewDate,
                      location,
                      interviewers,
                      interviewType,
                      meetingId,
                      status,
                    }) => (
                      <tr
                        key={_id}
                        className="hover:bg-white/[0.04] focus-within:bg-white/[0.04] cursor-pointer transition"
                        tabIndex={0}
                        onClick={() => navigate(`/student/interview/${_id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/student/interview/${_id}`);
                          }
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-gray-200 text-sm">{job?.title || "N/A"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-sm">{formatDateTime(interviewDate)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {interviewType === "Online" ? (
                            <a
                              href={`${MEETING_BASE_URL}/students/${meetingId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Meeting Link
                            </a>
                          ) : (
                            <span className="text-gray-300">{location || "N/A"}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-sm">{interviewers?.length ? `${interviewers.length} Interviewer(s)` : "N/A"}</td>
                        <td className={`px-4 py-3 whitespace-nowrap font-semibold text-sm ${
                            status === "Scheduled" ? "text-blue-400"
                            : status === "Completed" ? "text-green-400"
                            : status === "Pending" ? "text-yellow-400"
                            : "text-gray-400"
                          }`}
                        >
                          {status}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Applications Section */}
        <section className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6" aria-live="polite" aria-atomic="false">
          <h2 className="text-2xl font-bold mb-6 text-white">My Applications</h2>

          {applicationLoading ? (
            <p className="text-center text-gray-400 text-sm">Loading applications...</p>
          ) : applicationError ? (
            <p className="text-center text-red-400 font-semibold text-sm">Error: {applicationError}</p>
          ) : !applications.length ? (
            <div className="text-center py-4">
              <p className="text-gray-500 italic text-sm mb-3">No applications found.</p>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
              >
                Browse Placement Drives
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="min-w-full divide-y divide-white/[0.06]">
                <thead className="bg-[#1e293b]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Job/Drive</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Applied On</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-white/[0.04] focus-within:bg-white/[0.04] cursor-pointer transition"
                      tabIndex={0}
                      onClick={() => navigate(`/student/applications/${app._id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/student/applications/${app._id}`);
                        }
                      }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-gray-200 text-sm">{app.job?.title || "N/A"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[app.status] || "bg-gray-500/15 text-gray-300"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-sm">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          className="mr-4 text-indigo-400 hover:text-indigo-300 hover:underline"
                          onClick={(e) => { e.stopPropagation(); navigate(`/student/applications/${app._id}`); }}
                        >
                          Update
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.confirm("Are you sure you want to withdraw this application?");
                          }}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashBoard;
