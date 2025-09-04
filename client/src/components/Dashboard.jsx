import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { useEffect } from "react";
import Navbar from "./Navbar";

const Dashboard = () => {


  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const placementDrives = useSelector(selectPlacementDrives);
  const navigate = useNavigate();

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    dispatch(fetchPlacementDrives());
  }, [dispatch]);

  const handleDriveClick = (driveId, role) => {
    if (role === "student") {
      navigate(`/student/applyJob/${driveId}`);
    } else if (role === "company") {
      navigate(`/company/postJob/${driveId}`);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-indigo-800 text-center">
            Placement Dashboard
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium text-indigo-700 text-center max-w-2xl">
            {isCompany &&
              "Select a placement drive to post jobs for your company."}
            {isStudent &&
              "Select a placement drive to explore and apply for opportunities."}
            {isAdmin &&
              "As an admin, view and manage placement drives for both students and companies."}
            {!isCompany && !isStudent && !isAdmin &&
              "Please log in to interact with placement drives."}
          </p>
        </header>

        <main className="space-y-12">
          {isAdmin ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
              {/* Student Drives */}
              <section className="">
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b-2 border-indigo-100 pb-2">
                  Student Placement Drives
                </h2>
                <ul className="grid grid-cols-1 gap-8">
                  {placementDrives.map((drive) => (
                    <li
                      key={drive._id}
                      onClick={() => handleDriveClick(drive._id, "student")}
                      tabIndex={0}
                      role="button"
                      className="p-6 bg-white rounded-xl border border-indigo-100 shadow hover:shadow-xl cursor-pointer transition ease-in-out duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-indigo-800 mb-1 truncate">{drive.title}</h3>
                        <div className="flex items-center text-sm mb-3 text-gray-500">
                          <span>{drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <p className="text-gray-700 line-clamp-3 min-h-[56px]">{drive.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Company Drives */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b-2 border-indigo-100 pb-2">
                  Company Placement Drives
                </h2>
                <ul className="grid grid-cols-1 gap-8">
                  {placementDrives.map((drive) => (
                    <li
                      key={drive._id}
                      onClick={() => handleDriveClick(drive._id, "company")}
                      tabIndex={0}
                      role="button"
                      className="p-6 bg-white rounded-xl border border-indigo-100 shadow hover:shadow-xl cursor-pointer transition focus:outline-none focus:ring-4 focus:ring-indigo-200"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-indigo-800 mb-1 truncate">{drive.title}</h3>
                        <div className="flex items-center text-sm mb-3 text-gray-500">
                         <span>{drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <p className="text-gray-700 line-clamp-3 min-h-[56px]">{drive.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-indigo-700 border-b-2 border-indigo-100 pb-2 text-center sm:text-left">
                Placement Drives
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {placementDrives.map((drive) => (
                  <li
                    key={drive._id}
                    onClick={() => handleDriveClick(drive._id, isStudent ? "student" : "company")}
                    tabIndex={0}
                    role="button"
                    className="p-6 bg-white rounded-xl border border-indigo-100 shadow hover:shadow-xl cursor-pointer transition focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-800 mb-1 truncate">{drive.title}</h3>
                      <div className="flex items-center text-sm mb-3 text-gray-500">
                        <span>{drive.startDate ? new Date(drive.startDate).toLocaleDateString() : "N/A"}</span>
                      </div>
                      <p className="text-gray-700 line-clamp-3 min-h-[56px]">{drive.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
