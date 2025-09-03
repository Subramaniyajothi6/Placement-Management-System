import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearSelectedStudent,
    fetchStudentById,
    selectSelectedStudent,
    selectStudentError,
    selectStudentLoading,
} from "../slices/studentSlice";
import {
    fetchApplications,
    selectAllApplications,
} from "../slices/applicationSlice";
import { useParams, useNavigate } from "react-router";

const StudentDetail = () => {
    const { studentId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const student = useSelector(selectSelectedStudent);
    const loading = useSelector(selectStudentLoading);
    const error = useSelector(selectStudentError);

    const applications = useSelector(selectAllApplications);

    useEffect(() => {
        if (studentId) {
            dispatch(fetchStudentById(studentId));
            dispatch(fetchApplications()); // Fetch all applications or optimize to student only
        }

        return () => {
            dispatch(clearSelectedStudent());
        };
    }, [dispatch, studentId]);

    if (loading) return <p>Loading student information...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (!student) return <p className="text-red-600">Student not found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
                Back to List
            </button>

            <h2 className="text-2xl font-bold mb-4">User ID: {student.userId?._id || "N/A"}</h2>
            <h2 className="text-2xl font-bold mb-4">Name: {student.userId?.name || "N/A"}</h2>
            <p className="mb-2">
                <strong>Email:</strong> {student.userId?.email || "N/A"}
            </p>
            <p className="mb-2">
                <strong>Bio:</strong> {student.bio || "Not provided"}
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Education</h3>
            {student.education?.length ? (
                <ul className="list-disc pl-5">
                    {student.education.map((edu, index) => (
                        <li key={index}>
                            {edu.degree} in {edu.fieldOfStudy} from {edu.institution} (
                            {edu.startYear} - {edu.endYear})
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
                                <td className="p-2 border border-gray-300">
                                    {typeof app.job === "object" && app.job !== null
                                        ? app.job.title || "N/A"
                                        : app.job || "N/A"}
                                </td>
                                <td className="p-2 border border-gray-300">
                                    {typeof app.company === "object" && app.company !== null
                                        ? app.company.name || "N/A"
                                        : app.company || "N/A"}
                                </td>
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
