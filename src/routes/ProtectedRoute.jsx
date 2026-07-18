import { createContext, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthContext = createContext()

function ProtectedRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />}
    </AuthContext.Provider>
  )
}

export default ProtectedRoute