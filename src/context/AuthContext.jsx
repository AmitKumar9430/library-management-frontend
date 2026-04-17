import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('lms_token')
    const user  = localStorage.getItem('lms_user')
    return token ? { token, user: JSON.parse(user) } : null
  })

  const login = (token, user) => {
    localStorage.setItem('lms_token', token)
    localStorage.setItem('lms_user', JSON.stringify(user))
    setAuth({ token, user })
  }

  const logout = () => {
    localStorage.removeItem('lms_token')
    localStorage.removeItem('lms_user')
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
