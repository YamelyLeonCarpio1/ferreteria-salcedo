import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ShoppingBag, LogOut } from 'lucide-react'

export default function MiCuenta() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]             = useState({ nombre: '', apellido: '', telefono: '' })
  const [pass, setPass]             = useState({ actual: '', nueva: '', confirmar: '' })
  const [cargando, setCargando]     = useState(false)
  const [totalPedidos, setTotalPedidos] = useState(0)
  const [tab, setTab]               = useState('perfil')
  const [modalEliminar, setModalEliminar] = useState(false)
  const [passEliminar, setPassEliminar]   = useState('')
  const [eliminando, setEliminando]       = useState(false)

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }
    setForm({ nombre: usuario.nombre, apellido: usuario.apellido, telefono: usuario.telefono || '' })
    axios.get('/api/pedidos/mios').then(r => setTotalPedidos(r.data.length))
  }, [usuario])

  const handleGuardar = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      await axios.put('/api/auth/perfil', form)
      toast.success('Perfil actualizado ✓')
    } catch {
      toast.error('Error al actualizar perfil')
    } finally { setCargando(false) }
  }

  const handleCambiarPass = async (e) => {
    e.preventDefault()
    if (pass.nueva !== pass.confirmar) return toast.error('Las contraseñas no coinciden')
    if (pass.nueva.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres')
    setCargando(true)
    try {
      await axios.put('/api/auth/cambiar-password', { passwordActual: pass.actual, passwordNueva: pass.nueva })
      toast.success('Contraseña actualizada ✓')
      setPass({ actual: '', nueva: '', confirmar: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cambiar contraseña')
    } finally { setCargando(false) }
  }

  const handleEliminarCuenta = async () => {
    if (!passEliminar) return toast.error('Ingresa tu contraseña para confirmar')
    setEliminando(true)
    try {
      await axios.delete('/api/auth/cuenta', { data: { password: passEliminar } })
      toast.success('Cuenta eliminada correctamente')
      logout()
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar cuenta')
    } finally { setEliminando(false) }
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (!usuario) return null

  return (
    <div className="contenedor" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
        MI CUENTA
      </h1>

      {/* Tarjeta de perfil */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E, #2D2D2D)', borderRadius: '12px', padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: '70px', height: '70px', background: '#E63946', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
          {usuario.nombre?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>{usuario.nombre} {usuario.apellido}</p>
          <p style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>{usuario.email}</p>
          <span style={{ background: '#E63946', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', marginTop: '0.3rem', display: 'inline-block' }}>
            {usuario.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
          </span>
        </div>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#FFB703' }}>{totalPedidos}</p>
          <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Pedidos realizados</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '1.5rem' }}>
        {[['perfil','👤 Datos personales'],['seguridad','🔒 Seguridad'],['pedidos','📦 Mis pedidos']].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '0.7rem 1.2rem', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', color: tab===t?'#E63946':'#6B7280', borderBottom: tab===t?'3px solid #E63946':'3px solid transparent', marginBottom: '-2px' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Tab Perfil ─────────────────────────────────────── */}
      {tab === 'perfil' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Datos personales</h3>
          <form onSubmit={handleGuardar}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {[['nombre','Nombre'],['apellido','Apellido']].map(([k,l]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>{l}</label>
                  <input value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>📧 Email</label>
              <input value={usuario.email} disabled
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#F9FAFB', color: '#6B7280' }} />
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.3rem' }}>El email no puede modificarse</p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>📞 Teléfono</label>
              <input value={form.telefono} onChange={e => setForm(p => ({...p, telefono: e.target.value}))}
                placeholder="987654321"
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
            </div>
            <button type="submit" disabled={cargando} className="btn-primario" style={{ padding: '0.8rem 2rem' }}>
              {cargando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tab Seguridad ──────────────────────────────────── */}
      {tab === 'seguridad' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem' }}>

          {/* Cambiar contraseña */}
          <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Cambiar contraseña</h3>
          <form onSubmit={handleCambiarPass}>
            {[['actual','Contraseña actual'],['nueva','Nueva contraseña'],['confirmar','Confirmar nueva contraseña']].map(([k,l]) => (
              <div key={k} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>{l}</label>
                <input type="password" value={pass[k]} onChange={e => setPass(p => ({...p,[k]:e.target.value}))}
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
              </div>
            ))}
            <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1.2rem', fontSize: '0.82rem', color: '#92400E' }}>
              ⚠️ La contraseña debe tener al menos 6 caracteres
            </div>
            <button type="submit" disabled={cargando} className="btn-primario" style={{ padding: '0.8rem 2rem' }}>
              {cargando ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </form>

          {/* Cerrar sesión */}
          <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '2rem', paddingTop: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.8rem' }}>Sesión</h3>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>

          {/* Zona de peligro */}
          <div style={{ borderTop: '1px solid #FEE2E2', marginTop: '2rem', paddingTop: '1.5rem', background: '#FFF5F5', borderRadius: '0 0 10px 10px', margin: '2rem -1.5rem -1.5rem', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#E63946' }}>⚠️ Zona de peligro</h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem' }}>
              Una vez elimines tu cuenta, no podrás recuperarla. Esta acción es permanente.
            </p>
            <button onClick={() => setModalEliminar(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#E63946', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>
              🗑️ Eliminar mi cuenta permanentemente
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Pedidos ────────────────────────────────────── */}
      {tab === 'pedidos' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ color: '#E63946', marginBottom: '1rem', opacity: 0.7 }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Historial de pedidos</h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Tienes <strong>{totalPedidos}</strong> pedido(s) realizados
          </p>
          <Link to="/mis-pedidos" className="btn-primario" style={{ display: 'inline-block', padding: '0.8rem 2rem' }}>
            Ver todos mis pedidos →
          </Link>
        </div>
      )}

      {/* ── Modal eliminar cuenta ──────────────────────────── */}
      {modalEliminar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#E63946', marginBottom: '0.8rem' }}>
              ⚠️ Eliminar cuenta
            </h3>

            <div style={{ background: '#FEE2E2', borderRadius: '8px', padding: '1rem', marginBottom: '1.2rem', fontSize: '0.88rem', color: '#991B1B' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Esta acción es irreversible:</p>
              <ul style={{ paddingLeft: '1.2rem' }}>
                <li>Se eliminará tu acceso a la cuenta</li>
                <li>No podrás iniciar sesión con este email</li>
                <li>Tu historial de pedidos se conservará por temas legales</li>
                <li>No puedes tener pedidos activos para eliminar la cuenta</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                Confirma tu contraseña para continuar:
              </label>
              <input
                type="password"
                value={passEliminar}
                onChange={e => setPassEliminar(e.target.value)}
                placeholder="Ingresa tu contraseña"
                style={{ width: '100%', padding: '0.7rem', border: '2px solid #E63946', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleEliminarCuenta}
                disabled={eliminando || !passEliminar}
                style={{ flex: 1, padding: '0.85rem', background: passEliminar ? '#E63946' : '#E5E7EB', color: passEliminar ? 'white' : '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: passEliminar ? 'pointer' : 'not-allowed' }}>
                {eliminando ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
              </button>
              <button
                onClick={() => { setModalEliminar(false); setPassEliminar('') }}
                style={{ flex: 1, padding: '0.85rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}