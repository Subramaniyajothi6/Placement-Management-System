import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthUser, logout } from "../slices/authSlice"; 
import { useNavigate } from "react-router";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";
  const isAdmin = user?.role === "admin";

  const handleViewProfileClick = () => {
    if (isStudent) {
      navigate(`/student/viewStudentProfile`);
    } else if (isCompany) {
      navigate(`/company/profile/${user._id}`);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Navigation links data for admin (you can adjust for company/student similarly)
  const adminLinks = [
    { name: "Report", path: "/admin/reports" },
    { name: "Placement Drive", path: "/admin/placementDrive" },
    { name: "Student Management", path: "/admin/student/profiles" },
  ];

  return (
    <nav className="bg-indigo-700 p-4 flex items-center justify-between flex-wrap relative">
      <div
        className="text-white font-bold text-xl cursor-pointer"
        onClick={() => {
          navigate("/");
          setMenuOpen(false);
        }}
      >
        Placement Management System
      </div>

      {/* Hamburger Icon shown on small screens */}
      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white text-3xl focus:outline-none"
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu />
        </button>
      </div>

      {/* Navigation links for medium & up */}
      <div className="hidden sm:flex sm:items-center sm:space-x-6 text-indigo-200 font-semibold">
        {isAdmin &&
          adminLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className="hover:text-white"
            >
              {link.name}
            </button>
          ))}

        {isCompany && (
          <>
            <button
              onClick={() => navigate("/companydashboard")}
              className="hover:text-white"
            >
              Company Dashboard
            </button>
            <button onClick={handleViewProfileClick} className="hover:text-white">
              View Profile
            </button>
          </>
        )}

        {isStudent && (
          <>
            <button
              onClick={() => navigate("/studentdashboard")}
              className="hover:text-white"
            >
              Student Dashboard
            </button>
            <button onClick={handleViewProfileClick} className="hover:text-white">
              View Profile
            </button>
          </>
        )}

        <button onClick={handleLogout} className="hover:text-white">
          Logout
        </button>
      </div>

      {/* Mobile menu - shown when hamburger is toggled */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-4 top-full mt-2 w-48 bg-indigo-700 rounded shadow-lg z-50 sm:hidden"
        >
          <div className="flex flex-col p-4 space-y-3 text-indigo-200 font-semibold">
            {isAdmin &&
              adminLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-white"
                >
                  {link.name}
                </button>
              ))}

            {isCompany && (
              <>
                <button
                  onClick={() => {
                    navigate("/companydashboard");
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-white"
                >
                  Company Dashboard
                </button>

                <button
                  onClick={() => {
                    handleViewProfileClick();
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-white"
                >
                  View Profile
                </button>
              </>
            )}

            {isStudent && (
              <>
                <button
                  onClick={() => {
                    navigate("/studentdashboard");
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-white"
                >
                  Student Dashboard
                </button>
                <button
                  onClick={() => {
                    handleViewProfileClick();
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-white"
                >
                  View Profile
                </button>
              </>
            )}

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-left hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
