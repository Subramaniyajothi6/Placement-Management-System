import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  registerUser,
  resetState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  selectAuthSuccess,
} from "../../slices/authSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);
  const isSuccess = useSelector(selectAuthSuccess);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  useEffect(() => {
    if (error) {
      toast.error(message || "Registration failed. Please try again.");
    }
  }, [error, message]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ name, email, password, role })).unwrap();
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch {
      // error displayed via the error selector above the button
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm transition-all";

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

        <h2 className="text-2xl font-black text-white mb-1 text-center">Create your account</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Join the placement platform today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1.5 text-sm font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              id="name"
              className={inputClass}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              autoFocus
              minLength={2}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              id="email"
              className={inputClass}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              pattern="^\S+@\S+\.\S+$"
              title="Enter a valid email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className={inputClass}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1.5 text-sm font-medium text-gray-300">I am a...</label>
            <select
              id="role"
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="student" className="bg-[#1e293b] text-white">Student</option>
              <option value="company" className="bg-[#1e293b] text-white">Company</option>
              <option value="admin" className="bg-[#1e293b] text-white">Admin</option>
            </select>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/40 mt-2"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;



