import Navbar from "../Navbar";


const Layout = ({ children }) => (
  <div className="min-h-screen bg-indigo-50">
    <Navbar />
    {children}
  </div>
);

export default Layout;
