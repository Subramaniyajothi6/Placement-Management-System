import { useDispatch, useSelector } from "react-redux";
import {
  clearPlacementDrive,
  clearPlacementDriveError,
  createPlacementDrive,
  deletePlacementDrive,
  fetchPlacementDrives,
  selectPlacementDrives,
  selectPlacementDrivesError,
  selectPlacementDrivesLoading,
  updatePlacementDrive
} from "../slices/placementDriveSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const emptyDrive = {
  title: '',
  companyName: '',
  location: '',
  startDate: '',
  endDate: '',
  eligibilityCriteria: '',
  jobDescription: '',
  packageOffered: '',
  contactPerson: {
    name: '',
    email: '',
    phone: '',
  },
};

const ManagePlacementDrives = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const placementDrives = useSelector(selectPlacementDrives);
  const loading = useSelector(selectPlacementDrivesLoading);
  const error = useSelector(selectPlacementDrivesError);

  const [formData, setFormData] = useState(emptyDrive);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchPlacementDrives());
    dispatch(clearPlacementDrive());
    dispatch(clearPlacementDriveError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested contactPerson fields
    if (name.startsWith('contactPerson.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = (drive) => {
    setFormData({
      ...drive,
      startDate: drive.startDate ? new Date(drive.startDate).toISOString().slice(0, 10) : '',
      endDate: drive.endDate ? new Date(drive.endDate).toISOString().slice(0, 10) : '',
    });
    setEditingId(drive._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this placement drive?')) {
      dispatch(deletePlacementDrive(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updatePlacementDrive({ id: editingId, data: formData }));
    } else {
      dispatch(createPlacementDrive(formData));
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyDrive);
    if(editingId){toast.success("Placement Drive updated successfully!");}
    else{toast.success("Placement Drive created successfully!");}
    
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyDrive);
  };

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm [color-scheme:dark]";

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(`/admin/dashboard`)}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Manage Placement Drives</h1>
            <p className="text-gray-400 text-sm mt-1">Create and manage all placement drives</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
          >
            + New Drive
          </button>
        </div>

        {loading && <p className="text-center text-gray-400 text-sm py-8">Loading placement drives...</p>}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-[#1e293b] border border-white/[0.08] rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white mb-1">
              {editingId ? "Edit Placement Drive" : "Create Placement Drive"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title *" required className={inputClass} />
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name *" required className={inputClass} />
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className={inputClass} />
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputClass} />
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={inputClass} />
              <input type="text" name="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={handleChange} placeholder="Eligibility Criteria" className={inputClass} />
              <input type="text" name="packageOffered" value={formData.packageOffered} onChange={handleChange} placeholder="Package Offered" className={inputClass} />
              <input type="text" name="contactPerson.name" value={formData.contactPerson.name} onChange={handleChange} placeholder="Contact Person Name" className={inputClass} />
              <input type="email" name="contactPerson.email" value={formData.contactPerson.email} onChange={handleChange} placeholder="Contact Person Email" className={inputClass} />
              <input type="text" name="contactPerson.phone" value={formData.contactPerson.phone} onChange={handleChange} placeholder="Contact Person Phone" className={inputClass} />
              <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Job Description" className={`${inputClass} col-span-1 md:col-span-2 resize-y`} rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={handleCancel} className="px-5 py-2 rounded-xl border border-white/10 text-gray-300 text-sm font-semibold hover:bg-[#243347] transition">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40">
                {editingId ? 'Update Drive' : 'Create Drive'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="min-w-full divide-y divide-white/[0.06]">
            <thead className="bg-[#1e293b]">
              <tr>
                {["Title", "Company Name", "Location", "Start Date", "End Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {placementDrives.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500 text-sm">No Placement Drives found.</td>
                </tr>
              ) : (
                placementDrives.map((drive) => (
                  <tr key={drive._id} className="hover:bg-white/[0.04] transition">
                    <td className="px-4 py-3 text-gray-200 text-sm font-medium">{drive.title}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{drive.companyName}</td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{drive.location || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{new Date(drive.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{new Date(drive.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(drive)} className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-500/30 transition">Edit</button>
                        <button onClick={() => handleDelete(drive._id)} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePlacementDrives;
