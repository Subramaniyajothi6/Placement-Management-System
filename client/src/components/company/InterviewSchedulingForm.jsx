
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
    navigate('/companyDashboard');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <button onClick={handleBack} className="mb-6 text-indigo-600 hover:underline font-semibold focus:outline-none">
        &larr; Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700 border-b pb-3">Manage Interviews</h2>

      <button
        onClick={openCreateModal}
        className="mb-8 bg-indigo-600 text-white rounded px-7 py-3 font-semibold hover:bg-indigo-700 shadow transition"
      >
        Schedule New Interview
      </button>

      {isLoading && <div>Loading interviews...</div>}
      {isError && <div className="text-red-600 mb-6">Error loading interviews.</div>}

      {!isLoading && !isError && (
        <>
          <p className="mb-4 text-center text-gray-600 italic">
            Click on an interview row to view or manage detailed scheduling and feedback.
          </p>

          <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Candidate</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Job</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companyInterviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-6 text-gray-600">
                      No interviews scheduled.
                    </td>
                  </tr>
                ) : (
                  companyInterviews.map((interview) => (
                    <tr
                      key={interview._id}
                      className="hover:bg-indigo-50 cursor-pointer transition"
                      onClick={() => navigate(`/company/interview/${interview._id}`)}
                    >
                      <td className="px-6 py-4 text-gray-800">{getCandidateName(interview.candidate)}</td>
                      <td className="px-6 py-4 text-gray-700">{getJobTitle(interview.job)}</td>
                      <td className="px-6 py-4 text-gray-700">{new Date(interview.interviewDate).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{interview.interviewType}</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">{interview.status}</td>
                      <td className="px-6 py-4">
                        <button
                          className="text-indigo-600 hover:underline font-semibold mr-3 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(interview);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline font-semibold focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInterview(interview._id);
                          }}
                        >
                          Delete
                        </button>
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
  );
};

export default InterviewSchedulingForm;
