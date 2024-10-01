// ** React Imports
import { Navigate } from 'react-router-dom'
import { useContext, Suspense } from 'react'

// ** Context Imports
import { AbilityContext } from '@src/utility/context/Can'

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  const ability = useContext(AbilityContext)
  const user = JSON.parse(localStorage.getItem('userData'))
  const role_id = localStorage.getItem('role_id')
console.log(!user)
  if (route) {
    let action = null
    let resource = null
    let restrictedRoute = false

    if (route.meta) {
      action = route.meta.action
      resource = route.meta.resource
      restrictedRoute = route.meta.restricted
    }
    if (!role_id) {
      return <Navigate to='/login' />
    }
    if (role_id && restrictedRoute) {
      return <Navigate to='/' />
    }
    if (restrictedRoute && role_id === 'client') {
      return <Navigate to='/access-control' />
    }
    // if (role_id && !ability.can(action || 'read', resource)) {
    //   return <Navigate to='/misc/not-authorized' replace />
    // }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PrivateRoute
