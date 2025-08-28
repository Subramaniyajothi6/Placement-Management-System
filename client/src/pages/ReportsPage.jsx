import { useDispatch, useSelector } from "react-redux";
import { fetchReportById, fetchReports, resetReportState, selectAllReports, selectReportError, selectReportLoading } from "../slices/reportSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const ReportsPage = () => {
    const dispatch = useDispatch();
    const reports = useSelector(selectAllReports);
    const loading = useSelector(selectReportLoading);
    const error = useSelector(selectReportError);

    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        dispatch(fetchReports())
        return () => {
            dispatch(resetReportState());
        };
    }, [dispatch]);

    const handleSelectReport = (id) => {
        setSelectedId(id);
        dispatch(fetchReportById(id));
    };
    
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

            {loading && <p>Loading reports...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            <div className="flex space-x-6">
                {/* Reports List */}
                <div className="w-1/3 border rounded p-4 max-h-[600px] overflow-auto">
                    <h2 className="text-xl font-semibold mb-4">Reports List</h2>
                    {reports.length === 0 && !loading ? (
                        <p>No reports found.</p>
                    ) : (
                        <ul>
                            {reports.map((report) => {
                                const successRate =
                                    report.participantCount > 0
                                        ? ((report.studentsPlaced / report.participantCount) * 100).toFixed(1)
                                        : 'N/A';

                                return (
                                    <li
                                        key={report._id}
                                        className="mb-3 p-3 border rounded cursor-pointer hover:bg-blue-50"
                                    >
                                      <Link to={`/reports/${report._id}`}>
                                        <button
                                            className={`w-full text-left ${report._id === selectedId ? 'bg-blue-200' : ''
                                                }`}
                                            onClick={() => handleSelectReport(report._id)}
                                        >
                                            <p className="font-semibold text-lg">
                                                {report.placementDrive?.title ||  'Unnamed Placement Drive'}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {report.placementDrive?.companyName || 'Unknown Company'}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {new Date(report.startDate).toLocaleDateString()} -{' '}
                                                {new Date(report.endDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm">
                                                Participants: <span className="font-medium">{report.participantCount}</span> |{' '}
                                                Offers: <span className="font-medium">{report.offersMade}</span> |{' '}
                                                Placed: <span className="font-medium">{report.studentsPlaced}</span> |{' '}
                                                Success Rate: <span className="font-medium">{successRate}%</span>
                                            </p>
                                        </button>
                                      </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ReportsPage;