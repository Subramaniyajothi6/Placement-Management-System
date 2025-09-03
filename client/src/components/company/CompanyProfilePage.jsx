import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchCompanies, selectAllCompanies, updateCompany } from "../../slices/companySlice";
import { useEffect, useState } from "react";

const CompanyProfilePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const companies = useSelector(selectAllCompanies);
    const company = companies.find((c) => c.user === id);

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        industry: "",
        size: "1-10",
        description: "",
        logo: "",
        website: "",
        location: {
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
        },
        contactPerson: {
            name: "",
            email: "",
            phone: "",
        },
        socialLinks: {
            linkedin: "",
            twitter: "",
            facebook: "",
        },
    });

    useEffect(() => {
        if (!company) {
            dispatch(fetchCompanies());
        } else {
            setFormData(company);
        }
    }, [company, dispatch]);

    const handleNestedChange = (e, parentKey) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [name]: value,
            },
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log(formData);
        dispatch(updateCompany({ id: company._id, data: formData }))
            .unwrap()
            .then(() => {
                setEditMode(false);
                alert("Company profile updated successfully!");
            })
            .catch((err) => alert("Failed to update company: " + err));
    };

    if (!company) return <div>Loading company profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Company Profile</h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Company Name */}
                    <div>
                        <label className="block mb-1 font-semibold">Company Name*</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 rounded break-words max-w-full whitespace-normal">{formData.name}</p>
                        )}
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block mb-1 font-semibold">Industry</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p className="p-2 bg-gray-50 rounded break-words max-w-full whitespace-normal">{formData.industry}</p>
                        )}
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block mb-1 font-semibold">Size</label>
                        {editMode ? (
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="1-10">1-10</option>
                                <option value="11-50">11-50</option>
                                <option value="51-200">51-200</option>
                                <option value="201-500">201-500</option>
                                <option value="501-1000">501-1000</option>
                                <option value="1000+">1000+</option>
                            </select>
                        ) : (
                            <p className="p-2 bg-gray-50 rounded break-words max-w-full whitespace-normal">{formData.size}</p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 font-semibold">Description</label>
                    {editMode ? (
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p className="p-2 bg-gray-50 rounded  break-words max-w-full whitespace-normal">{formData.description}</p>
                    )}
                </div>

                {/* Location */}
                <fieldset className="border p-4 rounded">
                    <legend className="font-semibold mb-4">Location</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["address", "city", "state", "country", "pincode"].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 capitalize">{field}</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData.location[field]}
                                        onChange={(e) => handleNestedChange(e, "location")}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <p className="p-2 bg-gray-50 rounded break-words max-w-full whitespace-normal">{formData.location[field]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* Contact Person */}
                <fieldset className="border p-4 rounded mt-6">
                    <legend className="font-semibold mb-4">Contact Person</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                        {["name", "email", "phone"].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 capitalize ">{field}</label>
                                {editMode ? (
                                    <input
                                        type={field === "email" ? "email" : "text"}
                                        name={field}
                                        value={formData.contactPerson[field]}
                                        onChange={(e) => handleNestedChange(e, "contactPerson")}
                                        className="w-full p-2 border rounded  "
                                    />
                                ) : (
                                    <p className="p-2 bg-gray-50 rounded break-words max-w-full whitespace-normal">{formData.contactPerson[field]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* Social Links */}
                <fieldset className="border p-4 rounded mt-6">
                    <legend className="font-semibold mb-4">Social Links</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["linkedin", "twitter", "facebook"].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 capitalize">{field}</label>
                                {editMode ? (
                                    <input
                                        type="url"
                                        name={field}
                                        value={formData.socialLinks[field]}
                                        onChange={(e) => handleNestedChange(e, "socialLinks")}
                                        className="w-full p-2 border rounded"
                                        placeholder={`https://www.${field}.com/yourpage`}
                                    />
                                ) : (
                                    <p className="p-2 bg-gray-50 rounded break-words max-w-full whitespace-normal">{formData.socialLinks[field]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* Action buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    {editMode ? (
                        <>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditMode(false);
                                    setFormData(company); // Reset form to existing data
                                }}
                                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setEditMode(true)}
                            className="px-8 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CompanyProfilePage;
