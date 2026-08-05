import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../lib/axios'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin]       = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/perfil')
        .then(r => {
          if (r.data.rol === 'ADMIN') setAdmin(r.data)
          else localStorage.removeItem('admin_token')
        })
        .catch(() => localStorage.removeItem('admin_token'))
        .finally(() => setCargando(false))
    } else {
      setCargando(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await axios.post('/api/auth/login', { email, password })
    if (r.data.usuario.rol !== 'ADMIN') throw new Error('No tienes permisos de administrador')
    localStorage.setItem('admin_token', r.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`
    setAdmin(r.data.usuario)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    delete axios.defaults.headers.common['Authorization']
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, cargando, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)