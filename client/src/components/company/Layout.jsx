import Navbar from "../Navbar";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#0f172a] relative overflow-x-hidden">
    {/* Background gradient orbs for glassmorphism depth */}
    <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" aria-hidden="true" />
    <div className="fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" aria-hidden="true" />

    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-500 focus:text-white focus:rounded-lg focus:font-semibold"
    >
      Skip to main content
    </a>
    <Navbar />
    <div id="main-content" className="relative z-10">{children}</div>
  </div>
);

export default Layout;
