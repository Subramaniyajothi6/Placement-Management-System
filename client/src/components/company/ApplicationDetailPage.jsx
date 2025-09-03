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

  // Use selector with correct function signature
  const application = useSelector((state) => selectApplicationById(state, id));
  const job = useSelector(selectSelectedJob);
  const [candidate, setCandidate] = useState(null);

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  
  // Fetch application and related data on mount or id change
  useEffect(() => {
    dispatch(getApplicationById(id))
      .unwrap()
      .then((app) => {
        setStatus(app.status || "");
        if (app.job) dispatch(fetchJobById(app.job));
        if (app.candidate) {
          dispatch(fetchUserById(app.candidate))
            .unwrap()
            .then((userData) => setCandidate(userData))
            .catch(() => {}); // Optional: handle user fetch error
        }
      })
      .catch(() => setError("Failed to load application."));
  }, [dispatch, id]);

  // console.log("Candidate:", candidate);
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // console.log("Status:", status);

  const handleSave = async () => {
    if (!application) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {

      await dispatch(
        updateApplication({ id: application?._id, data: { status } })
      ).unwrap();

      setSuccessMessage("Status updated successfully.");
      console.log("Status updated successfully.");
    } catch (err) {
      setError("Failed to update status.", err.message);
    }
    setSaving(false);

    console.log("Status updated successfully" );
  };

  

  if (!application) return <div>Loading application details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;




  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Application Details</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Applicant Information</h2>
        <p>Name: {candidate?.name || "N/A"}</p>
        <p>Email: {candidate?.email || "N/A"}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Job Information</h2>
        <p>Title: {job?.title || "N/A"}</p>
        <p>Location: {job?.location || "N/A"}</p>
        <p>Applied On: {new Date(application.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Application Status</h2>
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-2 border rounded w-1/3"
          disabled={saving}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Resume</h2>
        {application.resume ? (
          <a
            href={application.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Resume
          </a>
        ) : (
          "No resume provided."
        )}
      </div>

      {successMessage && (
        <div className="text-green-600 mb-4">{successMessage}</div>
      )}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded bg-indigo-600 text-white font-semibold ${
            saving ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {saving ? "Saving..." : "Save Status & Notify"}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
