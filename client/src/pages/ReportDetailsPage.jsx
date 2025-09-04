import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import {
  fetchReportById,

  selectSelectedReport,
  selectReportError,
  selectReportLoading,
  resetReportState,
} from "../slices/reportSlice";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { FaArrowLeft } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import PrintableReport from "./PrintableReport";

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'];

const formatNumber = (num) => (num ? num.toLocaleString() : "N/A");

const ReportDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedReport = useSelector(selectSelectedReport);
  const loading = useSelector(selectReportLoading);
  const error = useSelector(selectReportError);

  useEffect(() => {
    dispatch(fetchReportById(id));
    return () => {
      dispatch(resetReportState());
    };
  }, [dispatch, id]);

  const handleExportPDF = () => {
    const element = document.getElementById("report-pdf-content");
    if (!element) return;
    element.style.position = "relative";
    element.style.left = "0";
    element.style.top = "0";
    element.style.width = "210mm";
    element.style.backgroundColor = "#fff";
    element.style.padding = "20px";
    element.style.opacity = "1";
    html2pdf()
      .set({
        margin: 0.4,
        filename: `report_${selectedReport?.placementDrive?.title || "placement"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save()
      .finally(() => {
        // Optionally revert container to hidden if needed after export
        element.style.position = "fixed";
        element.style.left = "-9999px";
        element.style.top = "0";
        element.style.opacity = "0";
      });

  };

  if (loading)
    return (
      <div className="text-center py-16 text-indigo-700 font-medium">
        Loading report details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16 text-red-600 font-semibold">
        Error loading report: {error}
      </div>
    );

  if (!selectedReport)
    return (
      <div className="text-center py-16 text-indigo-400">No report found.</div>
    );

  const {
    placementDrive,
    participantCount,
    interviewCount,
    offersMade,
    studentsPlaced,
    startDate,
    endDate,
    summary,
  } = selectedReport;

  const barData = [
    { name: "Participants", count: participantCount },
    { name: "Interviews", count: interviewCount },
    { name: "Offers", count: offersMade },
    { name: "Placed", count: studentsPlaced },
  ];

  const pieData = [
    { name: "Placed", value: studentsPlaced },
    { name: "Not Placed", value: participantCount - studentsPlaced },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10 space-y-8 relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition focus:outline-none"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold shadow hover:bg-indigo-700 transition"
          >
            Export as PDF
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-10 text-indigo-700 text-center border-b pb-4">
          Report Details
        </h1>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-indigo-900">
          <div>
            <dt className="font-semibold">Placement Drive</dt>
            <dd className="mt-1">{placementDrive?.title || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-semibold">Company</dt>
            <dd className="mt-1">{placementDrive?.companyName || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-semibold">Participant Count</dt>
            <dd className="mt-1">{formatNumber(participantCount)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Interview Count</dt>
            <dd className="mt-1">{formatNumber(interviewCount)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Offers Made</dt>
            <dd className="mt-1">{formatNumber(offersMade)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Students Placed</dt>
            <dd className="mt-1">{formatNumber(studentsPlaced)}</dd>
          </div>
          <div>
            <dt className="font-semibold">Period</dt>
            <dd className="mt-1">
              {startDate ? new Date(startDate).toLocaleDateString() : "N/A"} -{" "}
              {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}
            </dd>
          </div>
        </dl>

        <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mt-8">
          <h2 className="font-semibold text-xl mb-6 text-indigo-700">Visual Summary</h2>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
            <div>
              <h3 className="text-lg font-medium mb-3 text-indigo-800">Placement Counts</h3>
              <BarChart
                width={325}
                height={250}
                data={barData}
                margin={{ top: 5, right: 16, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-indigo-800">Success Rate</h3>
              <PieChart width={260} height={250}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={85}
                  fill="#4b61f9"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </section>

        {summary && (
          <section>
            <h2 className="font-semibold text-xl mb-2 text-indigo-700">Summary</h2>
            <pre className="whitespace-pre-wrap">{summary}</pre>
          </section>
        )}
      </div>

      {/* Hidden printable content for PDF generation */}
      <div
        id="report-pdf-content"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "210mm",
          height: "auto",
          backgroundColor: "#fff",
          padding: 20,
          boxSizing: "border-box",
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
          overflow: "visible",
          zIndex: 9999,
        }}
      >
        <PrintableReport report={selectedReport} />
      </div>
    </>
  );
};

export default ReportDetails;
