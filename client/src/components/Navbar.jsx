import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate } from "react-router";

const Navbar = () => {
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";
  const isAdmin = user?.role === "admin";

  const handleViewProfileClick = () => {
    if (isStudent) {
      navigate(`/student/viewStudentProfile`);
    } else if (isCompany) {
      navigate(`/company/profile/${user._id}`);
    }
  };

  return (
    <nav className="bg-indigo-700 p-4 flex items-center justify-between flex-wrap">
      <div
        className="text-white font-bold text-xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        YourAppName
      </div>

      {/* Hamburger menu button for small screens */}
      <div className="block sm:hidden">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation links */}
      <div
        className={`w-full sm:flex sm:items-center sm:w-auto ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <div className="text-sm sm:flex-grow">
          {isAdmin &&
            [
              { name: "Report", path: "/admin/reports" },
              { name: "Placement Drive", path: "/admin/placementDrive" },
              { name: "Student Management", path: "/admin/student/profiles" },
            ].map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                }}
                className="block mt-4 sm:inline-block sm:mt-0 text-indigo-200 hover:text-white mr-6"
              >
                {link.name}
              </button>
            ))}

          {(isStudent || isCompany) && (
            <button
              onClick={() => {
                handleViewProfileClick();
                setMenuOpen(false);
              }}
              className="block mt-4 sm:inline-block sm:mt-0 text-indigo-200 hover:text-white font-semibold"
            >
              View Profile
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
