import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import {
  fetchReportById,
  resetReportState,
  selectSelectedReport,
  selectSelectedReportError,
  selectSelectedReportLoading,
} from "../slices/reportSlice";
import { useEffect } from "react";
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

const formatNumber = (num) => num?.toLocaleString() ?? "N/A";
const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'];

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedReport = useSelector(selectSelectedReport);
  const selectedLoading = useSelector(selectSelectedReportLoading);
  const selectedError = useSelector(selectSelectedReportError);

  useEffect(() => {
    dispatch(fetchReportById(id));
    return () => {
      dispatch(resetReportState());
    };
  }, [dispatch, id]);

  if (selectedLoading)
    return (
      <div className="text-center py-16 text-lg text-indigo-700 font-medium">
        Loading report details...
      </div>
    );

  if (selectedError)
    return (
      <div className="text-center py-16 text-red-600 font-semibold">
        Error loading report: {selectedError}
      </div>
    );

  if (!selectedReport)
    return (
      <div className="text-center py-16 text-indigo-400">
        No report found.
      </div>
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
    { name: "Offers Made", count: offersMade },
    { name: "Students Placed", count: studentsPlaced },
  ];
  const pieData = [
    { name: "Placed", value: studentsPlaced },
    { name: "Not Placed", value: participantCount - studentsPlaced },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10 space-y-8 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center absolute left-8 top-8 text-indigo-600 font-semibold hover:text-indigo-800 transition focus:outline-none"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

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
            {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </dd>
        </div>
      </dl>

      {/* Chart Section */}
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
                outerRadius={85}
                innerRadius={38}
                fill="#4f46e5"
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
          <p className="whitespace-pre-wrap text-gray-700 bg-indigo-50 p-4 rounded">{summary}</p>
        </section>
      )}
    </div>
  );
};

export default ReportDetailsPage;
