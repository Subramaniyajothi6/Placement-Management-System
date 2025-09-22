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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-indigo-600 font-semibold hover:text-indigo-800 focus:outline-none transition"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-indigo-700 border-b pb-2">Student Management</h1>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full p-3 border border-gray-300 outline-0 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-lg transition"
      />

      {loading && <p className="text-center py-8 text-gray-500">Loading students...</p>}
      {error && <p className="text-center py-8 text-red-600">Error: {error}</p>}

      <div className="overflow-x-auto rounded-xl border border-indigo-100 shadow-lg bg-white">
        <table className="min-w-full">
          <thead className="bg-indigo-50">
            <tr>
              <th className="p-4 text-left text-indigo-700 font-semibold">Name</th>
              <th className="p-4 text-left text-indigo-700 font-semibold">Email</th>
              <th className="p-4 text-center text-indigo-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => {
                const user = userMap.get(student.userId);
                return (
                  <tr key={student._id} className={idx % 2 ? "bg-indigo-50" : "bg-white"}>
                    <td className="p-4 break-words">{user?.name || "N/A"}</td>
                    <td className="p-4 break-all">{user?.email || "N/A"}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleViewDetails(student._id)}
                        className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
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
  );
};

export default StudentList;
