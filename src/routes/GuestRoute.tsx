import { useContext, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LOCALSTORAGE_KEYS } from '../lib/constants'

interface GuestRouteProps {
    children: ReactNode
}

interface LocationState {
    from: string
}

const GuestRoute = ({
    children
}: GuestRouteProps) => {
  const { state: { user } } = useContext(AuthContext)
  const location = useLocation()
  const previousLocation = window.sessionStorage.getItem(LOCALSTORAGE_KEYS.PREVIOUS_LOCATION)

  if (user) {
    const to = {
      pathname: previousLocation || '/',
      state: { from: location.pathname } as LocationState
    }
    return <Navigate to={to} replace />
  }

  return <>{children}</>
}

export default GuestRoute