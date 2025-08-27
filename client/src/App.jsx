import {createBrowserRouter, RouterProvider} from 'react-router'
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
const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

    useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);
  
const routes = [
  {

    path:"/",
    // element:<StudentDashboard/>
    // element:<StudentApplicationForm/>
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
    element:<ReportsPage/>
  
  }
  ,
  { path:'reports/:id',element:<ReportDetailsPage/>}
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