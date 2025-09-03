import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchUsers, selectUsers } from "../slices/authSlice";
import { fetchStudents, selectStudentError, selectStudentLoading, selectStudents } from "../slices/studentSlice";
import { useEffect, useState } from "react";


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


  // Create a map for fast lookup of user by _id
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
      <h1 className="text-3xl font-bold mb-6">Student Management</h1>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      {loading && <p>Loading students...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">Email</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No students found.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => {
              const user = userMap.get(student.userId);
              return (
                <tr key={student._id}>
                  <td className="p-2 border border-gray-300">
                    {user?.name || "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {user?.email || "N/A"}
                  </td>
                  <td className="p-2 border border-gray-300 text-center">
                    <button
                      onClick={() => handleViewDetails(student._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded  "
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
  );
};

export default StudentList;
