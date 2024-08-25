// ** React Imports
import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'

const PublicRoute = ({ children, route }) => {
  const role_id = localStorage.getItem('role_id')
  if (route) {
    const user = getUserData()

    const restrictedRoute = route.meta && route.meta.restricted

    if (role_id && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(role_id)} />
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
