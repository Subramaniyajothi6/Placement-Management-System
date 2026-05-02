import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { fetchJobs, selectJobs } from "../../slices/jobSlice";
import { useEffect } from "react";
import { FiMapPin, FiGlobe } from "react-icons/fi";

const CompaniesInPlacementDrive = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { driveId } = useParams();
  const companies = useSelector(selectAllCompanies);
  const jobs = useSelector(selectJobs);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchJobs());
  }, [dispatch]);

  const jobsInDrive = jobs.filter(
    (job) =>
      job.placementDrive?._id === driveId ||
      job.placementDrive === driveId
  );

  const uniqueCompanyIds = [
    ...new Set(
      jobsInDrive.map((job) =>
        typeof job.company === "string" ? job.company : job.company?._id
      )
    ),
  ];

  const filteredCompanies = companies.filter((company) =>
    uniqueCompanyIds.includes(company._id)
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#243347] border border-white/[0.1] text-gray-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          &larr; Back to Dashboard
        </button>

        <h1 className="text-2xl font-black mb-8 text-white">
          Companies in Placement Drive
        </h1>

        {filteredCompanies.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No companies found for this placement drive.
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredCompanies.map((company) => (
              <Link
                to={`/student/applyJob/${driveId}/${company._id}`}
                key={company._id}
                className="block focus:outline-none focus:ring-2 focus:ring-indigo-500/40 rounded-xl"
              >
                <li className="p-6 bg-[#1e293b] border border-white/[0.08] rounded-xl hover:bg-[#243347] hover:border-white/[0.14] transition cursor-pointer">
                  <h2 className="text-base font-semibold text-white mb-1">{company.name}</h2>
                  {company.industry && <p className="text-gray-400 text-sm mb-2">{company.industry}</p>}
                  <div className="flex items-center gap-4 text-sm">
                    {company.location?.city && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <FiMapPin className="text-xs" />
                        <span>{company.location.city}, {company.location.country}</span>
                      </span>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        <FiGlobe className="text-xs" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompaniesInPlacementDrive;
