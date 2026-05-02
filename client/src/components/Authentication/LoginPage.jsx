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
import toast from "react-hot-toast";

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
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(message || "Login failed, please try again.");
    }
  }, [error, message]);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-6">
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 bg-[#1e293b] border border-white/[0.08] rounded-2xl max-w-md w-full p-8 sm:p-10 shadow-2xl">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <span className="text-white font-black text-base leading-none">P</span>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">PlacementMS</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1 text-center">Welcome back</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && message && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm text-center">{message}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
