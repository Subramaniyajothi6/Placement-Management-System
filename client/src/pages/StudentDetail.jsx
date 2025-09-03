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
import { FaArrowLeft } from "react-icons/fa";

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
            dispatch(fetchApplications());
        }
        return () => {
            dispatch(clearSelectedStudent());
        };
    }, [dispatch, studentId]);

    if (loading)
        return <div className="text-center py-14 text-indigo-700 font-semibold">Loading student information...</div>;
    if (error)
        return <div className="text-center py-14 text-red-600 font-semibold">Error: {error}</div>;
    if (!student)
        return <div className="text-center py-14 text-red-600 font-semibold">Student not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-xl mt-10">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center mb-8 text-indigo-600 font-semibold hover:text-indigo-800 focus:outline-none transition"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>

            {/* Student Header */}
            <section className="mb-8">
                <h2 className="text-3xl font-bold text-indigo-700 border-b pb-3 mb-3">
                    {student.userId?.name || "N/A"}
                </h2>
                <div className="space-y-2 ml-1">
                    <div>
                        <span className="text-sm font-medium text-indigo-900">User ID:</span> {student.userId?._id || "N/A"}
                    </div>
                    <div>
                        <span className="text-sm font-medium text-indigo-900">Email:</span>{" "}
                        <span className="break-all">{student.userId?.email || "N/A"}</span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-indigo-900">Bio:</span>{" "}
                        {student.bio || <span className="text-gray-500 italic">Not provided</span>}
                    </div>
                </div>
            </section>

            {/* Education */}
            <section className="mb-10">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Education</h3>
                {student.education?.length ? (
                    <ul className="list-disc pl-5 space-y-1">
                        {student.education.map((edu, index) => (
                            <li key={index} className="text-gray-800">
                                <span className="font-medium text-indigo-700">{edu.degree}</span>
                                {" in "}
                                <span className="font-medium">{edu.fieldOfStudy}</span>
                                {" at "}
                                <span className="font-medium">{edu.institution}</span>
                                {" ("}
                                {edu.startYear} - {edu.endYear}
                                {")"}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No education details provided.</p>
                )}
            </section>

            {/* Applications */}
            <section>
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">Applications</h3>
                {applications?.length ? (
                    <div className="overflow-x-auto rounded-lg border border-indigo-100 shadow bg-white">
                        <table className="min-w-full">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th className="p-4 text-left text-indigo-700 font-semibold">Job Title</th>
                                    <th className="p-4 text-left text-indigo-700 font-semibold">Company</th>
                                    <th className="p-4 text-left text-indigo-700 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app, idx) => (
                                    <tr key={app._id} className={idx % 2 ? "bg-indigo-50" : "bg-white"}>
                                        <td className="p-4">
                                            {(typeof app.job === "object" && app.job !== null
                                                ? app.job.title
                                                : app.job) || "N/A"}
                                        </td>
                                        <td className="p-4">
                                            {(typeof app.company === "object" && app.company !== null
                                                ? app.company.name
                                                : app.company) || "N/A"}
                                        </td>
                                        <td className="p-4">{app.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No applications found.</p>
                )}
            </section>
        </div>
    );
};

export default StudentDetail;
