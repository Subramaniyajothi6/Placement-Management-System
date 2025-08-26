import { useDispatch, useSelector } from "react-redux";
import { clearSelectedStudent, fetchStudentById, selectSelectedStudent, selectStudentError, selectStudentLoading } from "../slices/studentSlice";
import { fetchApplications, selectApplicationsByStudent } from "../slices/applicationSlice";
import { useEffect } from "react";


const StudentDetail = ({ studentId, onClose }) => {
    const dispatch = useDispatch();
    const student = useSelector(selectSelectedStudent);
    const loading = useSelector(selectStudentLoading);
    const error = useSelector(selectStudentError);

    const applications = useSelector((state) => selectApplicationsByStudent(state, studentId));

    useEffect(() => {
        if (studentId) {
            dispatch(fetchStudentById(studentId));
            dispatch(fetchApplications());  // in case applications not loaded
        }

        return () => {
            dispatch(clearSelectedStudent());
        };
    }, [dispatch, studentId]);
    
    console.log('Students:', student);


    if (loading || !student) return <p>Loading student information...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
            <button onClick={onClose} className="mb-4 px-3 py-1 bg-gray-300 rounded">
                Back to List
            </button>
            <h2 className="text-2xl font-bold mb-4">User ID: {student.userId}</h2> 
            <h2 className="text-2xl font-bold mb-4">Name: {student.user?.name}</h2>
            <p className="mb-2"><strong>Email:</strong> {student.user?.email}</p>
            <p className="mb-2"><strong>Bio:</strong> {student.bio || 'Not provided'}</p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Education</h3>
            {student.education?.length ? (
                <ul className="list-disc pl-5">
                    {student.education.map((edu, index) => (
                        <li key={index}>
                            {edu.degree} in {edu.fieldOfStudy} from {edu.institution} ({edu.startYear} - {edu.endYear})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No education details provided.</p>
            )}

            <h3 className="text-xl font-semibold mt-6 mb-2">Applications</h3>
            {applications?.length ? (
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border border-gray-300">Job Title</th>
                            <th className="p-2 border border-gray-300">Company</th>
                            <th className="p-2 border border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="p-2 border border-gray-300">{app.job?.title || app.job}</td>
                                <td className="p-2 border border-gray-300">{app.company?.name || app.company}</td>
                                <td className="p-2 border border-gray-300">{app.status}</td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            ) : (
                <p>No applications found.</p>
            )}
        </div>
    );
};

export default StudentDetail;
