import { Link } from "react-router";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-center px-6">
    <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" aria-hidden="true" />
    <div className="fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" aria-hidden="true" />
    <div className="relative z-10">
      <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">404</h1>
      <p className="mt-4 text-2xl font-bold text-white">Page not found</p>
      <p className="mt-2 text-gray-400">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
