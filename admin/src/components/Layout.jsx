import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useState } from 'react'
import {
  LayoutDashboard, ShoppingBag, Package,
  Users, CreditCard, LogOut, Wrench, Tag, Menu, X
} from 'lucide-react'

const MENU = [
  { path: '/dashboard',  label: 'Dashboard',   icon: <LayoutDashboard size={18} /> },
  { path: '/pedidos',    label: 'Pedidos',      icon: <ShoppingBag size={18} /> },
  { path: '/pagos',      label: 'Verificar Pagos', icon: <CreditCard size={18} /> },
  { path: '/productos',  label: 'Productos',    icon: <Package size={18} /> },
  { path: '/stock',      label: 'Stock',        icon: <Tag size={18} /> },
  { path: '/clientes',   label: 'Clientes',     icon: <Users size={18} /> },
]

export default function Layout({ children }) {
  const { admin, logout } = useAdminAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="admin-shell">

      <button className="admin-menu-toggle" onClick={() => setMenuAbierto(v => !v)} aria-label="Abrir menú de administración">
        {menuAbierto ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuAbierto ? 'is-open' : ''}`}>

        {/* Logo */}
        <div style={{ padding: '1.5rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wrench size={22} color="#E63946" />
            <div>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>FERRETERÍA</p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#E63946', lineHeight: 1 }}>SALCEDO</p>
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.4rem' }}>Panel Administrativo</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          {MENU.map(item => {
            const activo = pathname === item.path
            return (
              <Link key={item.path} to={item.path} onClick={() => setMenuAbierto(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', borderRadius: '8px', marginBottom: '0.2rem', fontWeight: 600, fontSize: '0.88rem', background: activo ? 'rgba(230,57,70,0.15)' : 'transparent', color: activo ? '#E63946' : '#94A3B8', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!activo) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { if (!activo) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8' } }}>
                {item.icon} {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Usuario */}
        <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Conectado como</p>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.8rem' }}>{admin?.nombre} {admin?.apellido}</p>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(230,57,70,0.1)', color: '#E63946', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', width: '100%' }}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
