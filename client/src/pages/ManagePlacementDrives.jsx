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
    if(editingId){alert("Placement Drive updated successfully!");}
    else{alert("Placement Drive created successfully!");}
    
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyDrive);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/admin/dashboard`)}
        className="flex items-center mb-8 text-indigo-600 font-semibold hover:text-indigo-800 focus:outline-none transition"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-indigo-700 border-b pb-2">Manage Placement Drives</h1>

      {loading && <p>Loading placement drives...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 font-semibold transition"
      >
        Create New Placement Drive
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-indigo-50 p-6 rounded-xl shadow-lg space-y-6 border border-indigo-100">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">
            {editingId ? "Edit Placement Drive" : "Create Placement Drive"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="p-3 border rounded bg-white"
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="p-3 border rounded bg-white"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="p-3 border rounded bg-white"
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="p-3 border rounded bg-white"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="p-3 border rounded bg-white"
            />
            <input
              type="text"
              name="eligibilityCriteria"
              value={formData.eligibilityCriteria}
              onChange={handleChange}
              placeholder="Eligibility Criteria"
              className="p-3 border rounded bg-white"
            />
            <input
              type="text"
              name="packageOffered"
              value={formData.packageOffered}
              onChange={handleChange}
              placeholder="Package Offered"
              className="p-3 border rounded bg-white"
            />
            <input
              type="text"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleChange}
              placeholder="Contact Person Name"
              className="p-3 border rounded bg-white"
            />
            <input
              type="email"
              name="contactPerson.email"
              value={formData.contactPerson.email}
              onChange={handleChange}
              placeholder="Contact Person Email"
              className="p-3 border rounded bg-white"
            />
            <input
              type="text"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              placeholder="Contact Person Phone"
              className="p-3 border rounded bg-white"
            />
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Job Description"
              className="p-3 border rounded col-span-1 md:col-span-2 bg-white"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded border border-gray-400 bg-white hover:bg-gray-100 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-indigo-100 rounded-xl shadow bg-white">
          <thead className="bg-indigo-50">
            <tr>
              <th className="p-3 border border-indigo-100 text-indigo-700">Title</th>
              <th className="p-3 border border-indigo-100 text-indigo-700">Company Name</th>
              <th className="p-3 border border-indigo-100 text-indigo-700">Location</th>
              <th className="p-3 border border-indigo-100 text-indigo-700">Start Date</th>
              <th className="p-3 border border-indigo-100 text-indigo-700">End Date</th>
              <th className="p-3 border border-indigo-100 text-indigo-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {placementDrives.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-600">No Placement Drives found.</td>
              </tr>
            ) : (
              placementDrives.map((drive, idx) => (
                <tr key={drive._id} className={idx % 2 === 0 ? "bg-white" : "bg-indigo-50"}>
                  <td className="p-3 border border-indigo-100">{drive.title}</td>
                  <td className="p-3 border border-indigo-100">{drive.companyName}</td>
                  <td className="p-3 border border-indigo-100">{drive.location}</td>
                  <td className="p-3 border border-indigo-100">{new Date(drive.startDate).toLocaleDateString()}</td>
                  <td className="p-3 border border-indigo-100">{new Date(drive.endDate).toLocaleDateString()}</td>
                  <td className="p-3 border border-indigo-100 flex gap-2">
                    <button
                      onClick={() => handleEdit(drive)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(drive._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlacementDrives;
