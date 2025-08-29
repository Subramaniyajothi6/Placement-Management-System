import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlacementDrives, selectPlacementDrives } from "../../slices/placementDriveSlice";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { fetchJobs, selectJobs, selectJobsLoading } from "../../slices/jobSlice";
import { createApplication } from "../../slices/applicationSlice";
import { selectAuthUser } from "../../slices/authSlice";

const StudentApplicationPage = () => {
  const dispatch = useDispatch();
  const placementDrives = useSelector(selectPlacementDrives);
  const companies = useSelector(selectAllCompanies);
  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);
  const user = useSelector(selectAuthUser);
  const userId = user?._id;

  const [form, setForm] = useState({
    placementDriveId: "",
    companyId: "",
    jobId: "",
    resume: "",
    coverLetter: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    candidate: userId || "",
  });

  useEffect(() => {
    dispatch(fetchPlacementDrives());
    dispatch(fetchCompanies());
    dispatch(fetchJobs());
  }, [dispatch]);

  // Companies filtered by chosen placement drive
  const filteredCompanies = companies.filter(
    company =>
      form.placementDriveId &&
      company.placementDrives?.some(drive => drive._id === form.placementDriveId)
  );

  // Jobs filtered by chosen company and placement drive
  const filteredJobs = jobs.filter(
    job =>
      form.companyId &&
      form.placementDriveId &&
      job.company?._id === form.companyId &&
      job.placementDrive?._id === form.placementDriveId
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Selecting drive resets company and job fields
    if (name === "placementDriveId") {
      setForm((prev) => ({
        ...prev,
        placementDriveId: value,
        companyId: "",
        jobId: "",
      }));
    } else if (name === "companyId") {
      setForm((prev) => ({
        ...prev,
        companyId: value,
        jobId: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.jobId || !form.companyId || !form.resume) {
      alert("Please fill in all required fields.");
      return;
    }
    const payload = {
      job: form.jobId,
      company: form.companyId,
      candidate: userId,
      resume: form.resume,
      coverletter: form.coverLetter,
      name: form.name,
      email: form.email,
      phone: form.phone,
    };
    dispatch(createApplication(payload));
    alert("Application submitted successfully!");
    setForm({
      placementDriveId: "",
      companyId: "",
      jobId: "",
      resume: "",
      coverLetter: "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      candidate: userId || "",
    });
  };

  if (jobsLoading) {
    return <p className="p-8 text-center">Loading jobs...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Job Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Placement Drive */}
        <label className="block">
          Placement Drive
          <select
            name="placementDriveId"
            value={form.placementDriveId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select a Placement Drive --</option>
            {placementDrives.map(drive => (
              <option value={drive._id} key={drive._id}>{drive.title}</option>
            ))}
          </select>
        </label>

        {/* Companies filtered by placement drive */}
        <label className="block">
          Company
          <select
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={!form.placementDriveId}
          >
            <option value="">-- Select a Company --</option>
            {filteredCompanies.map(company => (
              <option value={company._id} key={company._id}>{company.name}</option>
            ))}
          </select>
        </label>

        {/* Jobs filtered by placement drive and company */}
        <label className="block">
          Job
          <select
            name="jobId"
            value={form.jobId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={!form.companyId}
          >
            <option value="">-- Select a Job --</option>
            {filteredJobs.map(job => (
              <option value={job._id} key={job._id}>{job.title}</option>
            ))}
          </select>
        </label>

        {/* The rest of your form fields */}
        <label className="block">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block">
          Phone
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>
        <label className="block">
          Resume URL
          <input
            type="text"
            name="resume"
            value={form.resume}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </label>
        <label className="block">
          Cover Letter
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Write your cover letter here..."
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default StudentApplicationPage;
