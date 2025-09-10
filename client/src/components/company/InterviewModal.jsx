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
  setCandidates = () => { },
  selectedCandidate,
  setSelectedCandidate,
  user,
}) => {
  const [selectedJob, setSelectedJob] = useState('');
  const [form, setForm] = useState({
    startTime: '',
    durationMinutes: 30,
    interviewType: 'Online',
    location: '',
    round: 'Round 1',
    attachments: [],
    reminder: [],
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
        location: initialData.location || '',
        round: initialData.round || 'Round 1',
        attachments: initialData.attachments || [],
        reminder: initialData.reminder || [],
      });
      fetchCandidatesForJob(initialData.job);
    } else {
      setSelectedJob('');
      setSelectedCandidate('');
      setForm({
        startTime: '',
        durationMinutes: 30,
        interviewType: 'Online',
        location: '',
        round: 'Round 1',
        attachments: [],
        reminder: [],
      });
      setFormError('');
      setCandidates([]);
    }
  }, [mode, initialData, fetchCandidatesForJob, setCandidates, setSelectedCandidate]);

  // Attachment input fields state for new attachment
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const canAddAttachment = newAttachmentUrl.trim() !== '' && newAttachmentName.trim() !== '';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'candidate') {
      setSelectedCandidate(value);
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

  const handleAddAttachment = () => {
    if (!canAddAttachment) return;
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { url: newAttachmentUrl, name: newAttachmentName }],
    }));
    setNewAttachmentUrl('');
    setNewAttachmentName('');
  };

  const handleRemoveAttachment = (index) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleReminderChange = (e) => {
    const val = Number(e.target.value);
    if (isNaN(val) || val < 0) return;
    setForm((prev) => ({
      ...prev,
      reminder: val ? [{ whenMinutesBefore: val, sentAt: null }] : [],
    }));
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
    if ((form.interviewType === 'Offline' || form.interviewType === 'Hybrid') && !form.location.trim()) {
      setFormError('Please enter the interview location.');
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
      location: form.interviewType === 'Offline' || form.interviewType === 'Hybrid' ? form.location : '',
      round: form.round,
      attachments: form.attachments.length ? form.attachments : undefined,
      reminder: form.reminder.length ? form.reminder : undefined,
      interviewers: user._id,
    });

    setSelectedJob('');
    setSelectedCandidate('');
    setForm({
      startTime: '',
      durationMinutes: 30,
      interviewType: 'Online',
      location: '',
      round: 'Round 1',
      attachments: [],
      reminder: [],
    });
    setFormError('');
    onClose();
    alert('Interview scheduled successfully!');
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
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
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
            {candidates.map((app, index) => (
              <option key={app.candidate._id + '-' + index} value={app.candidate._id}>
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

        {/* Offline or Hybrid: Location Input */}
        {(form.interviewType === 'Offline' || form.interviewType === 'Hybrid') && (
          <div>
            <label className="block mb-2 font-medium text-indigo-900">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          </div>
        )}

        {/* Attachments */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Attachments</label>
          {form.attachments.map((att, idx) => (
            <div key={idx} className="flex space-x-2 mb-2 items-center">
              <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">
                {att.name || att.url}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(idx)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex space-x-2 mb-4">
            <input
              placeholder="Attachment URL"
              value={newAttachmentUrl}
              onChange={(e) => setNewAttachmentUrl(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <input
              placeholder="Attachment Name"
              value={newAttachmentName}
              onChange={(e) => setNewAttachmentName(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button
              type="button"
              disabled={!canAddAttachment}
              onClick={handleAddAttachment}
              className={`px-3 rounded font-semibold text-white ${canAddAttachment ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
            >
              Add
            </button>
          </div>
        </div>

        {/* Reminder (minutes before) */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Reminder (minutes before)</label>
          <input
            type="number"
            min={0}
            value={form.reminder.length > 0 ? form.reminder[0].whenMinutesBefore : ''}
            onChange={handleReminderChange}
            placeholder="Minutes before interview"
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>

        {/* Interview Round */}
        <div>
          <label className="block mb-2 font-medium text-indigo-900">Interview Round</label>
          <input
            name="round"
            value={form.round}
            onChange={handleChange}
            className="p-3 border rounded w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>

        {/* Submit and Cancel buttons */}
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

export default InterviewModal;
