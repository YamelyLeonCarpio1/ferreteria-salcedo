import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import Layout from './components/Layout'
import LoginAdmin from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pedidos from './pages/Pedidos'
import Pagos from './pages/Pagos'
import ProductosAdmin from './pages/Productos'
import Clientes from './pages/Clientes'

function RutaProtegida({ children }) {
  const { admin, cargando } = useAdminAuth()
  if (cargando) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Cargando...</div>
  if (!admin)   return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const { admin } = useAdminAuth()
  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/dashboard" /> : <LoginAdmin />} />
      <Route path="/dashboard"  element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      <Route path="/pedidos"    element={<RutaProtegida><Pedidos /></RutaProtegida>} />
      <Route path="/pagos"      element={<RutaProtegida><Pagos /></RutaProtegida>} />
      <Route path="/productos"  element={<RutaProtegida><ProductosAdmin /></RutaProtegida>} />
      <Route path="/clientes"   element={<RutaProtegida><Clientes /></RutaProtegida>} />
      <Route path="*"           element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AdminAuthProvider>
    </BrowserRouter>
  )
}