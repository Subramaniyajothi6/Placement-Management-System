
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { createInterview, deleteInterview, fetchInterviews, selectAllInterviews, selectInterviewError, selectInterviewLoading, updateInterview } from '../../slices/interviewSlice';
import { fetchJobs, selectJobs } from '../../slices/jobSlice';
import { fetchUsers, selectUsers } from '../../slices/authSlice';
import { useEffect, useState } from 'react';
import applicationApi from '../../api/applicationsApi';
import {  useNavigate } from 'react-router';


Modal.setAppElement('#root');

const InterviewSchedulingForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const interviews = useSelector(selectAllInterviews);
    const isLoading = useSelector(selectInterviewLoading);
    const isError = useSelector(selectInterviewError);
    const jobs = useSelector(selectJobs);
    const user = useSelector((state) => state.auth.user);
    const users = useSelector(selectUsers);

    // Modal visibility + mode ('create' or 'edit') + interview being edited
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingInterviewId, setEditingInterviewId] = useState(null);

    // Form state
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

    // Fetch all data on mount
    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchInterviews());
        dispatch(fetchUsers());
    }, [dispatch]);

    // Filter job IDs for this company
    const filteredJobsId =
        jobs?.filter(job => job.company === user.companyId).map(job => job._id) || [];

    // Filter interviews for this company's jobs
    const companyInterviews =
        interviews?.filter(iv => filteredJobsId.includes(iv.job)) || [];

    // Helpers to map IDs to names/titles
    const getCandidateName = (candidateId) => {
        const candidate = users.find(u => u._id === candidateId);
        return candidate ? candidate.name : "N/A";
    };

    const getJobTitle = (jobId) => {
        const job = jobs.find(j => j._id === jobId);
        return job ? job.title : "N/A";
    };

    // Fetch shortlisted candidates on job change
    useEffect(() => {
        if (selectedJob) {
            applicationApi
                .getCompanyApplications({ jobId: selectedJob, status: 'Shortlisted' })
                .then((res) => setCandidates(res.data.data))
                .catch(() => setCandidates([]));
        } else {
            setCandidates([]);
            setSelectedCandidate('');
        }
    }, [selectedJob]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "candidate") setSelectedCandidate(value);
        else setForm(prev => ({ ...prev, [name]: value }));
    };

    // Open modal for creating new interview
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

    // Open modal for editing existing interview
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

        // Fetch shortlisted candidates for that job
        if (interview.job) {
            applicationApi
                .getCompanyApplications({ jobId: interview.job, status: 'Shortlisted' })
                .then((res) => setCandidates(res.data.data))
                .catch(() => setCandidates([]));
        } else {
            setCandidates([]);
        }
        setModalIsOpen(true);
    };


    // Submit form for create or update
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
            startTime: start.toISOString(),  // convert to ISO format with timezone
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
            dispatch(fetchInterviews()); // Refresh interviews list
            setModalIsOpen(false);
        } catch (error) {
            setFormError(error || 'Failed to save interview');
        }
    };

    // Delete interview handler
    const handleDeleteInterview = async (id) => {
        if (!window.confirm("Are you sure you want to delete this interview?")) return;
        try {
            await dispatch(deleteInterview(id)).unwrap();
            dispatch(fetchInterviews());
        } catch (error) {
            alert(error || "Failed to delete interview.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
            {formError && <div className="text-red-600 mb-4">{formError}</div>}
            {formError && alert(formError)}
            <h2 className="text-2xl font-bold mb-6">Manage Interviews</h2>

            <button
                onClick={openCreateModal}
                className="mb-6 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
                Schedule New Interview
            </button>

            {isLoading && <div>Loading interviews...</div>}
            {isError && <div className="text-red-600">Error loading interviews.</div>}

            {!isLoading && !isError && (
                <table className="w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Candidate</th>
                            <th className="border border-gray-300 p-2 text-left">Job</th>
                            <th className="border border-gray-300 p-2 text-left">Date & Time</th>
                            <th className="border border-gray-300 p-2 text-left">Type</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                            <th className="border border-gray-300 p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyInterviews.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-4">No interviews scheduled.</td>
                            </tr>
                        ) : (
                            companyInterviews.map((interview) => (
                                
                                <tr key={interview._id} className="hover:bg-gray-50"  onClick={()=>{navigate(`/company/interview/${interview._id}`)}} >
                                    <td className="border border-gray-300 p-2">{getCandidateName(interview.candidate)}</td>
                                    <td className="border border-gray-300 p-2">{getJobTitle(interview.job)}</td>
                                    <td className="border border-gray-300 p-2">{new Date(interview.interviewDate).toLocaleString()}</td>
                                    <td className="border border-gray-300 p-2">{interview.interviewType}</td>
                                    <td className="border border-gray-300 p-2">{interview.status}</td>
                                    <td className="border border-gray-300 p-2 space-x-2">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => openEditModal(interview)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDeleteInterview(interview._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal Form for Create / Edit */}
            <Modal isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Schedule Interview"
                className="max-w-3xl mx-auto mt-20 bg-white opacity-100 p-6 rounded shadow-lg outline-none max-h-[80vh] overflow-y-auto"
                overlayClassName="fixed inset-0 bg-black opacity-98 flex justify-center items-start"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                        {modalMode === 'create' ? 'Schedule New Interview' : 'Edit Interview'}
                    </h3>
                    <button
                        className="btn bg-red-400 py-0.75 px-3 rounded-full hover:bg-red-600"
                        onClick={() => setModalIsOpen(false)}
                    >
                        X
                    </button>
                </div>


                {submitSuccess && <div className="text-green-600 mb-4">Interview saved successfully!</div>}

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">Job</label>
                    <select
                        value={selectedJob}
                        onChange={e => setSelectedJob(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                        required
                    >
                        <option value="">Select Job</option>
                        {jobs.filter(job => job.company === user.companyId).map(job => (
                            <option key={job._id} value={job._id}>{job.title}</option>
                        ))}
                    </select>

                    <label className="block mb-2">Candidate</label>
                    <select
                        value={selectedCandidate}
                        onChange={e => setSelectedCandidate(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        disabled={!candidates.length}
                        name="candidate"
                    >
                        <option value="">Select Candidate</option>
                        {candidates.map(app => (
                            <option key={app.candidate._id} value={app.candidate._id}>
                                {app.candidate.name} ({app.candidate.email})
                            </option>
                        ))}
                    </select>

                    <label className="block mb-2">Date & Time</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                        required
                    />

                    <label className="block mb-2">Duration (minutes)</label>
                    <input
                        type="number"
                        name="durationMinutes"
                        value={form.durationMinutes}
                        min={1}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                    />

                    <label className="block mb-2">Interview Type</label>
                    <select
                        name="interviewType"
                        value={form.interviewType}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                    >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>

                    {form.interviewType === 'Online' && (
                        <>
                            <label className="block mb-2">Meeting Link/ID</label>
                            <input
                                name="meetingId"
                                value={form.meetingId}
                                onChange={handleChange}
                                className="mb-4 p-2 border rounded w-full"
                            />
                        </>
                    )}

                    {form.interviewType === 'Offline' && (
                        <>
                            <label className="block mb-2">Location</label>
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className="mb-4 p-2 border rounded w-full"
                            />
                        </>
                    )}

                    <label className="block mb-2">Interview Round</label>
                    <input
                        name="round"
                        value={form.round}
                        onChange={handleChange}
                        className="mb-4 p-2 border rounded w-full"
                    />

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setModalIsOpen(false)}
                            className="px-4 py-2 rounded border border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
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
