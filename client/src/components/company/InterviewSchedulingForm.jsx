
import { useDispatch, useSelector } from 'react-redux';
import {
  createInterview,
  deleteInterview,
  fetchInterviews,
  selectAllInterviews,
  selectInterviewError,
  selectInterviewLoading,
  updateInterview,
} from '../../slices/interviewSlice';
import { fetchJobs, selectJobs } from '../../slices/jobSlice';
import { fetchUsers, selectUsers } from '../../slices/authSlice';
import { useEffect, useState, useCallback } from 'react';
import InterviewModal from './InterviewModal';
import { useNavigate } from 'react-router';
import applicationApi from '../../api/applicationsApi';
import toast from 'react-hot-toast';

const InterviewSchedulingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const interviews = useSelector(selectAllInterviews);
  const isLoading = useSelector(selectInterviewLoading);
  const isError = useSelector(selectInterviewError);
  const jobs = useSelector(selectJobs);
  const user = useSelector((state) => state.auth.user);
  const users = useSelector(selectUsers);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchInterviews());
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredJobsId =
    jobs?.filter((job) => job.company === user.companyId).map((job) => job._id) || [];
  const companyInterviews = interviews?.filter((iv) => filteredJobsId.includes(iv.job)) || [];

  const getCandidateName = (candidateId) => {
    const candidate = users.find((u) => u._id === candidateId);
    return candidate ? candidate.name : 'N/A';
  };

  const getJobTitle = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    return job ? job.title : 'N/A';
  };

  const fetchCandidatesForJob = useCallback(
    (jobId) => {
      if (!jobId) {
        setCandidates([]);
        setSelectedCandidate('');
        return;
      }
      applicationApi
        .getCompanyApplications({ jobId, status: 'Shortlisted' })
        .then((res) => setCandidates(res.data.data))
        .catch(() => setCandidates([]));
    },
    []
  );

  const openCreateModal = () => {
    setModalMode('create');
    setEditingInterviewId(null);
    setSelectedCandidate('');
    setCandidates([]);
    setModalIsOpen(true);
  };

  const openEditModal = (interview) => {
    setModalMode('edit');
    setEditingInterviewId(interview._id);
    setSelectedCandidate(interview.candidate);
    fetchCandidatesForJob(interview.job);
    setModalIsOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (modalMode === 'create') {
        await dispatch(createInterview(data)).unwrap();
      } else if (modalMode === 'edit' && editingInterviewId) {
        await dispatch(updateInterview({ id: editingInterviewId, data })).unwrap();
      }
      dispatch(fetchInterviews());
      setModalIsOpen(false);
    } catch (error) {
      toast.error(error || 'Failed to save interview');
    }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;
    try {
      await dispatch(deleteInterview(id)).unwrap();
      dispatch(fetchInterviews());
    } catch (error) {
      toast.error(error || 'Failed to delete interview.');
    }
  };

  const handleBack = () => {
    navigate('/companydashboard');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          &larr; Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Manage Interviews</h2>
            <p className="text-gray-400 text-sm mt-1">Schedule and track all interviews</p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
          >
            + Schedule Interview
          </button>
        </div>

        {isLoading && <p className="text-center text-gray-400 text-sm py-10">Loading interviews...</p>}
        {isError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            Error loading interviews.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <p className="mb-4 text-center text-gray-500 text-sm italic">
              Click on a row to view or manage detailed scheduling and feedback.
            </p>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
              <table className="min-w-full divide-y divide-white/[0.06]">
                <thead className="bg-[#1e293b]">
                  <tr>
                    {["Candidate", "Job", "Date & Time", "Type", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {companyInterviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-6 text-gray-500 text-sm">No interviews scheduled.</td>
                    </tr>
                  ) : (
                    companyInterviews.map((interview) => (
                      <tr
                        key={interview._id}
                        className="hover:bg-white/[0.04] cursor-pointer transition"
                        onClick={() => navigate(`/company/interview/${interview._id}`)}
                      >
                        <td className="px-6 py-4 text-gray-200 text-sm">{getCandidateName(interview.candidate)}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{getJobTitle(interview.job)}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{new Date(interview.interviewDate).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-300 text-sm">{interview.interviewType}</td>
                        <td className="px-6 py-4 text-gray-200 text-sm font-semibold">{interview.status}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-500/30 transition"
                              onClick={(e) => { e.stopPropagation(); openEditModal(interview); }}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition"
                              onClick={(e) => { e.stopPropagation(); handleDeleteInterview(interview._id); }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

      <InterviewModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSubmit={handleSubmit}
        jobs={jobs}
        userCompanyId={user.companyId}
        initialData={modalMode === 'edit' ? companyInterviews.find((iv) => iv._id === editingInterviewId) : null}
        mode={modalMode}
        fetchCandidatesForJob={fetchCandidatesForJob}
        candidates={candidates}
        setCandidates={setCandidates}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        user={user}
      />
      </div>
    </div>
  );
};

export default InterviewSchedulingForm;
