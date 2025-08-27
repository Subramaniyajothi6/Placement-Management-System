import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchReportById, fetchReports, resetReportState, selectAllReports, selectSelectedReport, selectSelectedReportError, selectSelectedReportLoading } from "../slices/reportSlice";
import { useEffect } from "react";



const ReportDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const reports = useSelector(selectAllReports);

    const selectedReport = useSelector(selectSelectedReport);
    const selectedLoading = useSelector(selectSelectedReportLoading);
    const selectedError = useSelector(selectSelectedReportError);


    
// const drive = reports.find((report) => report._id === selectedReport.placementDriveId);
const sR = selectedReport?.placementDrive;


console.log('Placement Drive:',sR );
console.log('id',id );
console.log('selectedReport',selectedReport);


    useEffect(() => {
        dispatch(fetchReportById(id));



        return () => {
            dispatch(resetReportState());
        
        };
    }, [dispatch, id]);

    console.log('selectedReport:', selectedReport);
    if (selectedLoading) return <p>Loading report details...</p>;
    if (selectedError) return <p className="text-red-600">Error: {selectedError}</p>;
    if (!selectedReport) return <p>No report found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Report Details</h1>
            {/* <p><strong>Placement Drive:</strong> {reports.find((report) =>report.id === selectedReport.placementDrive).placementDrive.name || 'N/A'}</p> */}
            {/* <p><strong>Placement Drive:</strong> {drive?.placementDrive || 'N/A'}</p> */}
            {/* <p><strong>Placement Drive:</strong> {selectedReport.placementDrive?.title || 'N/A'}</p> */}
            <p><strong>Participant Count:</strong> {selectedReport.participantCount}</p>
            <p><strong>Interview Count:</strong> {selectedReport.interviewCount}</p>
            <p><strong>Offers Made:</strong> {selectedReport.offersMade}</p>
            <p><strong>Students Placed:</strong> {selectedReport.studentsPlaced}</p>
            <p><strong>Period:</strong> {new Date(selectedReport.startDate).toLocaleDateString()} - {new Date(selectedReport.endDate).toLocaleDateString()}</p>
            {selectedReport.summary && <p><strong>Summary:</strong> {selectedReport.summary}</p>}
        </div>
    );
};

export default ReportDetailsPage;
