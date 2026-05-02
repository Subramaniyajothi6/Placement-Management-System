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

    if (loading) return <div className="text-center py-12 text-gray-400 text-sm">Loading interview details...</div>;
    if (error) return <div className="text-center py-12 text-red-400 text-sm font-semibold">{error}</div>;
    if (!interview) return <div className="text-center py-12 text-gray-400 text-sm">Interview not found.</div>;

    const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm";

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                aria-label="Go back"
            >
                <FaArrowLeft className="text-xs" /> Back
            </button>

            <h1 className="text-2xl font-black mb-8 text-white border-b border-white/[0.08] pb-4">Interview Details</h1>

            <section className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6 space-y-3 mb-6 text-sm">
                {[
                  { icon: FaUserCheck, label: "Candidate", value: interview.candidate?.name || interview.candidate || 'N/A' },
                  { icon: FaClipboardList, label: "Job", value: interview.job?.title || interview.job || 'N/A' },
                  { icon: FaCalendarAlt, label: "Date & Time", value: new Date(interview.interviewDate).toLocaleString() },
                  { icon: FaClock, label: "Duration", value: `${interview.durationMinutes} minutes` },
                  { icon: FaClipboardList, label: "Type", value: interview.interviewType },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="text-indigo-400 text-xs flex-shrink-0" />
                    <span className="text-gray-400 font-medium w-28 flex-shrink-0">{label}:</span>
                    <span className="text-gray-200">{value}</span>
                  </div>
                ))}
                <div className="flex gap-3"><span className="text-gray-400 font-medium w-28 flex-shrink-0 pl-5">Status:</span><span className="text-gray-200">{interview.status}</span></div>
                <div className="flex gap-3"><span className="text-gray-400 font-medium w-28 flex-shrink-0 pl-5">Round:</span><span className="text-gray-200">{interview.round}</span></div>
            </section>

            <section className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6">
                <h2 className="text-base font-bold mb-5 text-white">Update Interview Result</h2>

                <div className="mb-4">
                    <label htmlFor="result" className="block mb-1.5 text-sm font-medium text-gray-300">Result</label>
                    <select id="result" name="result" value={editState.result} onChange={handleChange} className={`${inputClass} [&>option]:bg-[#1e293b] [&>option]:text-white`}>
                        {resultOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="score" className="block mb-1.5 text-sm font-medium text-gray-300">Score</label>
                    <input id="score" name="score" type="number" min="0" max="100" value={editState.score} onChange={handleChange} className="w-32 p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm" placeholder="0-100" />
                </div>

                <div className="mb-5">
                    <label htmlFor="feedback" className="block mb-1.5 text-sm font-medium text-gray-300">Feedback</label>
                    <textarea id="feedback" name="feedback" rows={4} value={editState.feedback} onChange={handleChange} className={`${inputClass} resize-y`} placeholder="Enter feedback" />
                </div>

                {successMessage && (
                    <p className={`mb-4 text-sm font-medium ${successMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                        {successMessage}
                    </p>
                )}

                <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-900/40">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => navigate(`/company/interview/interviewFeedback/${id}`)} disabled={saving} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-violet-900/40">
                        Send Feedback
                    </button>
                </div>
            </section>
          </div>
        </div>
    );
};

export default InterviewDetailPage;
