import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCompany } from "../../slices/companySlice"; // Your Redux thunk
import { selectAuthUser } from "../../slices/authSlice";

const CompanyForm = () => {
    const dispatch = useDispatch();
    const authUser = useSelector(selectAuthUser);
    // console.log("Authenticated User:", authUser._id);

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

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleNestedChange = (e, parentKey) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [name]: value,
            },
        }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name) {
            setErrorMessage("Company name is required.");
            return;
        }

        const payload = {
            ...formData,
            user: authUser._id,
        };

        dispatch(createCompany(payload))
            .unwrap()
            .then(() => {
                setSuccessMessage("Company profile created successfully!");
                setFormData({
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
            })
            .catch((err) => {
                setErrorMessage(err || "Failed to create company profile.");
            });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Create Company Profile</h2>

            {errorMessage && <p className="text-red-600 mb-4 text-center">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 mb-4 text-center">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block mb-1 font-semibold">Company Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Industry</label>
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Size</label>
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
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 font-semibold">Logo URL</label>
                        <input
                            type="text"
                            name="logo"
                            value={formData.logo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <fieldset className="border p-4 rounded">
                    <legend className="font-semibold mb-4">Location</legend>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["address", "city", "state", "country", "pincode"].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 capitalize">{field}</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={formData.location[field]}
                                    onChange={(e) => handleNestedChange(e, "location")}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded mt-6">
                    <legend className="font-semibold mb-4">Contact Person</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["name", "email", "phone"].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 capitalize">{field}</label>
                                <input
                                    type={field === "email" ? "email" : "text"}
                                    name={field}
                                    value={formData.contactPerson[field]}
                                    onChange={(e) => handleNestedChange(e, "contactPerson")}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="border p-4 rounded mt-6">
                    <legend className="font-semibold mb-4">Social Links</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {["linkedin", "twitter", "facebook"].map((field) => (
                            <div key={field}>
                                <label className="block mb-1 capitalize">{field}</label>
                                <input
                                    type="url"
                                    name={field}
                                    value={formData.socialLinks[field]}
                                    onChange={(e) => handleNestedChange(e, "socialLinks")}
                                    className="w-full p-2 border rounded"
                                    placeholder={`https://www.${field}.com/yourpage`}
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 mt-6 transition"
                >
                    Create Company Profile
                </button>
            </form>
        </div>
    );
};

export default CompanyForm;
