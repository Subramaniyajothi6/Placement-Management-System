import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectAuthUser } from "../../slices/authSlice";
import { useState } from "react";
import { createApplication } from "../../slices/applicationSlice";

const StudentApplicationPage = () => {
  const dispatch = useDispatch();
  const { placementDriveId, companyId, jobId } = useParams(); // get from URL
  const user = useSelector(selectAuthUser);
  const userId = user?._id;

  const [form, setForm] = useState({
    resume: "",
    coverLetter: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.resume) {
      alert("Please fill in your resume URL.");
      return;
    }

    const payload = {
      job: jobId,             // directly from params
      company: companyId,     // directly from params
      candidate: userId,
      resume: form.resume,
      coverletter: form.coverLetter,
      name: form.name,
      email: form.email,
      phone: form.phone,
      placementDriveId: placementDriveId // optionally send if your backend needs it
    };

    dispatch(createApplication(payload));
    alert("Application submitted successfully!");
    setForm((prev) => ({
      ...prev,
      resume: "",
      coverLetter: "",
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Job Application</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Resume URL */}
        <div>
          <label className="block mb-2 font-semibold">Resume URL</label>
          <input
            type="text"
            name="resume"
            value={form.resume}
            onChange={handleChange}
            placeholder="Enter your resume URL"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block mb-2 font-semibold">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Write your cover letter here..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default StudentApplicationPage;
