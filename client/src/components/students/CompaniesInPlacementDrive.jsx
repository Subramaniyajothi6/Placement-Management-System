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
    <div className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow-lg">
      {/* Back button */}
      <button
        onClick={() => navigate("/student/dashboard")}
        className="inline-block mb-6 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Companies in Placement Drive
      </h1>

      {filteredCompanies.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No companies found for this placement drive.
        </p>
      ) : (
        <ul className="space-y-6">
          {filteredCompanies.map((company) => (
            <Link
              to={`/student/applyJob/${driveId}/${company._id}`}
              key={company._id}
              className="block focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg"
            >
              <li className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 transition cursor-pointer">
                <h2 className="text-xl font-semibold text-indigo-700 mb-1">
                  {company.name}
                </h2>
                {company.industry && (
                  <p className="text-gray-700 mb-2">{company.industry}</p>
                )}

                <div className="flex items-center space-x-4 text-gray-600 text-sm">
                  {company.location?.city && (
                    <span className="flex items-center space-x-1">
                      <FiMapPin />
                      <span>
                        {company.location.city}, {company.location.country}
                      </span>
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-indigo-600 hover:underline"
                      onClick={e => e.stopPropagation()} // prevent Link navigation
                    >
                      <FiGlobe />
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
  );
};

export default CompaniesInPlacementDrive;
