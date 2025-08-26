import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCompanies,
    selectAllCompanies,
    selectCompanyLoading,
    selectCompanyError,
    deleteCompany,
    resetCompanyState,
    updateCompany,
} from '../slices/companySlice';


const CompanyList = () => {
    const dispatch = useDispatch();
    const companies = useSelector(selectAllCompanies);
    const loading = useSelector(selectCompanyLoading);
    const error = useSelector(selectCompanyError);

    useEffect(() => {
        dispatch(fetchCompanies());
        return () => {
            dispatch(resetCompanyState());
        };
    }, [dispatch]);

    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        contactPerson: { name: '', email: '', phone: '' },
    });

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            dispatch(deleteCompany(id));
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('contactPerson.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                contactPerson: { ...prev.contactPerson, [key]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCompany({ id: editingCompany._id, data: formData }));
        setEditingCompany(null);
    }; const handleCancel = () => {
        setEditingCompany(null);
    };



    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name || '',
            industry: company.industry || '',
            contactPerson: {
                name: company.contactPerson?.name || '',
                email: company.contactPerson?.email || '',
                phone: company.contactPerson?.phone || '',
            },
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Company Management</h1>

            {loading && <p>Loading companies...</p>}
            {error && <p className="text-red-600">Error : {error}</p>}

            {companies.length === 0 && !loading ? (
                <p>No companies found.</p>
            ) : (
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border border-gray-300">Name</th>
                            <th className="p-2 border border-gray-300">Industry</th>
                            <th className="p-2 border border-gray-300">Contact Person</th>
                            <th className="p-2 border border-gray-300">Email</th>
                            <th className="p-2 border border-gray-300">Phone</th>
                            <th className="p-2 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company._id}>
                                <td className="p-2 border border-gray-300">{company.name}</td>
                                <td className="p-2 border border-gray-300">{company.industry}</td>
                                <td className="p-2 border border-gray-300">{company.contactPerson?.name}</td>
                                <td className="p-2 border border-gray-300">{company.contactPerson?.email}</td>
                                <td className="p-2 border border-gray-300">{company.contactPerson?.phone}</td>
                                <td className="p-2 border border-gray-300 space-x-2">
                                    <button
                                        className="px-2 py-1 bg-yellow-400 text-white rounded"
                                        // Add your edit logic here, e.g., open modal or navigate
                                        onClick={() => handleEdit(company)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-600 text-white rounded"
                                        onClick={() => handleDelete(company._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
    )}

    {editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
            onSubmit={handleUpdateSubmit}
          >
            <h2 className="text-xl font-bold mb-4">Edit Company</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="mb-3 w-full p-2 border rounded"
            />
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Industry"
              className="mb-3 w-full p-2 border rounded"
            />
            <input
              type="text"
              name="contactPerson.name"
              value={formData.contactPerson.name}
              onChange={handleChange}
              placeholder="Contact Person Name"
              className="mb-3 w-full p-2 border rounded"
            />
            <input
              type="email"
              name="contactPerson.email"
              value={formData.contactPerson.email}
              onChange={handleChange}
              placeholder="Contact Person Email"
              className="mb-3 w-full p-2 border rounded"
            />
            <input
              type="text"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              placeholder="Contact Person Phone"
              className="mb-4 w-full p-2 border rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
        </div>
    );
};

export default CompanyList;
