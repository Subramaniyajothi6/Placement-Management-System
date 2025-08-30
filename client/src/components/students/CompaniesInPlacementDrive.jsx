// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router";
// import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
// import { useEffect } from "react";
// import { fetchJobs, selectJobs } from "../../slices/jobSlice";

import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { fetchCompanies, selectAllCompanies } from "../../slices/companySlice";
import { fetchJobs, selectJobs } from "../../slices/jobSlice";
import { useEffect } from "react";

// const CompaniesInPlacementDrive = () => {
//   const dispatch = useDispatch();
//   const {driveId} = useParams();
//   const companies = useSelector(selectAllCompanies);
//  let job = useSelector(selectJobs)

//   // console.log(companies);
//   // console.log(driveId);
//   // console.log(job);

//   // companies.filter((company)={ })

//   useEffect(() => {
//     dispatch(fetchCompanies());
//   }, [dispatch]);

//   useEffect(()=>{
//     dispatch(fetchJobs());
//   },[dispatch])

//    const filteredJobs = job.filter((job)=>(job.placementDrive._id === driveId))

// // console.log(filteredJobs)

// // const companiesInJob = filteredJobs.map((job)=>(job.company))
// // console.log(companiesInJob)

// filteredJobs.forEach((job)=>{
//  const companiesInJob =  companies.filter((company)=>(company._id === job.company))
// console.log(companiesInJob)

// })


// // const companiesInDrive = companies.filter((company)=>(company._id === companiesInJob))
// // console.log(companiesInDrive)

//   const filteredCompanies = companies.filter(
//     (company) =>
//       company.placementDrives &&
//       company.placementDrives.some(
//         (drive) =>
//           drive._id === placementDriveId || drive === placementDriveId
//       )
//   );

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         Companies in Placement Drive
//       </h2>
//       {filteredCompanies.length === 0 ? (
//         <p className="text-center text-gray-500">No companies found for this placement drive.</p>
//       ) : (
//         <ul className="space-y-3">
//           {filteredCompanies.map((company) => (
//             <li
//               key={company._id}
//               className="p-4 border rounded bg-gray-50 flex flex-col items-start"
//             >
//               <span className="text-lg font-bold">{company.name}</span>
//               {company.industry && (
//                 <span className="text-sm text-gray-700">{company.industry}</span>
//               )}
//               {company.location?.city && (
//                 <span className="text-sm text-gray-500">
//                   {company.location.city}, {company.location.country}
//                 </span>
//               )}
//               {company.website && (
//                 <a
//                   href={company.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 text-sm hover:underline"
//                 >
//                   Visit website
//                 </a>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CompaniesInPlacementDrive;




const CompaniesInPlacementDrive = () => {
  const dispatch = useDispatch();
  const { driveId } = useParams();
  const companies = useSelector(selectAllCompanies);
  const jobs = useSelector(selectJobs);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchJobs());
  }, [dispatch]);

  // 1. Get all jobs in this placement drive
  const jobsInDrive = jobs.filter(
    (job) =>
      job.placementDrive?._id === driveId ||
      job.placementDrive === driveId // In case some jobs are populated, others are string IDs
  );

  // 2. Get unique company IDs for jobs in the drive
  const uniqueCompanyIds = [
    ...new Set(
      jobsInDrive.map((job) =>
        typeof job.company === "string" ? job.company : job.company?._id
      )
    ),
  ];

  // 3. Filter company objects present in this drive
  const filteredCompanies = companies.filter((company) =>
    uniqueCompanyIds.includes(company._id)
  );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Companies in this Placement Drive
      </h2>
      {filteredCompanies.length === 0 ? (
        <p className="text-center text-gray-500">
          No companies found for this placement drive.
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredCompanies.map((company) => (
            <Link to={`/student/applyJob/${driveId}/${company._id}`} key={company._id}>
              <li
               
                className="p-4 border rounded bg-gray-50 flex flex-col items-start"
              >
                <span className="text-lg font-bold">{company.name}</span>
                {company.industry && (
                  <span className="text-sm text-gray-700">{company.industry}</span>
                )}
                {company.location?.city && (
                  <span className="text-sm text-gray-500">
                    {company.location.city}, {company.location.country}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Visit website
                  </a>
                )}
              </li>
            </Link>

          ))}
        </ul>
      )}
    </div>
  );
};

export default CompaniesInPlacementDrive;
