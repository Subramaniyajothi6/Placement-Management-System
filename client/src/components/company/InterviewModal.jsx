import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

  // State for inline field errors
  const [fieldErrors, setFieldErrors] = useState({
    startTime: '',
    newAttachmentUrl: '',
  });

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
      setFormError('');
      setFieldErrors({ startTime: '', newAttachmentUrl: '' });
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
      setFieldErrors({ startTime: '', newAttachmentUrl: '' });
      setCandidates([]);
    }
  }, [mode, initialData, fetchCandidatesForJob, setCandidates, setSelectedCandidate]);

  // Attachment input fields state for new attachment
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');

  // Validation functions
  const validateDateTime = (value) => {
    if (!value) return 'Interview date and time is required.';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date and time format.';
    if (date < new Date()) return 'Interview date and time cannot be in the past.';
    return '';
  };

  const validateUrl = (value) => {
    if (!value.trim()) return "";
    try {
      new URL(value);
      return "";
    } catch {
      return "Invalid URL format.";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'candidate') {
      setSelectedCandidate(value);
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));

      // Inline validation for startTime
      if (name === 'startTime') {
        const error = validateDateTime(value);
        setFieldErrors((prev) => ({ ...prev, startTime: error }));
      }
    }
  };

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJob(jobId);
    setSelectedCandidate('');
    fetchCandidatesForJob(jobId);
  };

  const handleNewAttachmentUrlChange = (e) => {
    const url = e.target.value;
    setNewAttachmentUrl(url);
    const error = validateUrl(url);
    setFieldErrors((prev) => ({ ...prev, newAttachmentUrl: error }));
  };
  const handleNewAttachmentNameChange = (e) => {
    setNewAttachmentName(e.target.value);
  };

  const canAddAttachment =
    newAttachmentUrl.trim() !== '' &&
    newAttachmentName.trim() !== '' &&
    !fieldErrors.newAttachmentUrl;

  const handleAddAttachment = () => {
    if (!canAddAttachment) return;
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { url: newAttachmentUrl, name: newAttachmentName }],
    }));
    setNewAttachmentUrl('');
    setNewAttachmentName('');
    setFieldErrors((prev) => ({ ...prev, newAttachmentUrl: '' }));
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

    // Check inline validation errors first
    if (fieldErrors.startTime) {
      setFormError(fieldErrors.startTime);
      return;
    }
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
    setFieldErrors({ startTime: '', newAttachmentUrl: '' });
    setNewAttachmentUrl('');
    setNewAttachmentName('');
    onClose();
    toast.success('Interview scheduled successfully!');
  };

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm [color-scheme:dark] [&>option]:bg-[#1e293b] [&>option]:text-white";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={mode === 'create' ? 'Schedule Interview' : 'Edit Interview'}
      className="max-w-2xl mx-auto mt-16 bg-[#0f172a] border border-white/[0.08] rounded-2xl shadow-2xl outline-none max-h-[85vh] overflow-y-auto backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 p-4"
    >
      <div className="p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/[0.08]">
          <h3 className="text-lg font-bold text-white">
            {mode === 'create' ? 'Schedule New Interview' : 'Edit Interview'}
          </h3>
          <button
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] text-xl font-bold transition"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {formError && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Job</label>
            <select value={selectedJob} onChange={handleJobChange} required className={inputClass}>
              <option value="">Select Job</option>
              {jobs.filter((job) => job.company === userCompanyId).map((job) => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Candidate</label>
            <select value={selectedCandidate} onChange={handleChange} required disabled={!candidates.length} name="candidate" className={inputClass}>
              <option value="">{candidates.length ? 'Select Candidate' : 'Select a job first'}</option>
              {candidates.map((app, index) => (
                <option key={app.candidate._id + '-' + index} value={app.candidate._id}>
                  {app.candidate.name} ({app.candidate.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Date & Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className={`${inputClass} ${fieldErrors.startTime ? 'border-red-500/50 focus:ring-red-500/40' : ''}`}
            />
            {fieldErrors.startTime && <p className="text-red-400 text-xs mt-1">{fieldErrors.startTime}</p>}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Duration (minutes)</label>
            <input type="number" name="durationMinutes" value={form.durationMinutes} min={1} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Interview Type</label>
            <select name="interviewType" value={form.interviewType} onChange={handleChange} className={inputClass}>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {(form.interviewType === 'Offline' || form.interviewType === 'Hybrid') && (
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-300">Location</label>
              <input name="location" value={form.location} onChange={handleChange} required className={inputClass} placeholder="Enter interview location" />
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Attachments</label>

            {form.attachments.length > 0 && (
              <div className="mb-3 space-y-2">
                {form.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm flex-1 truncate">
                      {att.name || att.url}
                    </a>
                    <button type="button" onClick={() => handleRemoveAttachment(idx)} className="text-red-400 hover:text-red-300 text-xs font-medium flex-shrink-0">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block mb-1.5 text-xs text-gray-400">URL</label>
                <input
                  placeholder="https://example.com/file.pdf"
                  value={newAttachmentUrl}
                  onChange={handleNewAttachmentUrlChange}
                  className={`${inputClass} ${fieldErrors.newAttachmentUrl ? 'border-red-500/50 focus:ring-red-500/40' : ''}`}
                />
                {fieldErrors.newAttachmentUrl && <p className="text-red-400 text-xs mt-1">{fieldErrors.newAttachmentUrl}</p>}
              </div>
              <div>
                <label className="block mb-1.5 text-xs text-gray-400">File Name</label>
                <input
                  placeholder="e.g. Job Description PDF"
                  value={newAttachmentName}
                  onChange={handleNewAttachmentNameChange}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                disabled={!canAddAttachment}
                onClick={handleAddAttachment}
                className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Add Attachment
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Reminder (minutes before)</label>
            <input
              type="number" min={0}
              value={form.reminder.length > 0 ? form.reminder[0].whenMinutesBefore : ''}
              onChange={handleReminderChange}
              placeholder="e.g. 30"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">Interview Round</label>
            <input name="round" value={form.round} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/[0.06] transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40">
              {mode === 'create' ? 'Schedule Interview' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InterviewModal;
