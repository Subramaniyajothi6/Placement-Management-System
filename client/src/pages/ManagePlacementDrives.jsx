import { useDispatch, useSelector } from "react-redux";
import { clearPlacementDrive, clearPlacementDriveError, createPlacementDrive, deletePlacementDrive, fetchPlacementDrives, selectPlacementDrives, selectPlacementDrivesError, selectPlacementDrivesLoading, updatePlacementDrive } from "../slices/placementDriveSlice";
import { useEffect, useState } from "react";


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
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyDrive);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Placement Drives</h1>

      {loading && <p>Loading placement drives...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create New Placement Drive
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="eligibilityCriteria"
              value={formData.eligibilityCriteria}
              onChange={handleChange}
              placeholder="Eligibility Criteria"
              className="p-2 border rounded"
            />
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Job Description"
              className="p-2 border rounded col-span-2"
              rows={3}
            />
            <input
              type="text"
              name="packageOffered"
              value={formData.packageOffered}
              onChange={handleChange}
              placeholder="Package Offered"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleChange}
              placeholder="Contact Person Name"
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="contactPerson.email"
              value={formData.contactPerson.email}
              onChange={handleChange}
              placeholder="Contact Person Email"
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              placeholder="Contact Person Phone"
              className="p-2 border rounded"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded border border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">Title</th>
              <th className="p-2 border border-gray-300">Company Name</th>
              <th className="p-2 border border-gray-300">Location</th>
              <th className="p-2 border border-gray-300">Start Date</th>
              <th className="p-2 border border-gray-300">End Date</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {placementDrives.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-600">
                  No Placement Drives found.
                </td>
              </tr>
            ) : (
              placementDrives.map((drive) => (
                <tr key={drive._id}>
                  <td className="p-2 border border-gray-300">{drive.title}</td>
                  <td className="p-2 border border-gray-300">{drive.companyName}</td>
                  <td className="p-2 border border-gray-300">{drive.location}</td>
                  <td className="p-2 border border-gray-300">{new Date(drive.startDate).toLocaleDateString()}</td>
                  <td className="p-2 border border-gray-300">{new Date(drive.endDate).toLocaleDateString()}</td>
                  <td className="p-2 border border-gray-300 space-x-2">
                    <button
                      onClick={() => handleEdit(drive)}
                      className="px-2 py-1 bg-yellow-400 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(drive._id)}
                      className="px-2 py-1 bg-red-600 rounded text-white"
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
