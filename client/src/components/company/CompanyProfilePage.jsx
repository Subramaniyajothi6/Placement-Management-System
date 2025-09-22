import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchCompanies, selectAllCompanies, updateCompany } from "../../slices/companySlice";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const CompanyProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
    setError("");
    setSuccess("");
    dispatch(updateCompany({ id: company._id, data: formData }))
      .unwrap()
      .then(() => {
        setEditMode(false);
        toast.success("Company profile updated successfully!");
        setSuccess("Company profile updated successfully!");
      })
      .catch((err) =>
        setError("Failed to update company: " + (err?.message || err))
      );
  };

  if (!company)
    return (
      <div className="max-w-lg mx-auto py-20 text-center text-gray-600 text-lg">Loading company profile…</div>
    );

  return (
    <div className="container mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-8 text-indigo-600 font-semibold hover:text-indigo-800 transition focus:outline-none"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700 border-b pb-3">Company Profile</h2>

      {success && <div className="mb-4 text-green-600 font-semibold animate-pulse">{success}</div>}
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name */}
          <div className="col-span-1">
            <label className="block mb-1 font-semibold text-indigo-900">Company Name*</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full  p-2 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                required
              />
            ) : (
              <p className="p-2 bg-indigo-50 rounded break-words max-w-full whitespace-normal">{formData.name}</p>
            )}
          </div>
          {/* Website */}
          <div className="col-span-1">
            <label className="block mb-1  font-semibold text-indigo-900">Website</label>
            {editMode ? (
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 break-all"
                style={{ wordBreak: "break-all" }}
                placeholder="https://yourcompany.com"
              />
            ) : (
              <a
                href={formData.website}
                className="text-indigo-600 hover:underline break-all p-2 bg-indigo-50 rounded block"
                target="_blank"
                rel="noopener noreferrer"
                style={{ wordBreak: "break-all" }}
              >
                {formData.website}
              </a>
            )}
          </div>
          {/* Size */}
          <div className="col-span-1">
            <label className="block mb-1 font-semibold text-indigo-900">Size</label>
            {editMode ? (
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              >
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            ) : (
              <p className="p-2 bg-indigo-50 rounded">{formData.size}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold text-indigo-900">Description</label>
          {editMode ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
          ) : (
            <p className="p-2 bg-indigo-50 rounded max-w-full whitespace-pre-line">{formData.description}</p>
          )}
        </div>

        {/* Location */}
        <fieldset className="border border-indigo-200 p-6 rounded bg-indigo-50">
          <legend className="font-semibold text-indigo-700">Location</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            {["address", "city", "state", "country", "pincode"].map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize text-indigo-900">{field}</label>
                {editMode ? (
                  <input
                    type="text"
                    name={field}
                    value={formData.location[field]}
                    onChange={(e) => handleNestedChange(e, "location")}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  />
                ) : (
                  <p className="p-2 bg-white rounded break-words">{formData.location[field]}</p>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        {/* Contact Person */}
        <fieldset className="border border-indigo-200 p-6 rounded bg-indigo-50">
          <legend className="font-semibold text-indigo-700">Contact Person</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize text-indigo-900">{field}</label>
                {editMode ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData.contactPerson[field]}
                    onChange={(e) => handleNestedChange(e, "contactPerson")}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 break-all"
                    style={{ wordBreak: "break-all" }}
                  />
                ) : (
                  <p className="p-2 bg-white rounded break-all" style={{ wordBreak: "break-all" }}>{formData.contactPerson[field]}</p>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        {/* Social Links */}
        <fieldset className="border border-indigo-200 p-6 rounded bg-indigo-50">
          <legend className="font-semibold text-indigo-700">Social Links</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            {["linkedin", "twitter", "facebook"].map((field) => (
              <div key={field}>
                <label className="block mb-1 capitalize text-indigo-900">{field}</label>
                {editMode ? (
                  <input
                    type="url"
                    name={field}
                    value={formData.socialLinks[field]}
                    onChange={(e) => handleNestedChange(e, "socialLinks")}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 break-all"
                    placeholder={`https://www.${field}.com/yourpage`}
                    style={{ wordBreak: "break-all" }}
                  />
                ) : (
                  <a
                    href={formData.socialLinks[field]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline break-all p-2 bg-white rounded block"
                    style={{ wordBreak: "break-all" }}
                  >
                    {formData.socialLinks[field]}
                  </a>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-10">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="px-7 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition shadow focus:outline-none"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData(company);
                  setSuccess("");
                  setError("");
                }}
                className="px-7 py-3 border border-gray-300 rounded bg-white hover:bg-gray-50 text-indigo-600 font-semibold transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-600 transition shadow focus:outline-none"
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
