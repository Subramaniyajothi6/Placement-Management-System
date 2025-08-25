import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';  // Import react-modal
import { useDispatch, useSelector } from 'react-redux';
import { createInterview, fetchCompanyInterviews, selectAllInterviews, selectInterviewError, selectInterviewLoading } from '../../slices/interviewSlice';
import { fetchJobs, selectJobs } from '../../slices/jobSlice';
import applicationApi from '../../api/applicationsApi';

// Set app element for accessibility
Modal.setAppElement('#root');

const InterviewSchedulingForm = () => {
    const dispatch = useDispatch();

    // Redux state
    const interviews = useSelector(selectAllInterviews);
    const isLoading = useSelector(selectInterviewLoading);
    const isError = useSelector(selectInterviewError);
    const jobs = useSelector(selectJobs);

    // Local state for modal visibility
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Other local states same as before
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

    // Fetch jobs and interviews on mount
    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchCompanyInterviews());
    }, [dispatch]);

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
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit interview
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

        setFormError('');
        const payload = {
            job: selectedJob,
            candidate: selectedCandidate,
            startTime: form.startTime,
            endTime: form.startTime ? new Date(new Date(form.startTime).getTime() + form.durationMinutes * 60000) : undefined,
            interviewDate: form.startTime,
            durationMinutes: form.durationMinutes,
            interviewType: form.interviewType,
            location: form.interviewType === 'Offline' ? form.location : '',
            meetingId: form.interviewType === 'Online' ? form.meetingId : '',
            round: form.round,
        };

        try {
            await dispatch(createInterview(payload)).unwrap();
            setSubmitSuccess(true);
            dispatch(fetchCompanyInterviews());
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
            setCandidates([]);
            setModalIsOpen(false); // Close modal on success
        } catch (error) {
            setFormError(error || 'Failed to create interview');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Manage Interviews</h2>

            <button
                onClick={() => setModalIsOpen(true)}
                className="mb-6 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
                Schedule New Interview
            </button>

            {/* Interviews Table... (same as before) */}
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
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-4">No interviews scheduled.</td>
                            </tr>
                        ) : (
                            interviews.map((interview) => (
                                <tr key={interview._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2">{interview.candidate?.name || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{interview.job?.title || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{new Date(interview.interviewDate).toLocaleString()}</td>
                                    <td className="border border-gray-300 p-2">{interview.interviewType}</td>
                                    <td className="border border-gray-300 p-2">{interview.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal Form */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Schedule Interview"
                // Set max height and enable scroll inside modal content
                className="max-w-3xl mx-auto mt-20 bg-white  opacity-100 p-6 rounded shadow-lg outline-none max-h-[80vh] overflow-y-auto"
                // Slightly transparent black overlay
                overlayClassName="fixed inset-0 bg-black opacity-98 flex justify-center items-start"
            >
                <div className="flex gap-4 items-center mb-4 ">
                    <h3 className="text-xl font-semibold ">Schedule New Interview</h3>
                    <button className='btn bg-red-400  py-0.75 px-3 rounded-full hover:bg-red-600' onClick={() => setModalIsOpen(false)}>X</button>
                </div>
                {formError && <div className="text-red-600 mb-4">{formError}</div>}
                {submitSuccess && <div className="text-green-600 mb-4">Interview scheduled successfully!</div>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">Job</label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                        required
                    >
                        <option value="">Select Job</option>
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>{job.title}</option>
                        ))}
                    </select>

                    <label className="block mb-2">Candidate</label>
                    <select
                        name="candidate"
                        value={selectedCandidate}
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                        required
                        disabled={!candidates.length}
                    >
                        <option value="">Select Candidate</option>
                        {candidates.map((app) => (
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
                            Schedule Interview
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InterviewSchedulingForm;
