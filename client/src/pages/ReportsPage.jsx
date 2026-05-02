import { useDispatch, useSelector } from "react-redux";
import { fetchReportById, fetchReports, resetReportState, selectAllReports, selectReportError, selectReportLoading } from "../slices/reportSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reports = useSelector(selectAllReports);
  const loading = useSelector(selectReportLoading);
  const error = useSelector(selectReportError);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchReports());
    return () => {
      dispatch(resetReportState());
    };
  }, [dispatch]);

  const handleSelectReport = (id) => {
    setSelectedId(id);
    dispatch(fetchReportById(id));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <h1 className="text-3xl font-black mb-8 text-white tracking-tight">
          Reports & Analytics
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Reports List */}
          <aside className="w-full md:w-1/3 bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6 max-h-[600px] overflow-auto">
            <h2 className="text-lg font-bold mb-5 text-white border-b border-white/[0.08] pb-3">Reports List</h2>
            {loading && <p className="text-center py-8 text-gray-400 text-sm">Loading reports...</p>}
            {error && <p className="text-center py-8 text-red-400 text-sm">{error}</p>}
            {reports.length === 0 && !loading ? (
              <p className="py-12 text-center text-gray-500 text-sm">No reports found.</p>
            ) : (
              <ul className="space-y-3">
                {reports.map((report) => {
                  const successRate =
                    report.participantCount > 0
                      ? ((report.studentsPlaced / report.participantCount) * 100).toFixed(1)
                      : 'N/A';

                  const isActive = report._id === selectedId;
                  return (
                    <li
                      key={report._id}
                      className={`rounded-xl transition border cursor-pointer ${
                        isActive
                          ? "border-indigo-500/40 bg-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "border-white/[0.08] bg-[#172033] hover:bg-[#243347] hover:border-white/[0.14]"
                      }`}
                    >
                      <Link to={`/dashboard/reports/${report._id}`}>
                        <button
                          className="w-full text-left p-4 rounded-xl focus:outline-none"
                          onClick={() => handleSelectReport(report._id)}
                          tabIndex={0}
                        >
                          <p className="font-bold text-white text-sm truncate">
                            {report.placementDrive?.title || "Unnamed Placement Drive"}
                          </p>
                          <p className="text-xs text-indigo-400 mb-1">{report.placementDrive?.companyName || "Unknown Company"}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(report.startDate).toLocaleDateString()} &ndash; {new Date(report.endDate).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-1.5 text-xs mt-1">
                            <span className="bg-[#243347] px-2 py-0.5 rounded text-gray-300">Participants: <span className="text-white">{report.participantCount}</span></span>
                            <span className="bg-[#243347] px-2 py-0.5 rounded text-gray-300">Offers: <span className="text-white">{report.offersMade}</span></span>
                            <span className="bg-[#243347] px-2 py-0.5 rounded text-gray-300">Placed: <span className="text-white">{report.studentsPlaced}</span></span>
                            <span className="bg-green-500/10 px-2 py-0.5 rounded text-green-400">Success: {successRate}%</span>
                          </div>
                        </button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
          <div className="flex-grow" />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
