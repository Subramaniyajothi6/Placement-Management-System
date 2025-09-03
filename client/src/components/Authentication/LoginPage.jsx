import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  loginUser,
  resetState,
  selectAuthError,
  selectAuthLoading,
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
              navigate(`/${user._id}/profile`);
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
          console.log(resAction.payload.filter((c) => c.user === user._id));
          
          // fetch all company profiles
          if (
            fetchCompanies.fulfilled.match(resAction) &&
            resAction.payload &&
            Array.isArray(resAction.payload)
          ) {
            const profileExists = resAction.payload.some(
              (profile) => profile.user === user._id
            );
            console.log(profileExists);
            

            if (profileExists) {
              navigate("/company/dashboard");
            } else {
              navigate(`/${user._id}/companyProfile`);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold text-lg transition-colors ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
