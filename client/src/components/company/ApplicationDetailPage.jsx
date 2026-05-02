import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getApplicationById, selectApplicationById, updateApplication } from "../../slices/applicationSlice";
import { fetchJobById, selectSelectedJob } from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import { fetchUserById } from "../../slices/authSlice";
import { FaBriefcase, FaCalendarCheck, FaFileAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import toast from "react-hot-toast";


const statusOptions = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
];

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const application = useSelector((state) => selectApplicationById(state, id));
  const job = useSelector(selectSelectedJob);
  const [candidate, setCandidate] = useState(null);

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getApplicationById(id))
      .unwrap()
      .then((app) => {
        setStatus(app.status || "");
        if (app.job) dispatch(fetchJobById(app.job));
        if (app.candidate) {
          dispatch(fetchUserById(app.candidate))
            .unwrap()
            .then(setCandidate)
            .catch(() => {});
        }
      })
      .catch(() => setError("Failed to load application."));
  }, [dispatch, id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setSuccessMessage(null);
    setError(null);
  };

  const handleSave = async () => {
    console.log(status);
    console.log(application._id);
    if (!application) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await dispatch(
        updateApplication({ id: application?._id, data: { status } })
      ).unwrap();
      setSuccessMessage("Status updated successfully.");
    } catch {
      setError("Failed to update status.");
    }
    setSaving(false);

    toast.success("Status updated successfully.");
  };

  if (!application)
    return <div className="text-center py-12 text-gray-400 text-sm">Loading application details...</div>;

  if (error)
    return <div className="text-center py-12 text-red-400 text-sm font-semibold">{error}</div>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
          aria-label="Go back"
        >
          &larr; Back
        </button>

        <h1 className="text-2xl font-black mb-8 text-white border-b border-white/[0.08] pb-4">Application Details</h1>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <FaUser className="text-indigo-400 text-sm" />
              <h2 className="text-base font-semibold text-white">Applicant</h2>
            </div>
            <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="text-gray-200">{candidate?.name || "N/A"}</span></p>
            <p className="text-sm"><span className="text-gray-500">Email:</span> <span className="text-gray-200">{candidate?.email || "N/A"}</span></p>
          </div>

          <div className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <FaBriefcase className="text-indigo-400 text-sm" />
              <h2 className="text-base font-semibold text-white">Job</h2>
            </div>
            <p className="text-sm"><span className="text-gray-500">Title:</span> <span className="text-gray-200">{job?.title || "N/A"}</span></p>
            <div className="flex items-center gap-2 text-sm">
              <FaMapMarkerAlt className="text-gray-500 text-xs" />
              <span className="text-gray-300">{job?.location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaCalendarCheck className="text-gray-500 text-xs" />
              <span className="text-gray-400">Applied {new Date(application.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6 mb-6">
          <h2 className="text-base font-bold mb-4 text-white border-b border-white/[0.08] pb-2">Application Status</h2>
          <div className="flex items-center gap-4 mb-3">
            <select
              value={status}
              onChange={handleStatusChange}
              disabled={saving}
              className="w-52 p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm [&>option]:bg-[#1e293b] [&>option]:text-white"
              aria-label="Update application status"
            >
              {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-indigo-900/40 transition bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Status & Notify"}
            </button>
          </div>
          {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6">
          <h2 className="text-base font-bold flex items-center gap-2 text-white mb-3">
            <FaFileAlt className="text-indigo-400 text-sm" /> Resume
          </h2>
          {application.resume ? (
            <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm">
              View Resume
            </a>
          ) : (
            <p className="text-gray-500 text-sm">No resume provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
