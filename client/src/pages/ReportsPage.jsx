import { useDispatch, useSelector } from "react-redux";
import { fetchReportById, fetchReports, resetReportState, selectAllReports, selectReportError, selectReportLoading, selectSelectedReport, selectSelectedReportError, selectSelectedReportLoading } from "../slices/reportSlice";
import { act, useEffect, useState } from "react";


const ReportsPage = () => {
    const dispatch = useDispatch();
    const reports = useSelector(selectAllReports);
    const loading = useSelector(selectReportLoading);
    const error = useSelector(selectReportError);

    const selectedReport = useSelector(selectSelectedReport);
    const selectedLoading = useSelector(selectSelectedReportLoading);
    const selectedError = useSelector(selectSelectedReportError);

    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        dispatch(fetchReports())
        .then((action) => {
            console.log('Fetched reports:', action.payload); 
    });

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
                                        <button
                                            className={`w-full text-left ${report._id === selectedId ? 'bg-blue-200' : ''
                                                }`}
                                            onClick={() => handleSelectReport(report._id)}
                                        >
                                            <p className="font-semibold text-lg">
                                                {report.placementDrive?.title || report.placementDrive?.companyName || 'Unnamed Placement Drive'}
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
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Report Details */}
                <div className="w-2/3 border rounded p-4 max-h-[600px] overflow-auto">
                    <h2 className="text-xl font-semibold mb-4">Report Details</h2>
                    {selectedLoading && <p>Loading report details...</p>}
                    {selectedError && <p className="text-red-600">Error loading report details.</p>}
                    {!selectedReport && !selectedLoading && <p>Select a report to see details.</p>}
                    {selectedReport && (
                        <div>
                            <p>
                                <strong>Placement Drive:</strong> {selectedReport.placementDrive || 'N/A'}
                            </p>
                            <p>
                                <strong>Participant Count:</strong> {selectedReport.participantCount}
                            </p>
                            <p>
                                <strong>Interview Count:</strong> {selectedReport.interviewCount}
                            </p>
                            <p>
                                <strong>Offers Made:</strong> {selectedReport.offersMade}
                            </p>
                            <p>
                                <strong>Students Placed:</strong> {selectedReport.studentsPlaced}
                            </p>
                            <p>
                                <strong>Period:</strong>{' '}
                                {new Date(selectedReport.startDate).toLocaleDateString()} -{' '}
                                {new Date(selectedReport.endDate).toLocaleDateString()}
                            </p>
                            {selectedReport.summary && (
                                <p>
                                    <strong>Summary:</strong> {selectedReport.summary}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
