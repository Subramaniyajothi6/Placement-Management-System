import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { fetchPlacementDrives, selectPlacementDrives } from "../slices/placementDriveSlice";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Navbar from "./Navbar";

const CommonDashboard = () => {
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
    <div className="p-6 max-w-7xl mx-auto space-y-16">
      <Navbar />
      <header className="flex flex-col sm:flex-row justify-center items-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          Placement Dashboard
        </h1>
      </header>

      {/* Role-based message */}
      <p className="text-lg font-medium text-gray-700 mb-8 text-center mx-auto max-w-3xl">
        {isCompany &&
          "Select the placement drive to post the job for your company."}
        {isStudent &&
          "Select the placement drive that you want to apply for."}
        {isAdmin &&
          "As an admin, you can view and manage placement drives for both students and companies."}
        {!isCompany && !isStudent && !isAdmin &&
          "Please log in to interact with placement drives."}
      </p>

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Student Drives Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-3 text-gray-800 text-center sm:text-left">
              Student Placement Drives
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {placementDrives.map((drive) => (
                <li
                  key={drive._id}
                  onClick={() => handleDriveClick(drive._id, "student")}
                  tabIndex={0}
                  role="button"
                  className="border rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-white p-6 flex flex-col justify-between transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
                >
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-indigo-700">{drive.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{new Date(drive.date).toLocaleDateString()}</p>
                    <p className="text-gray-700 line-clamp-3">{drive.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Company Drives Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-3 text-gray-800 text-center sm:text-left">
              Company Placement Drives
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {placementDrives.map((drive) => (
                <li
                  key={drive._id}
                  onClick={() => handleDriveClick(drive._id, "company")}
                  tabIndex={0}
                  role="button"
                  className="border rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-white p-6 flex flex-col justify-between transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
                >
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-indigo-700">{drive.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{new Date(drive.date).toLocaleDateString()}</p>
                    <p className="text-gray-700 line-clamp-3">{drive.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-3 text-gray-800 text-center sm:text-left">
            Placement Drives
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {placementDrives.map((drive) => (
              <li
                key={drive._id}
                onClick={() => handleDriveClick(drive._id, isStudent ? "student" : "company")}
                tabIndex={0}
                role="button"
                className="border rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-white p-6 flex flex-col justify-between transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
              >
                <div>
                  <h3 className="font-bold text-xl mb-2 text-indigo-700">{drive.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{new Date(drive.date).toLocaleDateString()}</p>
                  <p className="text-gray-700 line-clamp-3">{drive.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default CommonDashboard;
