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
    name: "", industry: "", size: "1-10", description: "", logo: "", website: "",
    location: { address: "", city: "", state: "", country: "", pincode: "" },
    contactPerson: { name: "", email: "", phone: "" },
    socialLinks: { linkedin: "", twitter: "", facebook: "" },
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!company) dispatch(fetchCompanies());
    else setFormData(company);
  }, [company, dispatch]);

  const handleNestedChange = (e, parentKey) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [parentKey]: { ...prev[parentKey], [name]: value } }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setError("");
    dispatch(updateCompany({ id: company._id, data: formData }))
      .unwrap()
      .then(() => {
        setEditMode(false);
        toast.success("Company profile updated successfully!");
      })
      .catch((err) => setError("Failed to update company: " + (err?.message || err)));
  };

  if (!company)
    return <div className="text-center py-20 text-gray-400 text-sm">Loading company profile…</div>;

  const inputClass = "w-full p-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition text-sm";
  const viewClass = "p-3 rounded-xl bg-[#172033] border border-white/[0.06] text-gray-300 text-sm min-h-[44px] break-all";

  const Field = ({ label, editNode, viewNode }) => (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-gray-300 capitalize">{label}</label>
      {editMode ? editNode : viewNode}
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        <div className="bg-[#1e293b] border border-white/[0.08] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-2xl font-black text-white">Company Profile</h2>
              <p className="text-gray-400 text-sm mt-1">Manage your company information</p>
            </div>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40">
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field
                label="Company Name *"
                editNode={<input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />}
                viewNode={<div className={viewClass}>{formData.name}</div>}
              />
              <Field
                label="Website"
                editNode={<input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="https://yourcompany.com" />}
                viewNode={
                  formData.website
                    ? <a href={formData.website} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl bg-[#172033] border border-white/[0.06] text-indigo-400 hover:text-indigo-300 hover:underline text-sm break-all">{formData.website}</a>
                    : <div className={viewClass}>—</div>
                }
              />
              <Field
                label="Size"
                editNode={
                  <select name="size" value={formData.size} onChange={handleChange} className={`${inputClass} [&>option]:bg-[#1e293b] [&>option]:text-white`}>
                    {["1-10","11-50","51-200","201-500","501-1000","1000+"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                }
                viewNode={<div className={viewClass}>{formData.size}</div>}
              />
            </div>

            <Field
              label="Description"
              editNode={<textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={`${inputClass} resize-y`} />}
              viewNode={<div className={`${viewClass} whitespace-pre-line min-h-[80px]`}>{formData.description || "—"}</div>}
            />

            <fieldset className="border border-white/[0.08] rounded-xl p-5">
              <legend className="text-sm font-semibold text-gray-300 px-2">Location</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {["address", "city", "state", "country", "pincode"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1.5 text-xs font-medium text-gray-400 capitalize">{field}</label>
                    {editMode
                      ? <input type="text" name={field} value={formData.location[field]} onChange={(e) => handleNestedChange(e, "location")} className={inputClass} />
                      : <div className={viewClass}>{formData.location[field] || "—"}</div>
                    }
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-white/[0.08] rounded-xl p-5">
              <legend className="text-sm font-semibold text-gray-300 px-2">Contact Person</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1.5 text-xs font-medium text-gray-400 capitalize">{field}</label>
                    {editMode
                      ? <input type={field === "email" ? "email" : "text"} name={field} value={formData.contactPerson[field]} onChange={(e) => handleNestedChange(e, "contactPerson")} className={inputClass} />
                      : <div className={viewClass}>{formData.contactPerson[field] || "—"}</div>
                    }
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-white/[0.08] rounded-xl p-5">
              <legend className="text-sm font-semibold text-gray-300 px-2">Social Links</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {["linkedin", "twitter", "facebook"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1.5 text-xs font-medium text-gray-400 capitalize">{field}</label>
                    {editMode
                      ? <input type="url" name={field} value={formData.socialLinks[field]} onChange={(e) => handleNestedChange(e, "socialLinks")} className={inputClass} placeholder={`https://www.${field}.com/yourpage`} />
                      : formData.socialLinks[field]
                        ? <a href={formData.socialLinks[field]} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl bg-[#172033] border border-white/[0.06] text-indigo-400 hover:text-indigo-300 hover:underline text-sm break-all">{formData.socialLinks[field]}</a>
                        : <div className={viewClass}>—</div>
                    }
                  </div>
                ))}
              </div>
            </fieldset>

            {editMode && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setFormData(company); setError(""); }}
                  className="px-6 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm font-semibold hover:bg-[#243347] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
