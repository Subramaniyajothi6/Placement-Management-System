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
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center absolute left-0 top-0 text-indigo-600 font-semibold hover:text-indigo-800 transition focus:outline-none mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-4xl font-extrabold mb-10 text-indigo-700 text-center tracking-tight pt-2">
          Reports & Analytics
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Reports List */}
          <aside className="w-full md:w-1/3 bg-white border border-indigo-100 rounded-2xl shadow-lg p-6 max-h-[600px] overflow-auto">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b border-indigo-100 pb-2">Reports List</h2>
            {loading && <p className="text-center py-8 text-gray-500">Loading reports...</p>}
            {error && <p className="text-center py-8 text-red-600">{error}</p>}
            {reports.length === 0 && !loading ? (
              <p className="py-12 text-center text-gray-500">No reports found.</p>
            ) : (
              <ul className="space-y-4">
                {reports.map((report) => {
                  const successRate =
                    report.participantCount > 0
                      ? ((report.studentsPlaced / report.participantCount) * 100).toFixed(1)
                      : 'N/A';

                  const isActive = report._id === selectedId;
                  return (
                    <li
                      key={report._id}
                      className={`rounded-lg transition shadow-md bg-white border cursor-pointer ${
                        isActive
                          ? "border-indigo-600 ring-2 ring-indigo-300"
                          : "border-indigo-100 hover:border-indigo-400 hover:shadow-lg"
                      }`}
                    >
                      <Link to={`/dashboard/reports/${report._id}`}>
                        <button
                          className="w-full text-left p-4 rounded-lg focus:outline-none"
                          onClick={() => handleSelectReport(report._id)}
                          tabIndex={0}
                        >
                          <p className="font-bold text-indigo-700 text-lg truncate">
                            {report.placementDrive?.title || "Unnamed Placement Drive"}
                          </p>
                          <p className="text-sm text-indigo-500">{report.placementDrive?.companyName || "Unknown Company"}</p>
                          <p className="text-sm text-gray-400 mb-2">
                            {new Date(report.startDate).toLocaleDateString()} &ndash; {new Date(report.endDate).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap justify-start gap-2 text-gray-700 text-sm mt-2">
                            <span className="bg-indigo-50 px-2 py-1 rounded font-medium">Participants: <span className="text-indigo-700">{report.participantCount}</span></span>
                            <span className="bg-indigo-50 px-2 py-1 rounded font-medium">Offers: <span className="text-indigo-700">{report.offersMade}</span></span>
                            <span className="bg-indigo-50 px-2 py-1 rounded font-medium">Placed: <span className="text-indigo-700">{report.studentsPlaced}</span></span>
                            <span className="bg-green-50 px-2 py-1 rounded font-medium">Success: <span className="text-green-700">{successRate}%</span></span>
                          </div>
                        </button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
          {/* (Optional) Place for selected report details/analytics here */}
          <div className="flex-grow" />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
