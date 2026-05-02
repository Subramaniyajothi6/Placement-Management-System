import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { useEffect } from "react";
import Navbar from "./Navbar";
import { formatDate } from "../utils/dateUtils";

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

  const driveCardClass =
    "p-6 bg-[#1e293b] border border-white/[0.08] rounded-xl cursor-pointer transition hover:bg-[#243347] hover:border-white/[0.14] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40";

  return (
    <div className="min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white text-center">
            Placement Dashboard
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium text-gray-400 text-center max-w-2xl">
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
              <section>
                <h2 className="text-xl font-bold mb-6 text-gray-300 border-b border-white/[0.08] pb-3">
                  Student Placement Drives
                </h2>
                <ul className="grid grid-cols-1 gap-4">
                  {placementDrives.map((drive) => (
                    <li
                      key={drive._id}
                      onClick={() => handleDriveClick(drive._id, "student")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDriveClick(drive._id, "student");
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className={driveCardClass}
                    >
                      <h3 className="text-base font-semibold text-white mb-1 truncate">{drive.title}</h3>
                      <div className="flex items-center text-xs mb-2 text-gray-500">
                        <span>{formatDate(drive.startDate)}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{drive.description}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Company Drives */}
              <section>
                <h2 className="text-xl font-bold mb-6 text-gray-300 border-b border-white/[0.08] pb-3">
                  Company Placement Drives
                </h2>
                <ul className="grid grid-cols-1 gap-4">
                  {placementDrives.map((drive) => (
                    <li
                      key={drive._id}
                      onClick={() => handleDriveClick(drive._id, "company")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDriveClick(drive._id, "company");
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className={driveCardClass}
                    >
                      <h3 className="text-base font-semibold text-white mb-1 truncate">{drive.title}</h3>
                      <div className="flex items-center text-xs mb-2 text-gray-500">
                        <span>{formatDate(drive.startDate)}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{drive.description}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            <section>
              <h2 className="text-xl font-bold mb-6 text-gray-300 border-b border-white/[0.08] pb-3 text-center sm:text-left">
                Placement Drives
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {placementDrives.map((drive) => (
                  <li
                    key={drive._id}
                    onClick={() => handleDriveClick(drive._id, isStudent ? "student" : "company")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDriveClick(drive._id, isStudent ? "student" : "company");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    className={driveCardClass}
                  >
                    <h3 className="text-base font-semibold text-white mb-1 truncate">{drive.title}</h3>
                    <div className="flex items-center text-xs mb-2 text-gray-500">
                      <span>{formatDate(drive.startDate)}</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-3 min-h-[56px]">{drive.description}</p>
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
