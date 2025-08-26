import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, selectStudentError, selectStudentLoading, selectStudents } from "../slices/studentSlice";


const StudentList = ({ onSelectStudent }) => {
    const dispatch = useDispatch();
    const students = useSelector(selectStudents);
    const loading = useSelector(selectStudentLoading);
    const error = useSelector(selectStudentError);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);

    // Filter students by name or email (adjust fields as per your User/Student model)
    // const filteredStudents = students.filter((student) =>
    //     student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     student?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredStudents = students.filter((student) =>
        student.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Student Management</h1>

            <input
                type="text"
                placeholder="Search by name or email"
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
                        filteredStudents.map((student) => (
                            <tr key={student._id}>
                                <td className="p-2 border border-gray-300">{student.userId}</td>
                                <td className="p-2 border border-gray-300">{student.userId}</td> 
                                <td className="p-2 border border-gray-300">
                                    <button
                                        onClick={() => onSelectStudent(student._id)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default StudentList;
