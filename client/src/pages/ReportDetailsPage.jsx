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

const ReportDetailsPage = () => {
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
    return <div className="text-center py-16 text-gray-400 text-sm">Loading report details...</div>;

  if (error)
    return <div className="text-center py-16 text-red-400 text-sm font-semibold">Error loading report: {error}</div>;

  if (!selectedReport)
    return <div className="text-center py-16 text-gray-500 text-sm">No report found.</div>;

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
      <div className="min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
            >
              <FaArrowLeft className="text-xs" /> Back
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
            >
              Export as PDF
            </button>
          </div>

          <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8">
            <h1 className="text-2xl font-black text-white mb-6 pb-4 border-b border-white/[0.08]">
              Report Details
            </h1>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Placement Drive", value: placementDrive?.title || "N/A" },
                { label: "Company", value: placementDrive?.companyName || "N/A" },
                { label: "Participant Count", value: formatNumber(participantCount) },
                { label: "Interview Count", value: formatNumber(interviewCount) },
                { label: "Offers Made", value: formatNumber(offersMade) },
                { label: "Students Placed", value: formatNumber(studentsPlaced) },
                {
                  label: "Period",
                  value: `${startDate ? new Date(startDate).toLocaleDateString() : "N/A"} – ${endDate ? new Date(endDate).toLocaleDateString() : "N/A"}`
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#172033] border border-white/[0.06] rounded-xl p-4">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</dt>
                  <dd className="text-gray-200 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8">
            <h2 className="text-base font-bold text-white mb-6">Visual Summary</h2>
            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-400 text-center">Placement Counts</h3>
                <BarChart width={325} height={250} data={barData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" fontSize={12} tick={{ fill: "#9ca3af" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <YAxis allowDecimals={false} fontSize={12} tick={{ fill: "#9ca3af" }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e2e8f0" }} />
                  <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-400 text-center">Success Rate</h3>
                <PieChart width={260} height={250}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={85} dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e2e8f0" }} />
                  <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
                </PieChart>
              </div>
            </div>
          </div>

          {summary && (
            <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-3">Summary</h2>
              <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{summary}</pre>
            </div>
          )}
        </div>
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

export default ReportDetailsPage;
