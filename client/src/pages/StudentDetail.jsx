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
        return <div className="text-center py-14 text-gray-400 text-sm">Loading student information...</div>;
    if (error)
        return <div className="text-center py-14 text-red-400 text-sm font-semibold">Error: {error}</div>;
    if (!student)
        return <div className="text-center py-14 text-gray-400 text-sm">Student not found.</div>;

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
            >
                <FaArrowLeft className="text-xs" /> Back
            </button>

            {/* Student Header */}
            <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-black text-white mb-4 border-b border-white/[0.08] pb-4">
                    {student.userId?.name || "N/A"}
                </h2>
                <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 font-medium">User ID:</span> <span className="text-gray-300">{student.userId?._id || "N/A"}</span></p>
                    <p><span className="text-gray-500 font-medium">Email:</span> <span className="text-gray-300 break-all">{student.userId?.email || "N/A"}</span></p>
                    <p><span className="text-gray-500 font-medium">Bio:</span> <span className="text-gray-300">{student.bio || <span className="italic text-gray-600">Not provided</span>}</span></p>
                </div>
            </div>

            {/* Education */}
            <div className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6 mb-6">
                <h3 className="text-base font-bold text-white mb-4">Education</h3>
                {student.education?.length ? (
                    <ul className="space-y-2">
                        {student.education.map((edu, index) => (
                            <li key={index} className="text-sm text-gray-300">
                                <span className="text-indigo-400 font-medium">{edu.degree}</span>
                                {edu.fieldOfStudy && <span> in <span className="text-gray-200">{edu.fieldOfStudy}</span></span>}
                                {edu.institution && <span> at <span className="text-gray-200">{edu.institution}</span></span>}
                                <span className="text-gray-500"> ({edu.startYear} – {edu.endYear})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic text-sm">No education details provided.</p>
                )}
            </div>

            {/* Applications */}
            <div className="bg-[#1e293b] border border-white/[0.08] rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Applications</h3>
                {applications?.length ? (
                    <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
                        <table className="min-w-full divide-y divide-white/[0.06]">
                            <thead className="bg-[#1e293b]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-white/[0.04] transition">
                                        <td className="px-4 py-3 text-gray-200 text-sm">
                                            {(typeof app.job === "object" && app.job !== null ? app.job.title : app.job) || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-300 text-sm">
                                            {(typeof app.company === "object" && app.company !== null ? app.company.name : app.company) || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-300 text-sm font-medium">{app.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-sm">No applications found.</p>
                )}
            </div>
          </div>
        </div>
    );
};

export default StudentDetail;
