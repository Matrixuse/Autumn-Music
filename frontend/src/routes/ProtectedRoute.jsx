import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#050505]"><Loader label="Checking your Autumn session" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please log in first to use Autumn.' }} />
  return <Outlet />
}