import { useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";

const StudentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-blue-400" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3.333 1.667 8.667 1.667 12 0v-5" />
  </svg>
);

const CompanyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-400" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth={2} />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-violet-400" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const features = [
  {
    Icon: StudentIcon,
    iconBg: "bg-blue-500/10",
    title: "For Students",
    desc: "Browse placement drives, apply for jobs, and track your application status in real time.",
  },
  {
    Icon: CompanyIcon,
    iconBg: "bg-indigo-500/10",
    title: "For Companies",
    desc: "Post jobs, review applications, and schedule interviews with top student talent.",
  },
  {
    Icon: AdminIcon,
    iconBg: "bg-violet-500/10",
    title: "For Admins",
    desc: "Manage drives, generate placement reports, and oversee the full recruitment process.",
  },
];

const CommonDashboard = () => {
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 mb-6 tracking-wide uppercase">
          <span className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_6px_2px_rgba(99,102,241,0.8)] animate-pulse" />
          Placement Management Platform
        </span>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
          Your Career{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            Starts Here
          </span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with top companies through seamless placement drives.
          Apply for jobs, schedule interviews, and track your progress — all in one place.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/login"
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 hover:-translate-y-px"
            aria-label="Login"
          >
            Login to Account
          </Link>
          <Link
            to="/register"
            className="px-8 py-3.5 bg-white/[0.05] text-gray-300 border border-white/[0.1] rounded-xl font-semibold text-sm hover:bg-white/[0.09] hover:text-white hover:border-white/20 transition-all hover:-translate-y-px"
            aria-label="Register"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ Icon, accent, iconBg, title, desc }) => (
            <div
              key={title}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all hover:-translate-y-0.5"
            >
              <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommonDashboard;
