import { createBrowserRouter, RouterProvider } from 'react-router'
// import Home from './Home'
// import StudentDashboard from './components/students/StudentDashBoard'
import StudentApplicationForm from './components/students/StudentApplicationForm'
import StudentDashboard from './components/students/StudentDashBoard'
import InterviewSchedulePage from './components/students/InterviewSchedulePage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getUserProfile, selectAuthUser } from './slices/authSlice'
import ProfilePage from './components/students/ProfilePage'
import CompanyDashboard from './components/company/CompanyDashboard'
import PostJob from './components/company/PostJob'
import ApplicationReviewPage from './components/company/ApplicationReviewPage'
import InterviewSchedulingForm from './components/company/InterviewSchedulingForm'
import InterviewFeedbackForm from './components/company/InterviewFeedbackForm'
import AdminDashboard from './pages/AdminDashboard'
import ManagePlacementDrives from './pages/ManagePlacementDrives'
import StudentList from './pages/StudentList'
import StudentDetail from './pages/StudentDetail'
import StudentManagementPage from './pages/StudentManagementPage'
import CompanyList from './pages/CompanyList'
import ReportsPage from './pages/ReportsPage'
import ReportDetailsPage from './pages/ReportDetailsPage'
import LoginPage from './components/Authentication/LoginPage'
import Dashboard from './components/Dashboard'
import RegisterPage from './components/Authentication/RegisterPage'
import StudentApplicationPage from './components/students/StudentApplicationPage'
import PlacementDriveJobPostWrapper from './components/company/PlacementDriveJobPostWrapper'
import DriveCompanyJobsPage from './DriveCompanyJobsPage'
import CreateCompanyProfileForm from './components/company/CompanyForm'
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const routes = [
    {

      path: "/",
      // element:<StudentDashboard/>
      // element:<StudentApplicationForm/>
      // element:<StudentApplicationPage/>
      // element:<InterviewSchedulePage/>
      // element:<ProfilePage/>
      // element:<CompanyDashboard/>
      // element:<PostJob/>
      // element:<ApplicationReviewPage/>
      // element : <InterviewSchedulingForm/>
      // element : <InterviewFeedbackForm/>
      // element :<AdminDashboard/>
      // element:<ManagePlacementDrives/>
      // element:<StudentList/>
      // element:<StudentDetail/>
      // element:<StudentManagementPage/>
      // element:<CompanyList/>
      // element:<ReportsPage/>
      // element: <LoginPage />
      // element:<RegisterPage/>
      // element:<CompanyDashboard/>
      element:<DriveCompanyJobsPage/>
      // element:<CreateCompanyProfileForm/>

    }
    ,
    // { path:'reports/:id',element:<ReportDetailsPage/>}
    { path: '/:user/dashboard', element: <Dashboard /> },
    { path: '/login', element: <LoginPage /> },
    // { path: '/student/:companyId', 
    //    element:<StudentApplicationPage/> }
    { path: '/:user/postJob/:placementDriveId', element: <PostJob /> },
    { path: '/:user/postJob', element: <PlacementDriveJobPostWrapper /> },
    // { path: '/:user/drives', element: <ManagePlacementDrives /> }


  ]

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
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />
  )
}

export default App