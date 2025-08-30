import { useEffect } from 'react';

import { fetchMyApplications, selectAllApplications, selectApplicationError, selectApplicationLoading } from '../../slices/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';

const statusColors = {
  Submitted: 'bg-gray-300 text-gray-800',
  'Under Review': 'bg-yellow-300 text-yellow-800',
  Shortlisted: 'bg-blue-300 text-blue-800',
  Rejected: 'bg-red-300 text-red-800',
  Hired: 'bg-green-300 text-green-800',
};

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const applications = useSelector(selectAllApplications);
const loading = useSelector(selectApplicationLoading);
const error = useSelector(selectApplicationError);

console.log('Applications:', applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      {!applications.length ? (
        <div>No applications found.</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Job/Drive</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Applied On</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {app.job?.title || 'N/A'}
                </td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded ${statusColors[app.status] || 'bg-gray-200'}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {/* Placeholder buttons for Update/Withdraw */}
                  <button className="mr-2 text-blue-600 hover:underline">Update</button>
                  <button className="text-red-600 hover:underline">Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
