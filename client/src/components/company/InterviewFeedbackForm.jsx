import { useDispatch, useSelector } from "react-redux";
import { clearInterviewError, clearSelectedInterview, clearSuccess, fetchInterviewById, selectCurrentInterview, selectInterviewError, selectInterviewLoading, updateInterview } from "../../slices/interviewSlice";
import { useEffect, useState } from "react";


const InterviewFeedbackForm = ({ interviewId }) => {
  const dispatch = useDispatch();

  // Redux state
  const interview = useSelector(selectCurrentInterview);
  const isLoading = useSelector(selectInterviewLoading);
  const isError = useSelector(selectInterviewError);

  // Local form state
  const [form, setForm] = useState({
    feedback: '',
    score: '',
    result: 'Pending',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch interview details on mount or interviewId change
  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewById(interviewId));
    }
    return () => {
      dispatch(clearSelectedInterview());
      dispatch(clearSuccess());
      dispatch(clearInterviewError());
    };
  }, [dispatch, interviewId]);

  // When interview data updates, initialize form
  useEffect(() => {
    if (interview) {
      setForm({
        feedback: interview.feedback || '',
        score: interview.score !== undefined && interview.score !== null ? interview.score : '',
        result: interview.result || 'Pending',
      });
    }
  }, [interview]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'score') {
      // Ensure score stays between 0 and 100 numeric
      const numericVal = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));
      setForm(prev => ({ ...prev, [name]: numericVal }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await dispatch(updateInterview({ id: interviewId, data: form })).unwrap();
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err || 'Failed to update interview feedback');
    }
  };

  if (isLoading) return <div>Loading interview details...</div>;
  if (isError) return <div className="text-red-600">Error loading interview details.</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Interview Feedback & Decision</h2>

      {submitError && <p className="text-red-600 mb-4">{submitError}</p>}
      {submitSuccess && <p className="text-green-600 mb-4">Feedback updated successfully!</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold" htmlFor="feedback">Feedback</label>
        <textarea
          id="feedback"
          name="feedback"
          value={form.feedback}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your feedback here"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="score">Score (0-100)</label>
        <input
          id="score"
          type="number"
          name="score"
          min={0}
          max={100}
          value={form.score}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter score"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="result">Result</label>
        <select
          id="result"
          name="result"
          value={form.result}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-6"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Selected">Selected</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default InterviewFeedbackForm;
