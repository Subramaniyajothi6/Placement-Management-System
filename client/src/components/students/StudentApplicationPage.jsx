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
  const [submitting, setSubmitting] = useState(false);
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

    setSubmitting(true);
    try {
      await dispatch(createApplication(payload)).unwrap();
      toast.success("Application submitted successfully!");
      setForm((prev) => ({
        ...prev,
        resume: currentStudentProfile?.resume || "",
        coverLetter: "",
      }));
      navigate(`/student/dashboard`);
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-300";

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(`/student/applyJob/${driveId}/${companyId}`)}
        className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        aria-label="Go back"
      >
        <FaArrowLeft className="text-xs" /> Back
      </button>

      <div className="max-w-2xl mx-auto bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8">
        <h2 className="text-2xl font-black text-white mb-1">Job Application</h2>
        <p className="text-gray-400 text-sm mb-8">Fill in your details and submit your application.</p>

        {alreadyApplied ? (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm text-center font-semibold">
              You have already applied for this job role at this company.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input id="phone" type="text" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
              {phoneError && <span className="block mt-1 text-red-400 text-xs">{phoneError}</span>}
            </div>

            <div>
              <label htmlFor="resumeFile" className={labelClass}>Update Resume? (PDF, DOC, DOCX)</label>
              <input
                id="resumeFile"
                name="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleResumeUpload(e.target.files[0])}
                className="w-full p-2 rounded-xl border border-white/10 bg-white/[0.05] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                disabled={uploading}
              />
              {form.resume && (
                <a href={form.resume} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-indigo-400 hover:text-indigo-300 underline text-sm">
                  View uploaded resume from profile
                </a>
              )}
              {resumeError && <span className="block mt-1 text-red-400 text-xs">{resumeError}</span>}
            </div>

            <div>
              <label htmlFor="coverLetter" className={labelClass}>Cover Letter</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                rows={5}
                placeholder="Write your cover letter here..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={uploading || submitting}
              className="w-full py-3 bg-indigo-600 rounded-xl text-white font-semibold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : uploading ? "Uploading..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentApplicationPage;
