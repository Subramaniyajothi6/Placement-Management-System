import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { selectAuthUser } from "../../slices/authSlice";
import { fetchStudents, selectStudents, uploadStudentResume } from "../../slices/studentSlice";
import { createApplication, fetchMyApplications } from "../../slices/applicationSlice";

const StudentApplicationPage = () => {
  const dispatch = useDispatch();
  const { driveId, companyId, jobId } = useParams();
  const user = useSelector(selectAuthUser);
  const students = useSelector(selectStudents);
  const userId = user?._id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    resume: "",
    coverLetter: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [resumeError, setResumeError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const currentStudentProfile = students.find((student) => student.userId === userId);

  useEffect(() => {
    if (currentStudentProfile?.resume) {
      setForm((prev) => ({ ...prev, resume: currentStudentProfile.resume }));
    }
  }, [currentStudentProfile]);

  // Check if user already applied for this job + company
  useEffect(() => {
    const checkDuplicateApplication = async () => {
      if (userId && jobId && companyId) {
        try {
          // Fetch this user's applications from Redux or API, filtered by user
          const action = await dispatch(fetchMyApplications()).unwrap();
          // Check if any application matches jobId & companyId
          const duplicate = action.find(
            (app) => app.job._id === jobId && app.company._id === companyId
          );
          setAlreadyApplied(!!duplicate);
        } catch {
          setAlreadyApplied(false); // fallback
        }
      }
    };
    checkDuplicateApplication();
  }, [dispatch, userId, jobId, companyId]);

  const validateResumeUrl = (url) => !!url && (url.startsWith("http") || url.startsWith("blob"));

  const validatePhone = (phone) => {
    const onlyDigits = phone.replace(/\D/g, "");
    return onlyDigits.length === 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "resume") setResumeError("");
    if (name === "phone") {
      if (!validatePhone(value)) setPhoneError("Phone number must contain exactly 10 digits");
      else setPhoneError("");
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const action = await dispatch(uploadStudentResume({ file }));
      if (uploadStudentResume.fulfilled.match(action)) {
        setForm((prev) => ({ ...prev, resume: action.payload }));
        setResumeError("");
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Resume upload failed: " + action.payload);
      }
    } catch (error) {
      toast.error("Unexpected error uploading resume: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (alreadyApplied) {
      toast.error("You have already applied for this job role at this company.");
      return;
    }

    if (!form.resume || !validateResumeUrl(form.resume)) {
      setResumeError("Please provide or upload a valid resume file.");
      toast.error("Resume file required.");
      return;
    }

    if (!validatePhone(form.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      toast.error("Invalid phone number.");
      return;
    }

    setPhoneError("");

    const payload = {
      job: jobId,
      company: companyId,
      candidate: userId,
      resume: form.resume,
      coverletter: form.coverLetter,
      name: form.name,
      email: form.email,
      phone: form.phone,
      placementDriveId: driveId,
    };

    dispatch(createApplication(payload));
    toast.success("Application submitted successfully!");
    setForm((prev) => ({
      ...prev,
      resume: currentStudentProfile?.resume || "",
      coverLetter: "",
    }));
    navigate(`/student/dashboard`);
  };

  return (
    <div className="relative min-h-screen bg-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(`/student/applyJob/${driveId}/${companyId}`)}
        className="relative mb-5 top-0 left-0 flex items-center px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        aria-label="Go back"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="container mx-auto bg-white rounded-lg shadow-xl border border-gray-200 p-8 pt-16">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-indigo-700">Job Application</h2>

        {alreadyApplied ? (
          <p className="text-center text-red-600 font-semibold">
            You have already applied for this job role at this company.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold text-gray-800">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 font-semibold text-gray-800">Phone</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
              {phoneError && <span className="block mt-1 text-red-600 text-sm">{phoneError}</span>}
            </div>

            <div>
              <label htmlFor="resumeFile" className="block mb-2 font-semibold text-gray-800">Update Resume? (PDF, DOC, DOCX)</label>
              <input
                id="resumeFile"
                name="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleResumeUpload(e.target.files[0])}
                className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                disabled={uploading}
              />
              {form.resume && (
                <a
                  href={form.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-indigo-600 underline"
                >
                  View uploaded resume from profile
                </a>
              )}
              {resumeError && <span className="block mt-1 text-red-600 text-sm">{resumeError}</span>}
            </div>

            <div>
              <label htmlFor="coverLetter" className="block mb-2 font-semibold text-gray-800">Cover Letter</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                rows={5}
                placeholder="Write your cover letter here..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-y focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-indigo-600 rounded-lg text-white font-semibold text-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              {uploading ? "Uploading..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentApplicationPage;
