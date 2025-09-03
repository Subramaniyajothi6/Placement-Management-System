import { createBrowserRouter, RouterProvider } from 'react-router'
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
import StudentApplicationPage from './components/students/StudentApplicationPage'
import PlacementDriveJobPostWrapper from './components/company/PlacementDriveJobPostWrapper'

import CreateCompanyProfileForm from './components/company/CompanyForm'
import CompaniesInPlacementDrive from './components/students/CompaniesInPlacementDrive'
import JobsByDriveAndCompany from './components/students/JobsByDriveAndCompany'
import InterviewDetailPage from './components/company/InterviewDetailPage'
import CompanyForm from './components/company/CompanyForm'
import ApplicationDetailPage from './components/company/ApplicationDetailPage'
import CompanyProfilePage from './components/company/CompanyProfilePage'
import CommonDashboard from './components/CommonDashboard'
import AllDrivesCompaniesJobs from './pages/AllDrivesCompaniesJobs'
import ViewProfilePage from './pages/ViewProfilePage'
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
      // element:<StudentApplicationForm/>             // dont use this one 

      path: "/",
      // element:<PostJob/>
      // element :<AdminDashboard/>
      // element:<ManagePlacementDrives/>
      // element:<StudentList/>
      // element:<StudentDetail/>
      // element:<StudentManagementPage/>
      // element:<ReportsPage/>
      // element: <LoginPage />
      // element:<DriveCompanyJobsPage/>
      // element:<RegisterPage/>
      /////////////////////////////////////////// student //////////////////////////////////////////////////
      // element:<CompaniesInPlacementDrive/>
      // element:<JobsByDriveAndCompany/>
      // element:<ProfilePage/> // for creating profile
      // element:<StudentApplicationPage/>
      // element:<InterviewSchedulePage/>
      // element:<StudentDashboard/>
      // element:<ViewProfilePage/>






      ////////////////////////////////////////////////////////////////////////////////////////////////
      //   Company
      // element:<ApplicationReviewPage/>
      // element:<CompanyDashboard/>
      // element:<CompanyForm/>
      // element:<CompanyProfilePage/>
      
      // element : <InterviewDetailPage/>
      // element : <InterviewFeedbackForm/>
      // element : <InterviewSchedulingForm/>
      // element : <PlacementDriveJobPostWrapper/>
      // element : <PostJob/>

      // element:<CompanyList/>
      // element:<CreateCompanyProfileForm/>

      // element:<CommonDashboard/>
      // element:<AdminDashboard/>
      // element:<CompanyList/>
      // element:<AllDrivesCompaniesJobs/>
      // element:<ManagePlacementDrives/>
      // element:<StudentList/>
      // element:<StudentDetail/>
      // element:<StudentManagementPage/>
      

      

    }
    ,
    // { path:'reports/:id',element:<ReportDetailsPage/>}
    { path: '/:user/postJob/:placementDriveId', element: <PostJob /> },
    { path: '/:user/postJob', element: <PlacementDriveJobPostWrapper /> },
    // { path: '/:user/drives', element: <ManagePlacementDrives /> }
    { path: '/:user/applyJob/:driveId', element: <CompaniesInPlacementDrive /> },
    { path: '/:user/applyJob/:driveId/:companyId', element: <JobsByDriveAndCompany /> },
    { path: '/:user/applyJob/:driveId/:companyId/:jobId', element: <StudentApplicationPage/>  },
    { path: '/:user/studentProfile', element: <ProfilePage /> },
    { path: '/:user/viewStudentProfile', element: <ViewProfilePage /> },
    { path: '/:user/companyProfile', element: <CreateCompanyProfileForm /> },
    { path: '/:user/interview', element: <InterviewSchedulingForm /> },
    { path: '/:user/interview/:interviewId', element: <InterviewDetailPage /> },
    { path: '/:user/interview/interviewFeedback/:interviewId', element: <InterviewFeedbackForm /> },
    { path: '/:user/applications', element: < ApplicationReviewPage/> },
    { path: '/:user/applications/:id', element: < ApplicationDetailPage/> },
    { path: '/:user/profile/:id', element: < CompanyProfilePage/> },
    { path: '/companydashboard', element: < CompanyDashboard/> },
    { path: '/studentdashboard', element: < StudentDashboard/> },
    




    // admin

    { path: '/:user/reports', element: <ReportsPage/> },
    { path: '/dashboard/reports/:id', element: <ReportDetailsPage/> },
    { path: '/:user/student/profiles', element: <StudentManagementPage/> },
    { path: '/:user/student/profiles/:studentId', element: <StudentDetail/> },
    { path: '/:user/placementDrive', element: <ManagePlacementDrives/> },




    { path: '/:user/dashboard', element: <Dashboard /> },
    { path: '/login', element: <LoginPage /> },

    // company  


    

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