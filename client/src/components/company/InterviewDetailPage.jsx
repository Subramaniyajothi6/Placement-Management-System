import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
    fetchInterviewById,
    selectInterviewError,
    selectInterviewLoading,
    updateInterview,
} from "../../slices/interviewSlice";
import { FaArrowLeft, FaUserCheck, FaCalendarAlt, FaClock, FaClipboardList } from "react-icons/fa";

const resultOptions = ['Pending', 'Shortlisted', 'Rejected', 'Selected'];

const InterviewDetailPage = () => {
    const { interviewId: id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const interview = useSelector(state => state.interview.interview);
    const loading = useSelector(selectInterviewLoading);
    const error = useSelector(selectInterviewError);

    const [editState, setEditState] = useState({
        result: '',
        score: '',
        feedback: ''
    });
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        dispatch(fetchInterviewById(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (interview) {
            setEditState({
                result: interview.result || '',
                score: interview.score || '',
                feedback: interview.feedback || ''
            });
            setSuccessMessage(null);
        }
    }, [interview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditState(prev => ({
            ...prev,
            [name]: value
        }));
        setSuccessMessage(null);
    };

    const handleSave = async () => {
        if (!interview) return;
        setSaving(true);
        try {
            await dispatch(updateInterview({
                id,
                data: {
                    result: editState.result,
                    score: editState.result === 'Shortlisted' ? null : Number(editState.score),
                    feedback: editState.result === 'Shortlisted' ? null : editState.feedback,
                    emailType: editState.result === 'Pending' ? 'schedule' : 'result'
                },
            })).unwrap();
            setSuccessMessage("Interview details updated successfully.");
        } catch {
            setSuccessMessage("Failed to update interview details.");
        }
        setSaving(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) return <div className="text-center py-12 text-indigo-600 font-medium">Loading interview details...</div>;
    if (error) return <div className="text-center py-12 text-red-600 font-semibold">{error}</div>;
    if (!interview) return <div className="text-center py-12 text-indigo-600 font-medium">Interview not found.</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
            {/* Back button */}
            <button
                onClick={handleBack}
                className="inline-flex items-center mb-6 text-indigo-600 font-semibold hover:text-indigo-800 focus:outline-none transition-colors duration-200"
                aria-label="Go back"
            >
                <FaArrowLeft className="mr-2 text-lg" /> Back
            </button>

            <h1 className="text-3xl font-extrabold mb-8 text-indigo-900 border-b border-indigo-300 pb-3">Interview Details</h1>

            <section className="space-y-5 text-indigo-800 mb-8">
                <div className="flex items-center space-x-3">
                    <FaUserCheck className="text-indigo-600" />
                    <span className="font-semibold">Candidate:</span>
                    <span>{interview.candidate?.name || interview.candidate || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaClipboardList className="text-indigo-600" />
                    <span className="font-semibold">Job:</span>
                    <span>{interview.job?.title || interview.job || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-indigo-600" />
                    <span className="font-semibold">Date & Time:</span>
                    <span>{new Date(interview.interviewDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaClock className="text-indigo-600" />
                    <span className="font-semibold">Duration:</span>
                    <span>{interview.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaClipboardList className="text-indigo-600" />
                    <span className="font-semibold">Type:</span>
                    <span>{interview.interviewType}</span>
                </div>
                <div>
                    <span className="font-semibold">Status:</span> {interview.status}
                </div>
                <div>
                    <span className="font-semibold">Round:</span> {interview.round}
                </div>
            </section>

            <section className="bg-indigo-50 p-6 rounded-md border border-indigo-300 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-indigo-900">Update Interview Result</h2>

                <div className="mb-5">
                    <label htmlFor="result" className="block mb-2 font-semibold text-indigo-900">Result:</label>
                    <select
                        id="result"
                        name="result"
                        value={editState.result}
                        onChange={handleChange}
                        className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        {resultOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-5">
                    <label htmlFor="score" className="block mb-2 font-semibold text-indigo-900">Score:</label>
                    <input
                        id="score"
                        name="score"
                        type="number"
                        min="0"
                        max="100"
                        value={editState.score}
                        onChange={handleChange}
                        className="w-32 p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="0-100"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="feedback" className="block mb-2 font-semibold text-indigo-900">Feedback:</label>
                    <textarea
                        id="feedback"
                        name="feedback"
                        rows={4}
                        value={editState.feedback}
                        onChange={handleChange}
                        className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Enter feedback"
                    />
                </div>

                {successMessage && (
                    <p className={`mb-4 font-semibold ${successMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                        {successMessage}
                    </p>
                )}

                <div className="flex space-x-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-8 py-3 rounded-md text-white font-semibold transition-transform duration-150
                            ${saving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'}`}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        onClick={() => navigate(`/company/interview/interviewFeedback/${id}`)}
                        disabled={saving}
                        className={`px-8 py-3 rounded-md text-white font-semibold transition-transform duration-150
                            ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'}`}
                    >
                        Send Feedback
                    </button>
                </div>
            </section>
        </div>
    );
};

export default InterviewDetailPage;
