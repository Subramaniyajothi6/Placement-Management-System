import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, selectJobs } from "../../slices/jobSlice";
import { useEffect, useState } from "react";
import applicationApi from "../../api/applicationsApi";
import { createInterview } from "../../slices/interviewSlice";

const InterviewSchedulingForm = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);

  // Local state
  const [selectedJob, setSelectedJob] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [form, setForm] = useState({
    startTime: "",
    durationMinutes: 30,
    interviewType: "Online",
    location: "",
    meetingId: "",
    round: "Round 1",
    interviewers: [],
  });

  // Fetch jobs on mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch shortlisted candidates when job changes
  useEffect(() => {
    if (selectedJob) {
      applicationApi
        .getCompanyApplications({ jobId: selectedJob, status: "Shortlisted" })
        .then((res) => setCandidates(res.data.data))
        .catch(() => setCandidates([]));
    } else {
      setCandidates([]);
    }
  }, [selectedJob]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit interview
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      job: selectedJob,
      candidate: selectedCandidate,
      endTime: form.startTime
        ? new Date(new Date(form.startTime).getTime() + form.durationMinutes * 60000)
        : undefined,
      interviewDate: form.startTime,
    };
    await dispatch(createInterview(payload));
    // Custom: add notifications, reset, UI feedback etc.
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Schedule Interview</h2>
      <label className="block mb-2">Job</label>
      <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} className="mb-4 p-2 border rounded w-full" required>
        <option value="">Select Job</option>
        {jobs.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
      </select>

      <label className="block mb-2">Candidate</label>
      <select value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)} className="mb-4 p-2 border rounded w-full" required>
        <option value="">Select Candidate</option>
        {candidates.map(app => (
          <option key={app.candidate._id} value={app.candidate._id}>
            {app.candidate.name} ({app.candidate.email})
          </option>
        ))}
      </select>

      <label className="block mb-2">Date & Time</label>
      <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

      <label className="block mb-2">Duration (minutes)</label>
      <input type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} min={1} className="mb-4 p-2 border rounded w-full" />

      <label className="block mb-2">Interview Type</label>
      <select name="interviewType" value={form.interviewType} onChange={handleChange} className="mb-4 p-2 border rounded w-full">
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      {form.interviewType === "Online" && (
        <>
          <label className="block mb-2">Meeting Link/ID</label>
          <input name="meetingId" value={form.meetingId} onChange={handleChange} className="mb-4 p-2 border rounded w-full" />
        </>
      )}
      {form.interviewType === "Offline" && (
        <>
          <label className="block mb-2">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="mb-4 p-2 border rounded w-full" />
        </>
      )}

      <label className="block mb-2">Interview Round</label>
      <input name="round" value={form.round} onChange={handleChange} className="mb-4 p-2 border rounded w-full" />

      {/* Add interviewer assignment if needed here */}

      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Schedule Interview</button>
    </form>
  );
};

export default InterviewSchedulingForm;
