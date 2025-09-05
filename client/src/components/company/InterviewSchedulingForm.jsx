import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { createInterview, deleteInterview, fetchInterviews, selectAllInterviews, selectInterviewError, selectInterviewLoading, updateInterview } from '../../slices/interviewSlice';
import { fetchJobs, selectJobs } from '../../slices/jobSlice';
import { fetchUsers, selectUsers } from '../../slices/authSlice';
import { useEffect, useState } from 'react';
import applicationApi from '../../api/applicationsApi';
import { useNavigate } from 'react-router';

Modal.setAppElement('#root');

const InterviewSchedulingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const interviews = useSelector(selectAllInterviews);
  const isLoading = useSelector(selectInterviewLoading);
  const isError = useSelector(selectInterviewError);
  const jobs = useSelector(selectJobs);
  const user = useSelector(state => state.auth.user);
  const users = useSelector(selectUsers);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const [selectedJob, setSelectedJob] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [form, setForm] = useState({
    startTime: '',
    durationMinutes: 30,
    interviewType: 'Online',
    location: '',
    meetingId: '',
    round: 'Round 1',
  });
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchInterviews());
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredJobsId = jobs?.filter(job => job.company === user.companyId).map(job => job._id) || [];
  const companyInterviews = interviews?.filter(iv => filteredJobsId.includes(iv.job)) || [];

  const getCandidateName = (candidateId) => {
    const candidate = users.find(u => u._id === candidateId);
    return candidate ? candidate.name : "N/A";
  };

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    return job ? job.title : "N/A";
  };

  useEffect(() => {
    if (selectedJob) {
      applicationApi.getCompanyApplications({ jobId: selectedJob, status: 'Shortlisted' })
        .then(res => setCandidates(res.data.data))
        .catch(() => setCandidates([]));
    } else {
      setCandidates([]);
      setSelectedCandidate('');
    }
  }, [selectedJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "candidate") setSelectedCandidate(value);
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingInterviewId(null);
    setSelectedJob('');
    setSelectedCandidate('');
    setForm({
      startTime: '',
      durationMinutes: 30,
      interviewType: 'Online',
      location: '',
      meetingId: '',
      round: 'Round 1',
    });
    setFormError('');
    setSubmitSuccess(false);
    setCandidates([]);
    setModalIsOpen(true);
  };

  const openEditModal = (interview) => {
    setModalMode('edit');
    setEditingInterviewId(interview._id);
    setSelectedJob(interview.job);
    setSelectedCandidate(interview.candidate);
    setForm({
      startTime: interview.startTime
        ? new Date(interview.startTime).toLocaleString('sv-SE').replace(' ', 'T')
        : '',
      durationMinutes: interview.durationMinutes || 30,
      interviewType: interview.interviewType || 'Online',
      location: interview.location || '',
      meetingId: interview.meetingId || '',
      round: interview.round || 'Round 1',
    });
    setFormError('');
    setSubmitSuccess(false);

    if (interview.job) {
      applicationApi.getCompanyApplications({ jobId: interview.job, status: 'Shortlisted' })
        .then(res => setCandidates(res.data.data))
        .catch(() => setCandidates([]));
    } else {
      setCandidates([]);
    }
    setModalIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedJob) {
      setFormError('Please select a job.');
      return;
    }
    if (!selectedCandidate) {
      setFormError('Please select a candidate.');
      return;
    }
    if (!form.startTime) {
      setFormError('Please select an interview date and time.');
      return;
    }

    const start = new Date(form.startTime);
    const end = new Date(start.getTime() + form.durationMinutes * 60000);

    setFormError('');

    const payload = {
      job: selectedJob,
      candidate: selectedCandidate,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      interviewDate: start.toISOString(),
      durationMinutes: Number(form.durationMinutes),
      interviewType: form.interviewType,
      location: form.interviewType === 'Offline' ? form.location : '',
      meetingId: form.interviewType === 'Online' ? form.meetingId : '',
      round: form.round,
      emailType: 'schedule',
    };

    try {
      if (modalMode === 'create') {
        await dispatch(createInterview(payload)).unwrap();
      } else if (modalMode === 'edit' && editingInterviewId) {
        await dispatch(updateInterview({ id: editingInterviewId, data: payload })).unwrap();
      }
      setSubmitSuccess(true);
      dispatch(fetchInterviews());
      setModalIsOpen(false);
    } catch (error) {
      setFormError(error || 'Failed to save interview');
    }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) return;
    try {
      await dispatch(deleteInterview(id)).unwrap();
      dispatch(fetchInterviews());
    } catch (error) {
      alert(error || "Failed to delete interview.");
    }
  };

  const handleBack = () => {
    navigate('/companyDashboard');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      {/* Back */}
      <button
        onClick={handleBack}
        className="mb-6 text-indigo-600 hover:underline font-semibold focus:outline-none"
      >
        &larr; Back
      </button>

      {formError && (
        <div className="mb-4 text-red-600 font-medium">{formError}</div>
      )}
      {submitSuccess && (
        <div className="mb-4 text-indigo-600 font-medium">Interview saved successfully!</div>
      )}

      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700 border-b pb-3">
        Manage Interviews
      </h2>

      <button
        onClick={openCreateModal}
        className="mb-8 bg-indigo-600 text-white rounded px-7 py-3 font-semibold hover:bg-indigo-700 shadow transition"
      >
        Schedule New Interview
      </button>

      {isLoading && <div>Loading interviews...</div>}
      {isError && (
        <div className="text-red-600 mb-6">Error loading interviews.</div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Candidate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Job</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Date & Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companyInterviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-600">
                    No interviews scheduled.
                  </td>
                </tr>
              ) : (
                companyInterviews.map((interview) => (
                  <tr
                    key={interview._id}
                    className="hover:bg-indigo-50 cursor-pointer transition"
                    onClick={() => navigate(`/company/interview/${interview._id}`)}
                  >
                    <td className="px-6 py-4 text-gray-800">{getCandidateName(interview.candidate)}</td>
                    <td className="px-6 py-4 text-gray-700">{getJobTitle(interview.job)}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(interview.interviewDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{interview.interviewType}</td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">{interview.status}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-indigo-600 hover:underline font-semibold mr-3 focus:outline-none"
                        onClick={e => {
                          e.stopPropagation();
                          openEditModal(interview);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline font-semibold focus:outline-none"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteInterview(interview._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Schedule Interview"
        className="max-w-2xl mx-auto mt-20 bg-white opacity-100 p-6 rounded shadow-lg outline-none max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h3 className="text-xl font-semibold text-indigo-700">
            {modalMode === 'create' ? 'Schedule New Interview' : 'Edit Interview'}
          </h3>
          <button
            aria-label="Close modal"
            className="text-indigo-400 hover:text-indigo-700 text-2xl font-bold"
            onClick={() => setModalIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-indigo-900">Job</label>
            <select
              value={selectedJob}
              onChange={e => setSelectedJob(e.target.value)}
              required
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            >
              <option value="">Select Job</option>
              {jobs.filter(job => job.company === user.companyId).map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-indigo-900">Candidate</label>
            <select
              value={selectedCandidate}
              onChange={e => setSelectedCandidate(e.target.value)}
              required
              disabled={!candidates.length}
              name="candidate"
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
            >
              <option value="">Select Candidate</option>
              {candidates.map(app => (
                <option key={app.candidate._id} value={app.candidate._id}>
                  {app.candidate.name} ({app.candidate.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-indigo-900">Date & Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-indigo-900">Duration (minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              value={form.durationMinutes}
              min={1}
              onChange={handleChange}
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-indigo-900">Interview Type</label>
            <select
              name="interviewType"
              value={form.interviewType}
              onChange={handleChange}
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {form.interviewType === 'Online' && (
            <div>
              <label className="block mb-2 font-medium text-indigo-900">Meeting Link/ID</label>
              <input
                name="meetingId"
                value={form.meetingId}
                onChange={handleChange}
                className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
          )}

          {form.interviewType === 'Offline' && (
            <div>
              <label className="block mb-2 font-medium text-indigo-900">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium text-indigo-900">Interview Round</label>
            <input
              name="round"
              value={form.round}
              onChange={handleChange}
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-2 border-t">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="px-6 py-2 rounded border border-gray-300 bg-indigo-50 text-indigo-800 font-semibold hover:bg-indigo-100 transition focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white rounded px-6 py-2 font-semibold hover:bg-indigo-700 shadow focus:outline-none transition"
            >
              {modalMode === 'create' ? 'Schedule Interview' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InterviewSchedulingForm;
