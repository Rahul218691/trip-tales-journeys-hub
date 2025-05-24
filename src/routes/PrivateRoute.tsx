import { useContext, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

interface PrivateRouteProps {
    children: ReactNode
}

interface LocationState {
    from: string
}

const PrivateRoute = ({
    children
}: PrivateRouteProps) => {
    const context = useContext(AuthContext)
    const location = useLocation()

    if (!context) {
        throw new Error('AuthContext must be used within an AuthProvider')
    }

    const { state: { user } } = context

    if (!user) {
        const to = {
            pathname: '/login',
            state: { from: location.pathname } as LocationState
        }
        return <Navigate to={to} replace />
    }

    return <>{children}</>
}

export default PrivateRoute