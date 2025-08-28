import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, selectJobs, selectJobsLoading } from "../../slices/jobSlice";
import { createApplication } from "../../slices/applicationSlice";
import { selectAuthUser } from "../../slices/authSlice";
import { useParams } from "react-router";

const StudentApplicationPage = () => {
    const dispatch = useDispatch();
    const jobs = useSelector(selectJobs);
    const jobsLoading = useSelector(selectJobsLoading);
    const user = useSelector(selectAuthUser);
    const {companyId} = useParams();
    const userId = user?._id;


    const [form, setForm] = useState({
        jobId: "",
        resume: null,
        coverLetter: "",
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        candidate: userId || "",
        company: companyId || "",
    });

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm(prev => ({
                ...prev,
                [name]: files[0],  // file object
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.resume) {
            alert("Please enter your resume URL.");
            return;
        }

        const selectedJob = jobs.find(job => job._id === form.jobId);
        if (!selectedJob) {
            alert("Selected job is invalid.");
            return;
        }

        const payload = {
            job: form.jobId,
            company: companyId,
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
            jobId: "",
            resume: null,
            coverLetter: "",
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            candidate: userId || "",
            company: companyId || "",
        });
    };


    if (jobsLoading) {
        return <p className="p-8 text-center">Loading jobs...</p>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
            <h2 className="text-2xl font-bold mb-6">Job Application</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
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
                    Select Job
                    <select
                        name="jobId"
                        value={form.jobId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">-- Select a Job --</option>
                        {jobs.map((job) => (
                            <option value={job._id} key={job._id}>
                                {job.title} ({job.company?.name || "Company"})
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    Resume URL (e.g., uploaded file link)
                    <input
                        type="text"
                        name="resume"
                        value={form.resume || ""}
                        onChange={handleChange}
                        placeholder="Enter resume URL"
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
