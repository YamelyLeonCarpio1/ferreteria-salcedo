import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, Wrench } from 'lucide-react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import CarritoDrawer from './CarritoDrawer'

export default function Navbar() {
  const { totalItems } = useCarrito()
  const { usuario, logout } = useAuth()
  const [buscar, setBuscar] = useState('')
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  const handleBuscar = (e) => {
    e.preventDefault()
    if (buscar.trim()) {
      navigate(`/productos?buscar=${buscar}`)
      setBuscar('')
    }
  }

  return (
    <>
      {/* Barra superior */}
      <div style={{ background: '#1A1A2E', color: '#FFB703', padding: '0.4rem 0', fontSize: '0.82rem', textAlign: 'center' }}>
        📍 Jr. Los Artesanos 245, Lima — 📞 987-654-321 — Lun-Sáb 8am-7pm
      </div>

      {/* Navbar principal */}
      <nav style={{ background: '#E63946', padding: '0.8rem 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <div className="contenedor" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.5px', flexShrink: 0 }}>
            <Wrench size={26} />
            FERRETERÍA<span style={{ color: '#FFB703' }}>SALCEDO</span>
          </Link>

          {/* Buscador */}
          <form onSubmit={handleBuscar} style={{ flex: 1, display: 'flex', maxWidth: '500px' }}>
            <input
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              placeholder="Buscar productos..."
              style={{ flex: 1, padding: '0.55rem 1rem', border: 'none', borderRadius: '6px 0 0 6px', fontSize: '0.9rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#FFB703', border: 'none', padding: '0 1rem', borderRadius: '0 6px 6px 0', color: '#1A1A2E' }}>
              <Search size={18} />
            </button>
          </form>

          {/* Acciones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            {usuario ? (
              <div style={{ position: 'relative', color: 'white' }}>
                <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <User size={20} /> {usuario.nombre}
                </button>
                {menuAbierto && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: '160px', overflow: 'hidden', zIndex: 200 }}>
                    <Link to="/mis-pedidos" onClick={() => setMenuAbierto(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: '#1A1A2E', fontWeight: 500 }}>Mis pedidos</Link>
                    <Link to="/mi-cuenta" onClick={() => setMenuAbierto(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: '#1A1A2E', fontWeight: 500 }}>Mi cuenta</Link>
                    <button onClick={() => { logout(); setMenuAbierto(false) }} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#E63946', fontWeight: 600 }}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <User size={20} /> Ingresar
              </Link>
            )}

            <button onClick={() => setDrawerAbierto(true)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '1rem', position: 'relative' }}>
              <ShoppingCart size={24} />
              {totalItems > 0 && <span className="badge" style={{ position: 'absolute', top: '-8px', right: '-8px' }}>{totalItems}</span>}
            </button>
          </div>
        </div>

        {/* Categorías */}
        <div className="contenedor" style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
          {['Cerraduras y Candados','Herramientas Manuales','Pinturas y Accesorios','Electricidad','Plomería','Fijaciones y Tornillos'].map(cat => (
            <Link key={cat} to={`/productos?categoria=${cat}`} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', padding: '0.2rem 0' }}>
              {cat}
            </Link>
          ))}
        </div>
      </nav>

      <CarritoDrawer abierto={drawerAbierto} onCerrar={() => setDrawerAbierto(false)} />
    </>
  )
}