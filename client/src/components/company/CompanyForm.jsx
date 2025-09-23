import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCompany } from "../../slices/companySlice";
import { selectAuthUser } from "../../slices/authSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const CompanyForm = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: authUser.name || "",
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

  const [errors, setErrors] = useState({});

const isValidURL = (string) => {
  if (!string) return true;

  try {
    new URL(string.trim());
    return true;
  } catch {
    return false;
  }
};

  const isValidPhone = (phone) => {
    if (!phone) return true;
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required.";
    }

    if (formData.logo && !isValidURL(formData.logo)) {
      newErrors.logo = "Please enter a valid Logo URL.";
    }

    if (formData.website && !isValidURL(formData.website)) {
      newErrors.website = "Please enter a valid Website URL.";
    }

    Object.entries(formData.socialLinks).forEach(([key, value]) => {
      if (value && !isValidURL(value)) {
        newErrors[`socialLinks_${key}`] = `Please enter a valid URL for ${key}.`;
      }
    });

    if (formData.contactPerson.phone && !isValidPhone(formData.contactPerson.phone)) {
      newErrors.contactPerson_phone = "Contact person phone must have exactly 10 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [name]: value,
      },
    }));

    // Inline validation for phone
    if (parentKey === "contactPerson" && name === "phone") {
      setErrors((prev) => ({
        ...prev,
        contactPerson_phone: isValidPhone(value) ? "" : "Contact person phone must have exactly 10 digits.",
      }));
    }

    // Inline validation for URLs
    if (parentKey === "socialLinks" || name === "logo" || name === "website") {
      const urlValue = parentKey === "socialLinks" ? value : formData[name];
      const isValid = isValidURL(urlValue);
      const errorKey = parentKey === "socialLinks" ? `socialLinks_${name}` : name;
      setErrors((prev) => ({
        ...prev,
        [errorKey]: isValid ? "" : `Please enter a valid URL for ${errorKey.replace("socialLinks_", "")}.`,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "logo" || name === "website") {
      setErrors((prev) => ({
        ...prev,
        [name]: isValidURL(value) ? "" : `Please enter a valid URL for ${name}.`,
      }));
    }

    // Clear error for name field on edit
    if (name === "name") {
      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const payload = {
      ...formData,
      user: authUser._id,
    };

    dispatch(createCompany(payload))
      .unwrap()
      .then(() => {
        toast.success("Company profile created successfully!");
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
        setErrors({});
        navigate("/company/dashboard");
      })
      .catch((err) => {
        toast.error(err || "Failed to create company profile.");
      });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center py-10 px-6 sm:px-12 lg:px-24">
      {/* Back button fixed top-left */}
      <button
        onClick={() => navigate("/company/dashboard")}
        aria-label="Go back"
        className="absolute top-2 left-3 px-4 py-2 rounded-lg z-50 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-lg"
      >
        &larr; Back
      </button>

      <div className="w-full mt-6 max-w-6xl bg-gradient-to-br from-indigo-100 via-indigo-50 to-indigo-100 rounded-lg shadow-lg p-10">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 drop-shadow">
          Create Company Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block mb-2 font-semibold text-indigo-700">
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-indigo-700">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-indigo-700">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
            <label className="block mb-2 font-semibold text-indigo-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 font-semibold text-indigo-700">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.logo && (
                <p className="text-red-600 text-sm mt-1">{errors.logo}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-indigo-700">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="https://example.com"
              />
              {errors.website && (
                <p className="text-red-600 text-sm mt-1">{errors.website}</p>
              )}
            </div>
          </div>

          <fieldset className="border border-indigo-300 p-6 rounded-lg">
            <legend className="font-semibold text-indigo-700 mb-5">Location</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["address", "city", "state", "country", "pincode"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 capitalize font-semibold text-indigo-700">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData.location[field]}
                    onChange={(e) => handleNestedChange(e, "location")}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="border border-indigo-300 p-6 rounded-lg mt-8">
            <legend className="font-semibold text-indigo-700 mb-5">Contact Person</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 capitalize font-semibold text-indigo-700">
                    {field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData.contactPerson[field]}
                    onChange={(e) => handleNestedChange(e, "contactPerson")}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  {field === "phone" && errors.contactPerson_phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.contactPerson_phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="border border-indigo-300 p-6 rounded-lg mt-8">
            <legend className="font-semibold text-indigo-700 mb-5">Social Links</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["linkedin", "twitter", "facebook"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 capitalize font-semibold text-indigo-700">
                    {field}
                  </label>
                  <input
                    type="url"
                    name={field}
                    value={formData.socialLinks[field]}
                    onChange={(e) => handleNestedChange(e, "socialLinks")}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder={`https://www.${field}.com/yourpage`}
                  />
                  {errors[`socialLinks_${field}`] && (
                    <p className="text-red-600 text-sm mt-1">{errors[`socialLinks_${field}`]}</p>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end mt-10">
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Create Company Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
