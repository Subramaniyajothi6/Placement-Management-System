import Modal from 'react-modal';
import { useEffect, useState } from 'react';

Modal.setAppElement('#root');

const InterviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  jobs,
  userCompanyId,
  initialData = null,
  mode,
  fetchCandidatesForJob,
  candidates,
  setCandidates,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  const [selectedJob, setSelectedJob] = useState('');
  const [form, setForm] = useState({
    startTime: '',
    durationMinutes: 30,
    interviewType: 'Online',
    platform: '',
    location: '',
    meetingId: '',
    meetingPassword: '',
    round: 'Round 1',
    interviewers: [],
    attachments: [],
    createdBy: '',
    cancelledBy: '',
    cancelReason: '',
    reminder: [],
    videoProvider: {
      providerName: '',
      externalMeetingId: '',
      webhookStatus: 'pending',
    },
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setSelectedJob(initialData.job);
      setSelectedCandidate(initialData.candidate);
      setForm({
        startTime: initialData.startTime ? new Date(initialData.startTime).toISOString().substring(0, 16) : '',
        durationMinutes: initialData.durationMinutes || 30,
        interviewType: initialData.interviewType || 'Online',
        platform: initialData.platform || '',
        location: initialData.location || '',
        meetingId: initialData.meetingId || '',
        meetingPassword: '',
        round: initialData.round || 'Round 1',
        interviewers: initialData.interviewers || [],
        attachments: initialData.attachments || [],
        createdBy: initialData.createdBy || '',
        cancelledBy: initialData.cancelledBy || '',
        cancelReason: initialData.cancelReason || '',
        reminder: initialData.reminder || [],
        videoProvider: initialData.videoProvider || {
          providerName: '',
          externalMeetingId: '',
          webhookStatus: 'pending',
        },
      });
      fetchCandidatesForJob(initialData.job);
    } else {
      setSelectedJob('');
      setSelectedCandidate('');
      setForm({
        startTime: '',
        durationMinutes: 30,
        interviewType: 'Online',
        platform: '',
        location: '',
        meetingId: '',
        meetingPassword: '',
        round: 'Round 1',
        interviewers: [],
        attachments: [],
        createdBy: '',
        cancelledBy: '',
        cancelReason: '',
        reminder: [],
        videoProvider: {
          providerName: '',
          externalMeetingId: '',
          webhookStatus: 'pending',
        },
      });
      setFormError('');
      setCandidates([]);
    }
  }, [mode, initialData, fetchCandidatesForJob, setCandidates, setSelectedCandidate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'candidate') {
      setSelectedCandidate(value);
    } else if (name === 'interviewers') {
      const values = Array.from(e.target.selectedOptions, (option) => option.value);
      setForm((prev) => ({ ...prev, interviewers: values }));
    } else if (name === 'reminderWhen') {
      // Manage single reminder input for adding reminders
      const val = Number(value);
      setForm((prev) => ({ ...prev, reminder: [{ whenMinutesBefore: val, sentAt: null }] }));
    } else if (name.startsWith('videoProvider.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        videoProvider: { ...prev.videoProvider, [key]: value },
      }));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJob(jobId);
    setSelectedCandidate('');
    fetchCandidatesForJob(jobId);
  };



  const handleSubmit = (e) => {
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
    setFormError('');
    const start = new Date(form.startTime);
    const end = new Date(start.getTime() + form.durationMinutes * 60000);
    onSubmit({
      job: selectedJob,
      candidate: selectedCandidate,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      interviewDate: start.toISOString(),
      durationMinutes: Number(form.durationMinutes),
      interviewType: form.interviewType,
      platform: form.platform || undefined,
      location: form.interviewType === 'Offline' ? form.location : '',
      meetingId: form.interviewType === 'Online' ? form.meetingId : '',
      meetingPassword: form.meetingPassword || undefined,
      round: form.round,
      interviewers: form.interviewers,
      attachments: form.attachments.length > 0 ? form.attachments : undefined,
      createdBy: form.createdBy || undefined,
      cancelledBy: form.cancelledBy || undefined,
      cancelReason: form.cancelReason || undefined,
      reminder: form.reminder.length > 0 ? form.reminder : undefined,
      videoProvider: form.videoProvider.providerName ? form.videoProvider : undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={mode === 'create' ? 'Schedule Interview' : 'Edit Interview'}
      className="max-w-4xl mx-auto mt-20 bg-white p-8 rounded shadow-lg outline-none max-h-[80vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-xl font-semibold text-indigo-700">{mode === 'create' ? 'Schedule New Interview' : 'Edit Interview'}</h3>
        <button aria-label="Close modal" className="text-indigo-400 hover:text-indigo-700 text-2xl font-bold" onClick={onClose}>
          &times;
        </button>
      </div>

      {formError && <div className="mb-4 text-red-600 font-medium">{formError}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Job</label>
          <select
            value={selectedJob}
            onChange={handleJobChange}
            required
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          >
            <option value="">Select Job</option>
            {jobs.filter((job) => job.company === userCompanyId).map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Candidate */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Candidate</label>
          <select
            value={selectedCandidate}
            onChange={handleChange}
            required
            disabled={!candidates.length}
            name="candidate"
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white"
          >
            <option value="">Select Candidate</option>
            {candidates.map((app) => (
              <option key={app.candidate._id} value={app.candidate._id}>
                {app.candidate.name} ({app.candidate.email})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
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

        {/* Duration */}
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

        {/* Interview Type */}
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

        {/* Online specific inputs */}
        {form.interviewType === 'Online' && (
          <>
            <div>
              <label className="block mb-2 font-medium text-indigo-900">Meeting Link/ID</label>
              <input
                name="meetingId"
                value={form.meetingId}
                onChange={handleChange}
                className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-indigo-900">Meeting Password</label>
              <input
                name="meetingPassword"
                type="password"
                value={form.meetingPassword}
                onChange={handleChange}
                className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
          </>
        )}

        {/* Offline specific input */}
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

        {/* Round */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Interview Round</label>
          <input
            name="round"
            value={form.round}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>

        {/* Attachments - add/remove URLs & names */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Attachments</label>
          {form.attachments.map((att, idx) => (
            <div key={idx} className="flex space-x-2 mb-2 items-center">
              <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">
                {att.name || att.url}
              </a>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    attachments: prev.attachments.filter((_, i) => i !== idx),
                  }));
                }}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <AttachmentInput onAdd={(url, name) => {
            setForm(prev => ({
              ...prev,
              attachments: [...prev.attachments, { url, name }],
            }));
          }} />
        </div>

        {/* Created By */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Created By (User ID)</label>
          <input
            name="createdBy"
            value={form.createdBy}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="User ID"
          />
        </div>

        {/* Cancelled By */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Cancelled By (User ID)</label>
          <input
            name="cancelledBy"
            value={form.cancelledBy}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="User ID"
          />
        </div>

        {/* Cancel Reason */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Cancel Reason</label>
          <input
            name="cancelReason"
            value={form.cancelReason}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Reason for cancellation"
          />
        </div>

        {/* Reminder - single input to set whenMinutesBefore */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Reminder (minutes before)</label>
          <input
            type="number"
            name="reminderWhen"
            value={form.reminder.length > 0 ? form.reminder[0].whenMinutesBefore : ''}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Minutes before interview"
            min={0}
          />
        </div>

        {/* Video Provider */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Video Provider Name</label>
          <input
            name="videoProvider.providerName"
            value={form.videoProvider.providerName}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="Provider name (e.g. Zoom)"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-indigo-900">External Meeting ID</label>
          <input
            name="videoProvider.externalMeetingId"
            value={form.videoProvider.externalMeetingId}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            placeholder="External meeting ID"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Webhook Status</label>
          <select
            name="videoProvider.webhookStatus"
            value={form.videoProvider.webhookStatus}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded border border-gray-300 bg-indigo-50 text-indigo-800 font-semibold hover:bg-indigo-100 transition focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded px-6 py-2 font-semibold hover:bg-indigo-700 shadow focus:outline-none transition"
          >
            {mode === 'create' ? 'Schedule Interview' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Simple separate component for adding attachments (url + name inputs)
function AttachmentInput({ onAdd }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const canAdd = url.trim() && name.trim();

  return (
    <div className="flex space-x-2 mb-4">
      <input
        placeholder="Attachment URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="flex-grow p-2 border rounded"
      />
      <input
        placeholder="Attachment Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="flex-grow p-2 border rounded"
      />
      <button
        type="button"
        disabled={!canAdd}
        onClick={() => {
          onAdd(url, name);
          setUrl('');
          setName('');
        }}
        className={`px-3 rounded font-semibold text-white ${canAdd ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
      >
        Add
      </button>
    </div>
  );
}

export default InterviewModal;
