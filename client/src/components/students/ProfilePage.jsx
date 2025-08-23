import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../slices/authSlice';

const ProfilePage = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    academicDetails: '',
    resume: null,
  });

    useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        academicDetails: user.academicDetails || '',
        resume: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== '') {
        formData.append(key, val);
      }
    });
        dispatch(updateUserProfile(formData));
  };

  return (
    <>
     <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <label className="block mb-2 font-semibold" htmlFor="name">
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 font-semibold" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 font-semibold" htmlFor="phone">
        Phone
      </label>
      <input
        id="phone"
        name="phone"
        type="text"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <label className="block mb-2 font-semibold" htmlFor="academicDetails">
        Academic Details
      </label>
      <textarea
        id="academicDetails"
        name="academicDetails"
        value={form.academicDetails}
        onChange={handleChange}
        rows={4}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Grades, transcripts, achievements, etc."
      />

      <label className="block mb-2 font-semibold" htmlFor="resume">
        Upload Resume (PDF/DOC)
      </label>
      <input
        id="resume"
        name="resume"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="mb-4"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Save Profile
      </button>
    </form>
    </>
  )
}

export default ProfilePage