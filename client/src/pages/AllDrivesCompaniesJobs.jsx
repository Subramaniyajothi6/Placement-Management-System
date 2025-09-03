import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, selectJobs } from "../slices/jobSlice";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { fetchCompanies, selectAllCompanies } from "../slices/companySlice";
import { useEffect, useState } from "react";

const AllDrivesCompaniesJobs = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const placementDrives = useSelector(selectPlacementDrives);
  const companies = useSelector(selectAllCompanies);

useEffect(() => {
    companies.map(c =>{
    console.log("Company:", c.name, "ID:", c._id);
})
    jobs.map(j =>{
    console.log("Job:", j.title, "Company ID:", j.company);
})
}, [companies , jobs]);
 

  const [selectedDriveId, setSelectedDriveId] = useState("");

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchPlacementDrives());
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Helper: return company name by id
  const getCompanyName = (companyId) => companies.find((c) => c._id === companyId  )?.name || companyId ;
//    console.log("Unknown company ID:", companyId,'  ',
//     console.log("Companies:", companies.map(c => c._id))
//     );
  

  // Categorize jobs by placementDrive and company
  const categorized = {};
  jobs.forEach((job) => {
    const driveId = job.placementDrive?._id || job.placementDrive;
    if (!categorized[driveId]) categorized[driveId] = {};
    if (!categorized[driveId][job.company]) categorized[driveId][job.company] = [];
    categorized[driveId][job.company].push(job);
  });

  // Drives to show depending on selection
  const drivesToShow = selectedDriveId
    ? placementDrives.filter((d) => d._id === selectedDriveId)
    : placementDrives;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Placement Drives, Companies, and Jobs</h2>

      <div className="mb-4">
        <label className="mr-2">Filter by Placement Drive:</label>
        <select
          value={selectedDriveId}
          onChange={(e) => setSelectedDriveId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Drives</option>
          {placementDrives.map((drive) => (
            <option key={drive._id} value={drive._id}>
              {drive.title}
            </option>
          ))}
        </select>
      </div>

      {drivesToShow.length === 0 && <p>No placement drives found.</p>}

      {drivesToShow.map((drive) => (
        <div key={drive._id} className="mb-8">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            {drive.title}
          </h3>
          {categorized[drive._id] ? (
            Object.keys(categorized[drive._id]).map((companyId) => (
              <div key={companyId} className="mb-6 ml-5">
                <div className="font-bold text-indigo-700 mb-1">
                  Company: {getCompanyName(companyId)}
                </div>
                <ul className="list-disc ml-7">
                  {categorized[drive._id][companyId].map((job) => (
                    <li key={job._id}>
                      <span className="font-semibold">{job.title}</span>
                      {job.location && <span>, {job.location}</span>}
                      {job.salary && <span> — {job.salary}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="ml-5 text-gray-500">No companies or jobs.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllDrivesCompaniesJobs;
