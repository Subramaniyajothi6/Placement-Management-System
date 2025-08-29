import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { fetchCompanies, selectAllCompanies } from "../slices/companySlice";
import { useEffect } from "react";

const CommonDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const placementDrives = useSelector(selectPlacementDrives);
  const companies = useSelector(selectAllCompanies);
  const navigate = useNavigate();

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";

  useEffect(() => {
    dispatch(fetchPlacementDrives());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleApplyClick = (jobId) => {
    if (!isStudent) {
      alert("Please log in as a student to apply for jobs.");
      navigate("/login");
      return;
    }
    navigate(`/jobs/apply/${jobId}`);
  };

  const handlePostJobClick = () => {
    if (!isCompany) {
      alert("Please log in as a company to post jobs.");
      navigate("/login");
      return;
    }
    navigate("/company/postJob/");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Placement Dashboard</h1>
        {isCompany && (
          <button
            onClick={handlePostJobClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-md font-semibold transition"
          >
            Post a Job
          </button>
        )}
      </header>

      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2 text-gray-800">
          Placement Drives
        </h2>
        <ul className="grid md:grid-cols-3 gap-6">
          {placementDrives.map((drive) => (
            <li
              key={drive._id}
              onClick={() => navigate(`/company/drives/${drive._id}`)}
              tabIndex={0}
              role="button"
              className="border rounded-lg shadow hover:shadow-lg cursor-pointer bg-white p-5 flex flex-col justify-between transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div>
                <h3 className="font-bold text-xl mb-1 text-indigo-700">{drive.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{new Date(drive.date).toLocaleDateString()}</p>
                <p className="text-gray-700 line-clamp-3">{drive.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b pb-2 text-gray-800">
          Companies & Job Openings
        </h2>
        <ul className="space-y-8">
          {companies.map((company) => (
            <li
              key={company._id}
              className="bg-white hover:bg-amber-50 rounded-lg shadow p-6"
            >
              <div
                onClick={() => navigate(`/companies/${company._id}`)}
                tabIndex={0}
                role="button"
                className="cursor-pointer "
              >
                <h3 className="text-2xl font-semibold hover:text-indigo-600 transition">{company.name}</h3>
              </div>

              <div className="mt-5 space-y-4">
                {company.jobs?.length === 0 && (
                  <p className="text-gray-500 italic">No open positions currently.</p>
                )}

                {company.jobs?.map((job) => (
                  <div
                    key={job._id}
                    className="flex justify-between items-center border rounded-lg p-4 hover:bg-indigo-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-lg">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                    <button
                      onClick={() => handleApplyClick(job._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CommonDashboard;
