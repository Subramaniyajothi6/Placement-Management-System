import { useState, useEffect } from "react";
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
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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
    setIsDirty(true);
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
    setIsDirty(true);
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
        setIsDirty(false);
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

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm";
  const labelClass = "block mb-1.5 text-sm font-medium text-gray-300 capitalize";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/company/dashboard")}
          aria-label="Go back"
          className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          &larr; Back
        </button>

        <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8">
          <h2 className="text-2xl font-black text-white mb-1">Create Company Profile</h2>
          <p className="text-gray-400 text-sm mb-8">Fill in your company details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Company Name <span className="text-red-400">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className={inputClass}>
                  {["1-10","11-50","51-200","201-500","501-1000","1000+"].map(s => (
                    <option key={s} value={s} className="bg-[#1e293b] text-white">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Logo URL</label>
                <input type="url" name="logo" value={formData.logo} onChange={handleChange} className={inputClass} />
                {errors.logo && <p className="text-red-400 text-xs mt-1">{errors.logo}</p>}
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="https://example.com" />
                {errors.website && <p className="text-red-400 text-xs mt-1">{errors.website}</p>}
              </div>
            </div>

            <fieldset className="border border-white/[0.08] p-5 rounded-xl">
              <legend className="text-sm font-semibold text-gray-300 px-2">Location</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
                {["address", "city", "state", "country", "pincode"].map((field) => (
                  <div key={field}>
                    <label className={labelClass}>{field}</label>
                    <input type="text" name={field} value={formData.location[field]} onChange={(e) => handleNestedChange(e, "location")} className={inputClass} />
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-white/[0.08] p-5 rounded-xl">
              <legend className="text-sm font-semibold text-gray-300 px-2">Contact Person</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className={labelClass}>{field}</label>
                    <input type={field === "email" ? "email" : "text"} name={field} value={formData.contactPerson[field]} onChange={(e) => handleNestedChange(e, "contactPerson")} className={inputClass} />
                    {field === "phone" && errors.contactPerson_phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.contactPerson_phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-white/[0.08] p-5 rounded-xl">
              <legend className="text-sm font-semibold text-gray-300 px-2">Social Links</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
                {["linkedin", "twitter", "facebook"].map((field) => (
                  <div key={field}>
                    <label className={labelClass}>{field}</label>
                    <input type="url" name={field} value={formData.socialLinks[field]} onChange={(e) => handleNestedChange(e, "socialLinks")} className={inputClass} placeholder={`https://www.${field}.com/yourpage`} />
                    {errors[`socialLinks_${field}`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`socialLinks_${field}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
              >
                Create Company Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
