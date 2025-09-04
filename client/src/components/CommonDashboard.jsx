import { useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";

const CommonDashboard = () => {
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-white to-indigo-100 pt-20 px-6 sm:px-12 lg:px-24">
      <div className="w-full text-center space-y-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-600 drop-shadow-lg leading-tight">
          Welcome to Placement Management System
        </h1>
        <p className="text-lg md:text-xl text-indigo-700 leading-relaxed mx-auto">
          Are you a <span className="font-semibold">student</span> looking to apply for exciting opportunities? Or a <span className="font-semibold">company</span> ready to post your placement drives?
          Login if you have an account, or register to get started!
        </p>
        <div className="flex justify-center space-x-10  ">
          <Link
            to="/login"
            className="px-8  py-2 bg-indigo-600 text-white rounded-2xl text-lg font-semibold shadow-xl hover:bg-indigo-700 hover:scale-105 transition transform"
            aria-label="Login"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-2 border-2 border-indigo-600 text-indigo-600 rounded-2xl text-lg font-semibold shadow-xl hover:bg-indigo-100 hover:scale-105 transition transform"
            aria-label="Register"
          >
            Register
          </Link>
        </div>
        <p className="text-indigo-700 font-medium mx-auto text-center">
          Once logged in, students can browse and apply for placement drives, and companies can post jobs for their drives.
        </p>
      </div>
    </div>
  );
};

export default CommonDashboard;
