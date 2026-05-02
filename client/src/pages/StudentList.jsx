import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchUsers, selectUsers } from "../slices/authSlice";
import { fetchStudents, selectStudentError, selectStudentLoading, selectStudents } from "../slices/studentSlice";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const StudentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectUsers);
  const students = useSelector(selectStudents);
  const loading = useSelector(selectStudentLoading);
  const error = useSelector(selectStudentError);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Map for fast lookup of user by _id
  const userMap = new Map(users.map((u) => [u._id, u]));

  // Filter students by name matching searchTerm
  const filteredStudents = students.filter((student) => {
    const user = userMap?.get(student.userId);
    const userName = user?.name || "";
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewDetails = (studentId) => {
    navigate(`/admin/student/profiles/${studentId}`);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Student Management</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage all registered students</p>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition"
        />

        {loading && <p className="text-center py-8 text-gray-400 text-sm">Loading students...</p>}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="min-w-full divide-y divide-white/[0.06]">
            <thead className="bg-[#1e293b]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500 text-sm">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const user = userMap.get(student.userId);
                  return (
                    <tr key={student._id} className="hover:bg-white/[0.04] transition">
                      <td className="px-6 py-4 text-gray-200 text-sm">{user?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm break-all">{user?.email || "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(student._id)}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
