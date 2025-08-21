import {createBrowserRouter, RouterProvider} from 'react-router'
// import Home from './Home'
// import StudentDashboard from './components/students/StudentDashBoard'
import StudentApplicationForm from './components/students/StudentApplicationForm'
const App = () => {
  
const routes = [
  {

    path:"/",
    // element:<Home/>
    element:<StudentApplicationForm/>

  }
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