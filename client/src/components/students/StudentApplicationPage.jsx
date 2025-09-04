import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../slices/authSlice";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { createApplication } from "../../slices/applicationSlice";
import { FaArrowLeft } from "react-icons/fa";

const StudentApplicationPage = () => {
  const dispatch = useDispatch();
  const { placementDriveId, companyId, jobId } = useParams();
  const user = useSelector(selectAuthUser);
  const userId = user?._id;
  const navigate = useNavigate();

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
    <div className="relative min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        aria-label="Go back"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl border border-gray-200 p-8 pt-16">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-indigo-700">
          Job Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 font-semibold text-gray-800">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="resume" className="block mb-2 font-semibold text-gray-800">
              Resume URL
            </label>
            <input
              id="resume"
              type="text"
              name="resume"
              value={form.resume}
              onChange={handleChange}
              placeholder="Enter your resume URL"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="coverLetter" className="block mb-2 font-semibold text-gray-800">
              Cover Letter
            </label>
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
            className="w-full py-3 bg-indigo-600 rounded-lg text-white font-semibold text-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentApplicationPage;
