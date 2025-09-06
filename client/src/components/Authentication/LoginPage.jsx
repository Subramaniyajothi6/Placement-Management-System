import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  loginUser,
  resetState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  selectAuthUser,
} from "../../slices/authSlice";
import { fetchStudents } from "../../slices/studentSlice";
import { fetchCompanies } from "../../slices/companySlice";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const user = useSelector(selectAuthUser);
  const message = useSelector(selectAuthMessage);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkProfile() {
      if (user?.role === "student") {
        try {
          const resAction = await dispatch(fetchStudents()); // fetch all student profiles
          if (
            fetchStudents.fulfilled.match(resAction) &&
            resAction.payload &&
            Array.isArray(resAction.payload)
          ) {
            const profileExists = resAction.payload.some(
              (profile) => profile.userId === user._id
            );

            if (profileExists) {
              navigate("/student/dashboard");
            } else {
              navigate(`/student/studentProfile`);
            }
          } else {
            navigate("/student/dashboard");
          }
        } catch {
          navigate("/student/dashboard");
        }
      } else if (user?.role === "company") {
        try {
          const resAction = await dispatch(fetchCompanies());
          if (
            fetchCompanies.fulfilled.match(resAction) &&
            resAction.payload &&
            Array.isArray(resAction.payload)
          ) {
            const profileExists = resAction.payload.some(
              (profile) => profile.user === user._id
            );

            if (profileExists) {
              navigate("/company/dashboard");
            } else {
              navigate(`/company/companyProfile`);
            }
          } else {
            navigate("/company/dashboard");
          }
        } catch {
          navigate("/company/dashboard");
        }
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      }
    }

    if (user) {
      checkProfile();
    } else {
      navigate("/login");
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(message || "Login failed, please try again.");
    }
  }, [error, message]);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-6 sm:p-12">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
          )}
          <button
            type="submit"
            className={`w-full py-4 rounded-md text-white font-semibold text-lg transition-colors ${isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
