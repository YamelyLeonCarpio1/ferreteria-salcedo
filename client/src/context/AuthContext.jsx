import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/perfil')
        .then(r => setUsuario(r.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setCargando(false))
    } else {
      setCargando(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('token', r.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`
    setUsuario(r.data.usuario)
    return r.data
  }

  const registro = async (datos) => {
    const r = await axios.post('/api/auth/register', datos)
    localStorage.setItem('token', r.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`
    setUsuario(r.data.usuario)
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)