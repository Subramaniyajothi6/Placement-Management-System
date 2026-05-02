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
    if (isStudent) navigate(`/student/viewStudentProfile`);
    else if (isCompany) navigate(`/company/profile/${user._id}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const adminLinks = [
    { name: "Reports", path: "/admin/reports" },
    { name: "Placement Drives", path: "/admin/placementDrive" },
    { name: "Students", path: "/admin/student/profiles" },
  ];

  const navBtn =
    "px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] font-medium transition-colors";

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => { navigate("/"); setMenuOpen(false); }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/40">
              <span className="text-white font-black text-sm leading-none">P</span>
            </div>
            <span className="font-bold text-white text-base tracking-tight group-hover:text-indigo-400 transition-colors">
              PlacementMS
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {isAdmin && adminLinks.map((link) => (
              <button key={link.name} onClick={() => navigate(link.path)} className={navBtn}>
                {link.name}
              </button>
            ))}

            {isCompany && (
              <>
                <button onClick={() => navigate("/companydashboard")} className={navBtn}>Dashboard</button>
                <button onClick={handleViewProfileClick} className={navBtn}>Profile</button>
              </>
            )}

            {isStudent && (
              <>
                <button onClick={() => navigate("/studentdashboard")} className={navBtn}>Dashboard</button>
                <button onClick={handleViewProfileClick} className={navBtn}>Profile</button>
              </>
            )}

            <div className="w-px h-5 bg-white/10 mx-2 flex-shrink-0" />

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-500 font-semibold transition-colors shadow-lg shadow-indigo-900/40"
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <RxHamburgerMenu className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="sm:hidden border-t border-white/[0.08] bg-[#0f172a]/95 backdrop-blur-xl"
        >
          <div className="px-4 py-3 space-y-1">
            {isAdmin && adminLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => { navigate(link.path); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}

            {isCompany && (
              <>
                <button onClick={() => { navigate("/companydashboard"); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] font-medium transition-colors">
                  Dashboard
                </button>
                <button onClick={() => { handleViewProfileClick(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] font-medium transition-colors">
                  Profile
                </button>
              </>
            )}

            {isStudent && (
              <>
                <button onClick={() => { navigate("/studentdashboard"); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] font-medium transition-colors">
                  Dashboard
                </button>
                <button onClick={() => { handleViewProfileClick(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] font-medium transition-colors">
                  Profile
                </button>
              </>
            )}

            <div className="pt-2 mt-1 border-t border-white/[0.08]">
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
