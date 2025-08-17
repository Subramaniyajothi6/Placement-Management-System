import {createBrowserRouter, RouterProvider} from 'react-router'
import Home from './Home'
const App = () => {
  
const routes = [
  {

    path:"/",
    element:<Home/>

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