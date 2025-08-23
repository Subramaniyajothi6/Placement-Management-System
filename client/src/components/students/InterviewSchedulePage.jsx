import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyInterviews, selectInterviewError, selectInterviewLoading, selectInterviewsByStudent } from '../../slices/interviewSlice';

const InterviewSchedulePage = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.user?._id);
    const interviews = useSelector((state) => selectInterviewsByStudent(state, userId));
    const isLoading = useSelector(selectInterviewLoading);
    const isError = useSelector(selectInterviewError);
    useEffect(() => {
        console.log('User ID:', userId);
        if (userId) {
            dispatch(fetchMyInterviews())
        }
    }, [dispatch, userId])
    if (isLoading) return <div> Loading Interview...........</div>
    if (isError) return <div className="text-red-600">Error: {isError}</div>;
    if (!interviews.length) return <div>No interviews Scheduled.</div>;
    return (
        <>
            <div className="max-w-4xl mx-auto p-4">

                <h2 className="text-2xl font-bold mb-4">My Interview Schedule</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Job/Drive</th>
                            <th className="border border-gray-300 p-2 text-left">Date & Time</th>
                            <th className="border border-gray-300 p-2 text-left">Location / Link</th>
                            <th className="border border-gray-300 p-2 text-left">Interviewer</th>
                            <th className="border border-gray-300 p-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.map(({ _id, job, interviewDate, location, interviewers, interviewType, meetingId, status }) => (
                            <tr key={_id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-2">{job?.title || 'N/A'}</td>
                                <td className="border border-gray-300 p-2">
                                    {new Date(interviewDate).toLocaleString()}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {interviewType === 'Online' ? (
                                        <a href={`https://zoom.us/j/${meetingId}`} target="_blank" rel="noreferrer">Zoom Link</a>
                                    ) : (
                                        location || 'N/A'
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {interviewers?.length ? `${interviewers.length} Interviewer(s)` : 'N/A'}
                                </td>
                                <td className={`border border-gray-300 p-2 font-semibold ${status === 'Scheduled' ? 'text-blue-700' :
                                        status === 'Completed' ? 'text-green-700' :
                                            status === 'Pending' ? 'text-yellow-700' : 'text-gray-700'
                                    }`}>
                                    {status}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>


            </div>

        </>
    )
}

export default InterviewSchedulePage