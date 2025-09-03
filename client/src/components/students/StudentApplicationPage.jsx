import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectAuthUser } from "../../slices/authSlice";
import { useState } from "react";
import { createApplication } from "../../slices/applicationSlice";

const StudentApplicationPage = () => {
  const dispatch = useDispatch();
  const { placementDriveId, companyId, jobId } = useParams();
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
      job: jobId,
      company: companyId,
      candidate: userId,
      resume: form.resume,
      coverletter: form.coverLetter,
      name: form.name,
      email: form.email,
      phone: form.phone,
      placementDriveId: placementDriveId,
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
    <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">
        Job Application
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
        </div>

        {/* Resume URL */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Resume URL</label>
          <input
            type="text"
            name="resume"
            value={form.resume}
            onChange={handleChange}
            placeholder="Enter your resume URL"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            required
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={handleChange}
            rows={5}
            placeholder="Write your cover letter here..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-y focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 rounded-lg text-white font-semibold text-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default StudentApplicationPage;
