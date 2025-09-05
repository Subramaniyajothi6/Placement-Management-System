import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  logout,
  registerUser,
  resetState,
  selectAuthError,
  selectAuthLoading,
  selectAuthMessage,
  selectAuthSuccess,
} from "../../slices/authSlice";
import { useEffect, useState } from "react";

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


    if (message) {
      alert(message);
    }
  }, [isSuccess, message]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password, role }));
    dispatch(logout());
    navigate('/login')


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-6 sm:p-12">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-w-md w-full p-10 sm:p-12">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              pattern="^\S+@\S+\.\S+$"
              title="Enter a valid email"
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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full px-5 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2 mb-1 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-md text-white font-semibold text-lg transition-colors ${isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline" >
            Login
          </Link>

        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
