import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Wrench } from 'lucide-react'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ nombre:'', apellido:'', email:'', password:'', telefono:'' })
  const [cargando, setCargando] = useState(false)
  const { login, registro } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
        toast.success('¡Bienvenido!')
      } else {
        await registro(form)
        toast.success('¡Cuenta creada!')
      }
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al procesar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ color: '#E63946', marginBottom: '0.5rem' }}><Wrench size={32} /></div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800 }}>FERRETERÍA SALCEDO</h1>
        </div>

        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '2px solid #E5E7EB' }}>
          {[['login','Iniciar sesión'],['registro','Crear cuenta']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '0.7rem', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.95rem', color: tab===t?'#E63946':'#6B7280', borderBottom: tab===t?'2px solid #E63946':'2px solid transparent', marginBottom: '-2px' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'registro' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {['nombre','apellido'].map(f => (
                  <div key={f}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'capitalize', fontSize: '0.9rem' }}>{f}</label>
                    <input required value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem' }}>Teléfono</label>
                <input value={form.telefono} onChange={e => setForm(p=>({...p,telefono:e.target.value}))}
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
              </div>
            </>
          )}

          {['email','password'].map(f => (
            <div key={f} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'capitalize', fontSize: '0.9rem' }}>{f === 'password' ? 'Contraseña' : 'Email'}</label>
              <input required type={f==='password'?'password':'email'} value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
            </div>
          ))}

          <button type="submit" disabled={cargando} className="btn-primario" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {cargando ? 'Cargando...' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}