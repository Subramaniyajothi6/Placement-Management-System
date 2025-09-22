
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, selectAuthUser } from "./slices/authSlice";
import CommonDashboard from "./components/CommonDashboard";
import PostJob from "./components/company/PostJob";
import PlacementDriveJobPostWrapper from "./components/company/PlacementDriveJobPostWrapper";
import CompaniesInPlacementDrive from "./components/students/CompaniesInPlacementDrive";
import JobsByDriveAndCompany from "./components/students/JobsByDriveAndCompany";
import StudentApplicationPage from "./components/students/StudentApplicationPage";
import ProfilePage from "./components/students/ProfilePage";
import ViewProfilePage from "./pages/ViewProfilePage";
import InterviewSchedulingForm from "./components/company/InterviewSchedulingForm";
import InterviewDetailPage from "./components/company/InterviewDetailPage";
import InterviewFeedbackForm from "./components/company/InterviewFeedbackForm";
import ApplicationReviewPage from "./components/company/ApplicationReviewPage";
import ApplicationDetailPage from "./components/company/ApplicationDetailPage";
import CompanyProfilePage from "./components/company/CompanyProfilePage";
import CompanyDashboard from "./components/company/CompanyDashboard";
import StudentDashBoard from "./components/students/StudentDashboard";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import StudentDetail from "./pages/StudentDetail";
import ManagePlacementDrives from "./pages/ManagePlacementDrives";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Authentication/LoginPage";
import RegisterPage from "./components/Authentication/RegisterPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import CompanyForm from "./components/company/CompanyForm";
import CompanyJobsList from "./components/company/CompanyJobsList";
import EditJob from "./components/company/EditJob";
import JitsiMeetComponent from "./components/company/JitsiMeetComponent";
import Layout from "./components/company/Layout";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);


  const LayoutWithNavbar = () => (
    <Layout>
      <Outlet />
    </Layout>
  );

const routes = [
  // Public or minimal-layout routes (login, signup, etc.)
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/", element: <CommonDashboard /> },

  // All main app routes in a layout with Navbar:
  {
    path: "/",
    element: <LayoutWithNavbar />,
    children: [
      { path: ":user/postJob/:placementDriveId", element: <PostJob /> },
      { path: ":user/postJob", element: <PlacementDriveJobPostWrapper /> },
      { path: ":user/applyJob/:driveId", element: <CompaniesInPlacementDrive /> },
      { path: ":user/applyJob/:driveId/:companyId", element: <JobsByDriveAndCompany /> },
      { path: ":user/applyJob/:driveId/:companyId/:jobId", element: <StudentApplicationPage/> },
      { path: ":user/studentProfile", element: <ProfilePage/> },
      { path: ":user/viewStudentProfile", element: <ViewProfilePage/> },
      { path: ":user/companyProfile", element: <CompanyForm/> },
      { path: ":user/interview", element: <InterviewSchedulingForm/> },
      { path: ":user/interview/:interviewId", element: <InterviewDetailPage/> },
      { path: ":user/interview/interviewFeedback/:interviewId", element: <InterviewFeedbackForm/> },
      { path: ":user/applications", element: <ApplicationReviewPage/> },
      { path: ":user/applications/:id", element: <ApplicationDetailPage/> },
      { path: ":user/profile/:id", element: <CompanyProfilePage/> },
      { path: "companydashboard", element: <CompanyDashboard/> },
      { path: "studentdashboard", element: <StudentDashBoard/> }, 
      { path: ":user/:meetingId", element: <JitsiMeetComponent/> },
      { path: ":user/reports", element: <ReportsPage/> },
      { path: "dashboard/reports/:id", element: <ReportDetailsPage/> },
      { path: ":user/student/profiles", element: <StudentManagementPage/> },
      { path: ":user/student/profiles/:studentId", element: <StudentDetail/> },
      { path: ":user/placementDrive", element: <ManagePlacementDrives/> },
      { path: ":user/dashboard", element: <Dashboard/> },
      { path: "company/companyJobs", element: <CompanyJobsList/> },
      { path: "company/editJob/:id", element: <EditJob/> },
    ]
  }
];

  const router = createBrowserRouter(routes, {
    future: {
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,

    },
  })

  return (
<>
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />
    <Toaster position="top-center" reverseOrder={false} />
</>
  )
}

export default App