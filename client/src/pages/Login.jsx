import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Wrench, Mail, Shield } from 'lucide-react'
import axios from 'axios'

export default function Login() {
  const [tab, setTab]                 = useState('login')
  const [form, setForm]               = useState({ nombre:'', apellido:'', email:'', password:'', telefono:'' })
  const [cargando, setCargando]       = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [emailPendiente, setEmailPendiente] = useState('')
  const [codigo, setCodigo]           = useState(['','','','','',''])
  const [reenviando, setReenviando]   = useState(false)
  const { login, registro }           = useAuth()
  
  // ── Estados para Recuperación de Contraseña ──────────────
  const [recuperando, setRecuperando]     = useState(false)
  const [emailRecuperar, setEmailRecuperar] = useState('')
  const [codigoRecup, setCodigoRecup]     = useState(['','','','','',''])
  const [passRecup, setPassRecup]         = useState({ nueva: '', confirmar: '' })
  const [pasoRecup, setPasoRecup]         = useState(1) // 1=email, 2=código+nueva pass

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
        toast.success('¡Bienvenido!')
        navigate('/')
      } else {
        const r = await axios.post('/api/auth/register', form)
        if (r.data.requiereVerificacion) {
          setEmailPendiente(r.data.email)
          setVerificando(true)
          toast.success('¡Revisa tu correo! Te enviamos un código de verificación 📧')
        }
      }
    } catch (err) {
      if (err.response?.data?.requiereVerificacion) {
        setEmailPendiente(err.response.data.email)
        setVerificando(true)
        toast.error('Tu cuenta necesita verificación. Revisa tu correo.')
      } else {
        toast.error(err.response?.data?.error || 'Error al procesar')
      }
    } finally {
      setCargando(false)
    }
  }

  const handleCodigo = (valor, index) => {
    const nuevo = [...codigo]
    nuevo[index] = valor.slice(-1)
    setCodigo(nuevo)
    if (valor && index < 5) {
      document.getElementById(`cod-${index + 1}`)?.focus()
    }
  }

  const handlePegar = (e) => {
    e.preventDefault()
    const pegado = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    const nuevo = [...'000000'.split('')].map((_,i) => pegado[i] || '')
    setCodigo(nuevo)
  }

  const handleVerificar = async () => {
    const codigoCompleto = codigo.join('')
    if (codigoCompleto.length < 6) return toast.error('Ingresa el código de 6 dígitos')
    setCargando(true)
    try {
      const r = await axios.post('/api/auth/verificar', { email: emailPendiente, codigo: codigoCompleto })
      localStorage.setItem('token', r.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`
      toast.success('¡Cuenta verificada! Bienvenido 🎉')
      navigate('/')
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Código incorrecto')
      setCodigo(['','','','','',''])
      document.getElementById('cod-0')?.focus()
    } finally {
      setCargando(false)
    }
  }

  const handleReenviar = async () => {
    setReenviando(true)
    try {
      await axios.post('/api/auth/reenviar-codigo', { email: emailPendiente })
      toast.success('¡Código reenviado! Revisa tu correo 📧')
      setCodigo(['','','','','',''])
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al reenviar')
    } finally {
      setReenviando(false)
    }
  }

  // ── Funciones para Recuperación de Contraseña ───────────
  const handleSolicitarRecuperacion = async (e) => {
    e.preventDefault()
    if (!emailRecuperar) return toast.error('Ingresa tu email')
    setCargando(true)
    try {
      await axios.post('/api/auth/recuperar-password', { email: emailRecuperar })
      toast.success('Si el email existe, recibirás un código 📧')
      setPasoRecup(2)
    } catch { 
      toast.error('Error al procesar') 
    } finally { 
      setCargando(false) 
    }
  }

  const handleResetearPassword = async (e) => {
    e.preventDefault()
    if (passRecup.nueva !== passRecup.confirmar) return toast.error('Las contraseñas no coinciden')
    if (passRecup.nueva.length < 6) return toast.error('Mínimo 6 caracteres')
    const codigo = codigoRecup.join('')
    if (codigo.length < 6) return toast.error('Ingresa el código completo')
    setCargando(true)
    try {
      await axios.post('/api/auth/resetear-password', { email: emailRecuperar, codigo, passwordNueva: passRecup.nueva })
      toast.success('¡Contraseña actualizada! Ya puedes iniciar sesión')
      setRecuperando(false)
      setPasoRecup(1)
      setEmailRecuperar('')
      setCodigoRecup(['','','','','',''])
      setPassRecup({ nueva: '', confirmar: '' })
    } catch (err) { 
      toast.error(err.response?.data?.error || 'Error al resetear') 
    } finally { 
      setCargando(false) 
    }
  }

  // ── Pantalla de recuperación ─────────────────────────────
  if (recuperando) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', padding: '2rem' }}>
      <div className="login-card" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>RECUPERAR CONTRASEÑA</h2>
          <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '0.3rem' }}>
            {pasoRecup === 1 ? 'Ingresa tu email para recibir un código' : `Código enviado a ${emailRecuperar}`}
          </p>
        </div>

        {pasoRecup === 1 ? (
          <form onSubmit={handleSolicitarRecuperacion}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>Email de tu cuenta</label>
              <input type="email" required value={emailRecuperar} onChange={e => setEmailRecuperar(e.target.value)}
                placeholder="tucorreo@gmail.com"
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
            </div>
            <button type="submit" disabled={cargando} className="btn-primario" style={{ width: '100%', padding: '0.9rem' }}>
              {cargando ? 'Enviando...' : 'Enviar código →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetearPassword}>
            {/* Código */}
            <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.5rem' }}>Código de verificación:</p>
            <div className="codigo-inputs" style={{ marginBottom: '1.2rem' }}>
              {codigoRecup.map((d, i) => (
                <input key={i} id={`rec-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => {
                    const nuevo = [...codigoRecup]; nuevo[i] = e.target.value.slice(-1); setCodigoRecup(nuevo)
                    if (e.target.value && i < 5) document.getElementById(`rec-${i+1}`)?.focus()
                  }}
                  onKeyDown={e => { if (e.key==='Backspace' && !d && i>0) document.getElementById(`rec-${i-1}`)?.focus() }}
                  style={{ width: '44px', height: '52px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 800, border: `2px solid ${d?'#E63946':'#E5E7EB'}`, borderRadius: '8px', outline: 'none' }} />
              ))}
            </div>
            {/* Nueva contraseña */}
            {['nueva','confirmar'].map((k) => (
              <div key={k} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                  {k === 'nueva' ? 'Nueva contraseña' : 'Confirmar contraseña'}
                </label>
                <input type="password" value={passRecup[k]} onChange={e => setPassRecup(p => ({...p,[k]:e.target.value}))}
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
              </div>
            ))}
            <button type="submit" disabled={cargando} className="btn-primario" style={{ width: '100%', padding: '0.9rem', marginBottom: '0.75rem' }}>
              {cargando ? 'Actualizando...' : 'Cambiar contraseña →'}
            </button>
          </form>
        )}

        <button onClick={() => { setRecuperando(false); setPasoRecup(1) }}
          style={{ width: '100%', textAlign: 'center', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '0.88rem', marginTop: '0.5rem' }}>
          ← Volver al login
        </button>
      </div>
    </div>
  )

  // ── Pantalla de verificación ─────────────────────────────
  if (verificando) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '420px', textAlign: 'center' }}>

        <div style={{ width: '70px', height: '70px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
          <Shield size={32} color="#E63946" />
        </div>

        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          VERIFICA TU CUENTA
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Enviamos un código de 6 dígitos a:
        </p>
        <p style={{ fontWeight: 700, color: '#E63946', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          📧 {emailPendiente}
        </p>

        {/* Inputs del código */}
        <div className="codigo-inputs" style={{ marginBottom: '1.5rem' }}>
          {codigo.map((d, i) => (
            <input
              key={i}
              id={`cod-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleCodigo(e.target.value, i)}
              onPaste={i === 0 ? handlePegar : undefined}
              onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) document.getElementById(`cod-${i-1}`)?.focus() }}
              style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, border: `2px solid ${d ? '#E63946' : '#E5E7EB'}`, borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s' }}
            />
          ))}
        </div>

        <button onClick={handleVerificar} disabled={cargando || codigo.join('').length < 6}
          className="btn-primario"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', opacity: codigo.join('').length < 6 ? 0.5 : 1, cursor: codigo.join('').length < 6 ? 'not-allowed' : 'pointer', marginBottom: '1rem' }}>
          {cargando ? 'Verificando...' : 'Verificar cuenta →'}
        </button>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.5rem' }}>¿No recibiste el código?</p>
          <button onClick={handleReenviar} disabled={reenviando}
            style={{ background: 'none', border: 'none', color: '#E63946', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
            {reenviando ? 'Enviando...' : '🔄 Reenviar código'}
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '1rem' }}>
          El código expira en 15 minutos
        </p>
      </div>
    </div>
  )

  // ── Pantalla de login/registro ───────────────────────────
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', padding: '2rem' }}>
      <div className="login-card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ color: '#E63946', marginBottom: '0.5rem' }}><Wrench size={32} /></div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800 }}>FERRETERÍA SALCEDO</h1>
        </div>

        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '2px solid #E5E7EB' }}>
          {[['login','Iniciar sesión'],['registro','Crear cuenta']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '0.7rem', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.95rem', color: tab===t?'#E63946':'#6B7280', borderBottom: tab===t?'2px solid #E63946':'2px solid transparent', marginBottom: '-2px', cursor: 'pointer' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'registro' && (
            <>
              <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
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
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'capitalize', fontSize: '0.9rem' }}>
                {f === 'password' ? 'Contraseña' : 'Email'}
              </label>
              <input required type={f==='password'?'password':'email'} value={form[f]}
                onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
            </div>
          ))}

          {tab === 'registro' && (
            <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#92400E' }}>
              📧 Recibirás un código de verificación en tu correo para activar tu cuenta.
            </div>
          )}

          <button type="submit" disabled={cargando} className="btn-primario" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {cargando ? 'Cargando...' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        {tab === 'login' && (
          <button type="button" onClick={() => setRecuperando(true)}
            style={{ width: '100%', textAlign: 'center', marginTop: '0.8rem', background: 'none', border: 'none', color: '#E63946', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </div>
    </div>
  )
}