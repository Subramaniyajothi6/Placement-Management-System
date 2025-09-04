import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

// Status label colors for applications
const statusColors = {
  Submitted: "bg-gray-300 text-gray-800",
  "Under Review": "bg-yellow-300 text-yellow-800",
  Shortlisted: "bg-blue-300 text-blue-800",
  Rejected: "bg-red-300 text-red-800",
  Hired: "bg-green-300 text-green-800",
};

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
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back button fixed top-left */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        aria-label="Go back"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="max-w-6xl mx-auto p-6 space-y-16">
        {/* Interview Schedule Section */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-extrabold mb-6 text-indigo-700">My Interview Schedule</h2>

          {interviewLoading ? (
            <p className="text-center text-gray-600 text-base">Loading interviews...</p>
          ) : interviewError ? (
            <p className="text-center text-red-600 font-semibold text-base">Error: {interviewError}</p>
          ) : !interviews.length ? (
            <p className="text-center text-gray-500 italic text-base">No interviews scheduled.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Job/Drive</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Location / Link</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Interviewer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
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
                        className="hover:bg-indigo-100 focus-within:bg-indigo-100 cursor-pointer transition"
                        tabIndex={0}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-base font-normal">{job?.title || "N/A"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-base">{new Date(interviewDate).toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-blue-600 text-base">
                          {interviewType === "Online" ? (
                            <a
                              href={`https://zoom.us/j/${meetingId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Zoom Link
                            </a>
                          ) : (
                            location || "N/A"
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-base">{interviewers?.length ? `${interviewers.length} Interviewer(s)` : "N/A"}</td>
                        <td
                          className={`px-4 py-3 whitespace-nowrap font-semibold text-base ${
                            status === "Scheduled"
                              ? "text-blue-700"
                              : status === "Completed"
                              ? "text-green-700"
                              : status === "Pending"
                              ? "text-yellow-700"
                              : "text-gray-700"
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
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-extrabold mb-6 text-indigo-700">My Applications</h2>

          {applicationLoading ? (
            <p className="text-center text-gray-600 text-base">Loading applications...</p>
          ) : applicationError ? (
            <p className="text-center text-red-600 font-semibold text-base">Error: {applicationError}</p>
          ) : !applications.length ? (
            <p className="text-center text-gray-500 italic text-base">No applications found.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Job/Drive</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Applied On</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-indigo-100 focus-within:bg-indigo-100 cursor-pointer transition"
                      tabIndex={0}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-base font-normal">{app.job?.title || "N/A"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            statusColors[app.status] || "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-base">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-base">
                        <button className="mr-4 text-indigo-600 hover:underline">Update</button>
                        <button className="text-red-600 hover:underline">Withdraw</button>
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
