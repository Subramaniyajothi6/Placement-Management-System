import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  getApplicationById,
  selectApplicationById,
  updateApplication,
} from "../../slices/applicationSlice";
import { fetchJobById, selectSelectedJob } from "../../slices/jobSlice";
import { fetchUserById } from "../../slices/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaFileAlt,
} from "react-icons/fa";

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
    if (!application) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await dispatch(
        updateApplication({ id: application._id, data: { status } })
      ).unwrap();
      setSuccessMessage("Status updated successfully.");
    } catch {
      setError("Failed to update status.");
    }
    setSaving(false);
  };

  if (!application)
    return (
      <div className="text-center py-12 text-gray-600 font-medium">
        Loading application details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-8 top-8 text-indigo-600 hover:text-indigo-800 transition font-semibold flex items-center focus:outline-none"
        aria-label="Go back"
      >
        <span className="mr-1 text-xl">&larr;</span> Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-indigo-700 text-center border-b pb-3">
        Application Details
      </h1>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-10 mb-10">
        {/* Applicant Info */}
        <div className="bg-indigo-50 rounded-lg shadow-sm p-6 space-y-3">
          <div className="flex items-center mb-2 space-x-2">
            <FaUser className="text-indigo-600" />
            <h2 className="text-xl font-semibold text-indigo-700">Applicant</h2>
          </div>
          <div>
            <span className="font-semibold text-indigo-900">Name:</span>{" "}
            {candidate?.name || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-indigo-900">Email:</span>{" "}
            {candidate?.email || "N/A"}
          </div>
        </div>

        {/* Job Info */}
        <div className="bg-indigo-50 rounded-lg shadow-sm p-6 space-y-3">
          <div className="flex items-center mb-2 space-x-2">
            <FaBriefcase className="text-indigo-600" />
            <h2 className="text-xl font-semibold text-indigo-700">Job</h2>
          </div>
          <div>
            <span className="font-semibold text-indigo-900">Title:</span>{" "}
            {job?.title || "N/A"}
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-indigo-500" />
            <span className="text-gray-700">{job?.location || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarCheck className="text-indigo-500" />
            <span>
              <span className="font-semibold text-indigo-900">Applied On:</span>{" "}
              {new Date(application.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="mt-6 px-2">
        <h2 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2">
          Application Status
        </h2>
        <div className="flex items-center gap-4 mb-2">
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={saving}
            className="w-60 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 font-semibold text-indigo-700"
            aria-label="Update application status"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-3 rounded-md text-white font-semibold shadow-md transition ${
              saving
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving ? "Saving..." : "Save Status & Notify"}
          </button>
        </div>
        {successMessage && (
          <p className="text-green-600 font-medium animate-pulse">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="text-red-600 font-medium animate-pulse">{error}</p>
        )}
      </div>

      {/* Resume Section */}
      <div className="mt-10 px-2">
        <h2 className="text-xl font-bold border-b pb-1 flex items-center space-x-2 text-indigo-800 mb-4">
          <FaFileAlt className="text-indigo-600" />
          <span>Resume</span>
        </h2>
        {application.resume ? (
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 hover:underline font-semibold inline-block mt-2"
          >
            View Resume
          </a>
        ) : (
          <p className="text-gray-600 mt-2">No resume provided.</p>
        )}
      </div>


    </div>
  );
};

export default ApplicationDetailPage;
