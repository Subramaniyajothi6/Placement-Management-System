import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { useEffect, useState } from "react";
import { fetchInterviewById, selectInterviewError, selectInterviewLoading, updateInterview } from "../../slices/interviewSlice";

const resultOptions = ['Pending', 'Shortlisted', 'Rejected', 'Selected'];

const InterviewDetailPage = () => {
    const { interviewId: id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const interview = useSelector(state => state.interview.interview);
    const loading = useSelector(selectInterviewLoading);
    const error = useSelector(selectInterviewError);

    // Local state for inline editable fields
    const [editState, setEditState] = useState({
        result: '',
        score: '',
        feedback: ''
    });

    // Sync local state with loaded interview
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
        }
    }, [interview]);

    // Field change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save handler
    const handleSave = () => {
        dispatch(updateInterview({
            id,
            data: {
                result: editState.result,
                score: editState.result === 'Shortlisted' ? null : Number(editState.score),
                feedback: editState.result === 'Shortlisted' ? null : editState.feedback,
                emailType: editState.result === 'Pending' ? 'schedule' : 'result'
            },
        }));
    };

    if (loading) return <div>Loading interview...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!interview) return <div>Interview not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Interview Detail</h2>
            <div className="mb-3"><b>Candidate:</b> {interview.candidate?.name || interview.candidate}</div>
            <div className="mb-3"><b>Job:</b> {interview.job?.title || interview.job}</div>
            <div className="mb-3"><b>Date & Time:</b> {new Date(interview.interviewDate).toLocaleString()}</div>
            <div className="mb-3"><b>Duration:</b> {interview.durationMinutes} min</div>
            <div className="mb-3"><b>Type:</b> {interview.interviewType}</div>
            <div className="mb-3"><b>Status:</b> {interview.status}</div>
            <div className="mb-3"><b>Round:</b> {interview.round}</div>

            {/* Editable Fields */}
            <div className="mb-3">
                <b>Result:</b>
                <select
                    name="result"
                    className="ml-2 p-1 border rounded"
                    value={editState.result}
                    onChange={handleChange}
                >
                    {resultOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <b>Score:</b>
                <input
                    name="score"
                    type="number"
                    min="0"
                    max="100"
                    className="ml-2 border rounded p-1 w-24"
                    value={editState.score}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <b>Feedback:</b>
                <textarea
                    name="feedback"
                    className="ml-2 border rounded p-1 w-full"
                    rows={3}
                    value={editState.feedback}
                    onChange={handleChange}
                />
            </div>

            <button
                disabled={loading}
                className={`mt-4 px-4 py-2 rounded mr-2 text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                onClick={handleSave}
            >
                Save Changes
            </button>

            <button className={` mt-4 px-4 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`} onClick={() => navigate(`/company/interview/interviewFeedback/${id}`)} > Send FeedBack</button>
            {/* Render more details as needed */}
        </div>
    );
};

export default InterviewDetailPage;
