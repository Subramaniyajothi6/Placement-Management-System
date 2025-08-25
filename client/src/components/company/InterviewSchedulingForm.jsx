import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyInterviews, selectAllInterviews, selectInterviewError, selectInterviewLoading } from '../../slices/interviewSlice';

const InterviewSchedulingForm = () => {
  const dispatch = useDispatch();
  const interviews = useSelector(selectAllInterviews);
  const isLoading = useSelector(selectInterviewLoading);
  const isError = useSelector(selectInterviewError);

  useEffect(() => {
    dispatch(fetchCompanyInterviews());
  }, [dispatch]);

  if (isLoading) return <div>Loading interviews...</div>;
  if (isError) return <div>Error loading interviews.</div>;
    
  return (
    <div>
      <h2>Scheduled Interviews</h2>
      <table className="w-full border-collapse border border-gray-300">
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
            <tr><td colSpan="5" className="text-center p-4">No interviews scheduled.</td></tr>
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
    </div>
  )
}

export default InterviewSchedulingForm