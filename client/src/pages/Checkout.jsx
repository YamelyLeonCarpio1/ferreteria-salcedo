import { useState, useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import { Upload, CheckCircle, MapPin } from 'lucide-react'

// ── Distritos de Lima con costos de delivery ─────────────
const DISTRITOS = [
  { nombre: 'Cercado de Lima',    costo: 5  },
  { nombre: 'Breña',              costo: 5  },
  { nombre: 'La Victoria',        costo: 5  },
  { nombre: 'Rímac',              costo: 5  },
  { nombre: 'San Luis',           costo: 6  },
  { nombre: 'El Agustino',        costo: 6  },
  { nombre: 'Miraflores',         costo: 8  },
  { nombre: 'San Isidro',         costo: 8  },
  { nombre: 'San Borja',          costo: 8  },
  { nombre: 'Surco',              costo: 8  },
  { nombre: 'La Molina',          costo: 9  },
  { nombre: 'Barranco',           costo: 8  },
  { nombre: 'Chorrillos',         costo: 10 },
  { nombre: 'Surquillo',          costo: 7  },
  { nombre: 'San Miguel',         costo: 8  },
  { nombre: 'Pueblo Libre',       costo: 7  },
  { nombre: 'Magdalena del Mar',  costo: 7  },
  { nombre: 'Jesús María',        costo: 7  },
  { nombre: 'Lince',              costo: 7  },
  { nombre: 'Los Olivos',         costo: 10 },
  { nombre: 'San Martín de Porres', costo: 10 },
  { nombre: 'Independencia',      costo: 10 },
  { nombre: 'Comas',              costo: 12 },
  { nombre: 'Carabayllo',         costo: 14 },
  { nombre: 'Puente Piedra',      costo: 14 },
  { nombre: 'Ate',                costo: 10 },
  { nombre: 'Santa Anita',        costo: 10 },
  { nombre: 'San Juan de Lurigancho', costo: 12 },
  { nombre: 'Lurigancho-Chosica', costo: 14 },
  { nombre: 'Chaclacayo',         costo: 15 },
  { nombre: 'San Juan de Miraflores', costo: 10 },
  { nombre: 'Villa María del Triunfo', costo: 12 },
  { nombre: 'Villa El Salvador',  costo: 12 },
  { nombre: 'Lurín',              costo: 15 },
  { nombre: 'Pachacámac',         costo: 16 },
  { nombre: 'Callao',             costo: 10 },
  { nombre: 'Bellavista',         costo: 10 },
  { nombre: 'La Perla',           costo: 10 },
  { nombre: 'Ventanilla',         costo: 14 },
  { nombre: 'Fuera de Lima',      costo: 0, consultar: true },
]

function TerminosCheck({ aceptado, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: aceptado ? '#F0FDF4' : '#F9FAFB', border: `2px solid ${aceptado ? '#10B981' : '#E5E7EB'}`, borderRadius: '8px', transition: 'all 0.2s' }}>
      <div onClick={() => onChange(!aceptado)}
        style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${aceptado ? '#10B981' : '#D1D5DB'}`, background: aceptado ? '#10B981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', transition: 'all 0.2s' }}>
        {aceptado && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
        He leído y acepto los{' '}
        <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#E63946', fontWeight: 700, textDecoration: 'underline' }} onClick={e => e.stopPropagation()}>Términos y Condiciones</a>
        {', '}
        <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#E63946', fontWeight: 700, textDecoration: 'underline' }} onClick={e => e.stopPropagation()}>Política de Privacidad</a>
        {' y '}
        <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#E63946', fontWeight: 700, textDecoration: 'underline' }} onClick={e => e.stopPropagation()}>Política de Envíos</a>
        {' de Ferretería Salcedo.'}
      </span>
    </label>
  )
}

const WA_NUMERO = '51987654321'

export default function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [metodoPago, setMetodoPago]         = useState('YAPE')
  const [tipoEntrega, setTipoEntrega]       = useState('DELIVERY')
  const [direccion, setDireccion]           = useState({ calle: '', distrito: '', referencia: '' })
  const [distritoSeleccionado, setDistritoSeleccionado] = useState(null)
  const [cargando, setCargando]             = useState(false)
  const [comprobante, setComprobante]       = useState(null)
  const [codigoOp, setCodigoOp]             = useState('')
  const [pedidoCreado, setPedidoCreado]     = useState(null)
  const [paso, setPaso]                     = useState(1)
  const [aceptoTerminos, setAceptoTerminos] = useState(false)

  // Si cambia a DELIVERY, resetear efectivo
  useEffect(() => {
    if (tipoEntrega === 'DELIVERY' && metodoPago === 'EFECTIVO') {
      setMetodoPago('YAPE')
      toast('💡 El pago en efectivo solo está disponible para recojo en tienda', { icon: 'ℹ️' })
    }
  }, [tipoEntrega])

  const costoDelivery = tipoEntrega === 'DELIVERY' && distritoSeleccionado
    ? distritoSeleccionado.consultar ? null : distritoSeleccionado.costo
    : 0

  const totalConDelivery = total + (costoDelivery || 0)

  if (!usuario) return (
    <div className="contenedor" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h2>Debes iniciar sesión para continuar</h2>
      <Link to="/login" className="btn-primario" style={{ display: 'inline-block', marginTop: '1rem' }}>Iniciar sesión</Link>
    </div>
  )

  if (items.length === 0 && !pedidoCreado) return (
    <div className="contenedor" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h2>Tu carrito está vacío</h2>
      <Link to="/productos" className="btn-primario" style={{ display: 'inline-block', marginTop: '1rem' }}>Ver productos</Link>
    </div>
  )

  const handleConfirmarPedido = async () => {
    if (!aceptoTerminos) return toast.error('Debes aceptar los términos y condiciones')
    if (tipoEntrega === 'DELIVERY') {
      if (!direccion.calle.trim()) return toast.error('Ingresa tu calle / dirección')
      if (!distritoSeleccionado) return toast.error('Selecciona tu distrito')
      if (distritoSeleccionado.consultar) return toast.error('Para envíos fuera de Lima, contáctanos por WhatsApp')
    }

    setCargando(true)
    try {
      const notasEntrega = tipoEntrega === 'DELIVERY'
        ? `${direccion.calle}, ${distritoSeleccionado.nombre}. Ref: ${direccion.referencia}. Delivery: S/ ${costoDelivery}`
        : 'Recojo en tienda — Jr. Los Artesanos 245, Lima'

      const r = await axios.post('/api/pedidos', {
        items: items.map(i => ({ productoId: i.id, cantidad: i.cantidad })),
        tipoEntrega, metodoPago,
        notas: notasEntrega
      })
      setPedidoCreado(r.data)
      setPaso(2)
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al crear pedido')
    } finally { setCargando(false) }
  }

  const handleSubirComprobante = async () => {
    if ((metodoPago === 'YAPE' || metodoPago === 'TRANSFERENCIA') && !comprobante)
      return toast.error('Debes subir el comprobante de pago')
    setCargando(true)
    try {
      const form = new FormData()
      if (comprobante) form.append('comprobante', comprobante)
      if (codigoOp)    form.append('codigoOp', codigoOp)
      await axios.post(`/api/pagos/comprobante/${pedidoCreado.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      vaciar()
      setPaso(3)
      toast.success('¡Comprobante enviado!')
    } catch { toast.error('Error al enviar comprobante') }
    finally { setCargando(false) }
  }

  const handleEfectivoConfirmar = async () => {
    setCargando(true)
    try {
      await axios.post(`/api/pagos/comprobante/${pedidoCreado.id}`, { codigoOp: 'EFECTIVO_TIENDA' })
      vaciar()
      setPaso(3)
    } catch { toast.error('Error al confirmar') }
    finally { setCargando(false) }
  }

  // ── PASO 3 ───────────────────────────────────────────────
  if (paso === 3) return (
    <div className="contenedor" style={{ padding: '3rem 1.5rem', maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '2.5rem' }}>
        <CheckCircle size={64} color="#10B981" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>¡PEDIDO CONFIRMADO!</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Tu pedido <strong>#{pedidoCreado?.id}</strong> ha sido recibido.</p>

        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          {metodoPago === 'EFECTIVO' ? (
            <><p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.3rem' }}>✅ Pedido confirmado</p><p style={{ fontSize: '0.88rem', color: '#065F46' }}>Paga en efectivo al recoger en tienda. Te esperamos.</p></>
          ) : (
            <><p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.3rem' }}>📋 Comprobante enviado</p><p style={{ fontSize: '0.88rem', color: '#065F46' }}>Nuestro equipo verificará tu pago en los próximos minutos.</p></>
          )}
        </div>

        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.88rem' }}>
          <p style={{ fontWeight: 700, color: '#92400E', marginBottom: '0.3rem' }}>📦 Seguimiento</p>
          <p style={{ color: '#92400E' }}>Revisa el estado en <strong>"Mis pedidos"</strong> y recibirás notificaciones por email.</p>
        </div>

        <button onClick={() => navigate('/mis-pedidos')} className="btn-primario" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
          Ver mis pedidos →
        </button>
        <a href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(`Hola, pedido #${pedidoCreado?.id} por S/ ${Number(pedidoCreado?.total).toFixed(2)}. ¿Me pueden confirmar?`)}`}
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.9rem', background: '#25D366', color: 'white', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', marginTop: '0.75rem' }}>
          💬 Confirmar por WhatsApp
        </a>
      </div>
    </div>
  )

  // ── PASO 2 ───────────────────────────────────────────────
  if (paso === 2) return (
    <div className="contenedor" style={{ padding: '3rem 1.5rem', maxWidth: '520px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>REALIZAR PAGO</h2>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
        Pedido #{pedidoCreado?.id} — Total: <strong style={{ color: '#E63946' }}>S/ {Number(pedidoCreado?.total).toFixed(2)}</strong>
      </p>

      {metodoPago === 'YAPE' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 800, color: '#7C3AED', marginBottom: '1rem', fontSize: '1.1rem' }}>💜 Pagar con Yape</h3>
          <div style={{ background: '#F5F3FF', borderRadius: '10px', padding: '1.2rem', textAlign: 'center', marginBottom: '1.2rem' }}>
            <div style={{ width: '160px', height: '160px', background: 'white', border: '3px solid #7C3AED', borderRadius: '10px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#7C3AED', fontWeight: 700, textAlign: 'center' }}>
              QR YAPE<br/>Ferretería<br/>Salcedo
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.3rem' }}>O yapea al número:</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED', letterSpacing: '2px' }}>987-654-321</p>
            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>A nombre de: <strong>Ferretería Salcedo</strong></p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#E63946', marginTop: '0.5rem' }}>Monto: S/ {Number(pedidoCreado?.total).toFixed(2)}</p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>Código de operación (opcional)</label>
            <input value={codigoOp} onChange={e => setCodigoOp(e.target.value)} placeholder="Ej: 987654321"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>📸 Sube tu captura de Yape *</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px dashed #C4B5FD', borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: comprobante ? '#F5F3FF' : 'white', justifyContent: 'center' }}>
              <Upload size={18} color="#7C3AED" />
              <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem' }}>{comprobante ? `✓ ${comprobante.name}` : 'Seleccionar imagen'}</span>
              <input type="file" accept="image/*" onChange={e => setComprobante(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>
          <button onClick={handleSubirComprobante} disabled={cargando || !comprobante}
            style={{ width: '100%', padding: '1rem', background: comprobante ? '#7C3AED' : '#E5E7EB', color: comprobante ? 'white' : '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: comprobante ? 'pointer' : 'not-allowed' }}>
            {cargando ? 'Enviando...' : 'Confirmar pago con Yape'}
          </button>
        </div>
      )}

      {metodoPago === 'TRANSFERENCIA' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 800, color: '#1E40AF', marginBottom: '1rem', fontSize: '1.1rem' }}>🏦 Transferencia Bancaria</h3>
          <div style={{ background: '#EFF6FF', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            {[['Banco','BCP'],['Cuenta','191-12345678-0-12'],['CCI','00219100123456780123'],['Titular','Ferretería Salcedo S.A.C.'],['RUC','20123456789'],['Monto',`S/ ${Number(pedidoCreado?.total).toFixed(2)}`]].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #BFDBFE', fontSize: '0.88rem' }}>
                <span style={{ color: '#6B7280' }}>{k}</span>
                <strong style={{ color: k==='Monto'?'#E63946':'#1E3A8A' }}>{v}</strong>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>N° de operación *</label>
            <input value={codigoOp} onChange={e => setCodigoOp(e.target.value)} placeholder="Ej: 00123456789"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>📸 Sube el voucher *</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px dashed #BFDBFE', borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: comprobante ? '#EFF6FF' : 'white', justifyContent: 'center' }}>
              <Upload size={18} color="#1E40AF" />
              <span style={{ color: '#1E40AF', fontWeight: 600, fontSize: '0.9rem' }}>{comprobante ? `✓ ${comprobante.name}` : 'Seleccionar imagen o PDF'}</span>
              <input type="file" accept="image/*,.pdf" onChange={e => setComprobante(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>
          <button onClick={handleSubirComprobante} disabled={cargando || !comprobante}
            style={{ width: '100%', padding: '1rem', background: comprobante ? '#1E40AF' : '#E5E7EB', color: comprobante ? 'white' : '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: comprobante ? 'pointer' : 'not-allowed' }}>
            {cargando ? 'Enviando...' : 'Confirmar transferencia'}
          </button>
        </div>
      )}

      {metodoPago === 'EFECTIVO' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 800, color: '#065F46', marginBottom: '1rem', fontSize: '1.1rem' }}>💵 Pago en Efectivo — Recojo en Tienda</h3>
          <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.5rem' }}>🏪 Instrucciones:</p>
            <p style={{ fontSize: '0.9rem', color: '#065F46', lineHeight: 1.6 }}>
              Recoge tu pedido en:<br/>
              <strong>Jr. Los Artesanos 245, Lima</strong><br/>
              Horario: Lun-Sáb 8am-7pm / Dom 9am-2pm<br/>
              Monto a pagar: <strong style={{ fontSize: '1.2rem', color: '#E63946' }}>S/ {Number(pedidoCreado?.total).toFixed(2)}</strong>
            </p>
          </div>
          <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1.2rem', fontSize: '0.82rem', color: '#92400E' }}>
            ⚠️ Tu pedido se reservará por <strong>24 horas</strong>. Si no se recoge en ese tiempo, será cancelado automáticamente.
          </div>
          <button onClick={handleEfectivoConfirmar} disabled={cargando}
            style={{ width: '100%', padding: '1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
            {cargando ? 'Confirmando...' : '✓ Confirmar recojo en tienda'}
          </button>
        </div>
      )}
    </div>
  )

  // ── PASO 1 ───────────────────────────────────────────────
  return (
    <div className="contenedor page-padding">
      <h1 className="page-title" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>FINALIZAR COMPRA</h1>

      <div className="grid-checkout">
        <div>

          {/* Tipo entrega */}
          <div className="checkout-card" style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Tipo de entrega</h3>
            <div className="radio-row">
              {[['DELIVERY','🚚 Delivery a domicilio'],['RECOJO_TIENDA','🏪 Recojo en tienda']].map(([v,l]) => (
                <label key={v} style={{ flex: 1, border: `2px solid ${tipoEntrega===v?'#E63946':'#E5E7EB'}`, borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: tipoEntrega===v?'#FEF2F2':'white', textAlign: 'center', fontWeight: 600 }}>
                  <input type="radio" value={v} checked={tipoEntrega===v} onChange={() => setTipoEntrega(v)} style={{ display: 'none' }} />
                  {l}
                </label>
              ))}
            </div>
          </div>

          {/* Dirección con selector de distrito */}
          {tipoEntrega === 'DELIVERY' && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📍 Dirección de entrega</h3>

              {/* Selector de distrito */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Distrito *</label>
                <select
                  value={direccion.distrito}
                  onChange={e => {
                    const nombre = e.target.value
                    const dist = DISTRITOS.find(d => d.nombre === nombre)
                    setDireccion(p => ({...p, distrito: nombre}))
                    setDistritoSeleccionado(dist || null)
                  }}
                  style={{ width: '100%', padding: '0.7rem', border: `1px solid ${!distritoSeleccionado && direccion.distrito ? '#E63946' : '#E5E7EB'}`, borderRadius: '6px', fontSize: '0.95rem', background: 'white' }}>
                  <option value="">Selecciona tu distrito...</option>
                  {DISTRITOS.map(d => (
                    <option key={d.nombre} value={d.nombre}>
                      {d.nombre} {d.consultar ? '— Consultar precio' : `— S/ ${d.costo}.00`}
                    </option>
                  ))}
                </select>

                {/* Costo de delivery */}
                {distritoSeleccionado && (
                  <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: '6px', fontSize: '0.85rem', background: distritoSeleccionado.consultar ? '#FEF3C7' : '#D1FAE5', color: distritoSeleccionado.consultar ? '#92400E' : '#065F46', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} />
                    {distritoSeleccionado.consultar
                      ? '⚠️ Para envíos fuera de Lima, contáctanos por WhatsApp antes de comprar.'
                      : `✅ Costo de delivery a ${distritoSeleccionado.nombre}: S/ ${distritoSeleccionado.costo}.00`
                    }
                  </div>
                )}
              </div>

              {/* Calle */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Calle / Av. / Jr. *</label>
                <input value={direccion.calle} onChange={e => setDireccion(p => ({...p, calle: e.target.value}))}
                  placeholder="Jr. Los Álamos 123"
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.95rem' }} />
              </div>

              {/* Referencia */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Referencia (opcional)</label>
                <input value={direccion.referencia} onChange={e => setDireccion(p => ({...p, referencia: e.target.value}))}
                  placeholder="Frente al parque, casa color azul..."
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.95rem' }} />
              </div>
            </div>
          )}

          {/* Recojo en tienda — info */}
          {tipoEntrega === 'RECOJO_TIENDA' && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.4rem' }}>🏪 Dirección de la tienda:</p>
              <p style={{ color: '#065F46', fontSize: '0.9rem' }}>Jr. Los Artesanos 245, Lima</p>
              <p style={{ color: '#065F46', fontSize: '0.9rem' }}>Lun-Sáb: 8am-7pm / Dom: 9am-2pm</p>
              <p style={{ color: '#065F46', fontSize: '0.9rem', marginTop: '0.3rem' }}>📞 987-654-321</p>
            </div>
          )}

          {/* Método de pago */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Método de pago</h3>
            <div className="payment-methods" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

              {/* Yape — siempre disponible */}
              {[['YAPE','💜 Yape'],['TRANSFERENCIA','🏦 Transferencia']].map(([v,l]) => (
                <label key={v} style={{ flex: 1, minWidth: '130px', border: `2px solid ${metodoPago===v?'#E63946':'#E5E7EB'}`, borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: metodoPago===v?'#FEF2F2':'white', textAlign: 'center', fontWeight: 600 }}>
                  <input type="radio" value={v} checked={metodoPago===v} onChange={() => setMetodoPago(v)} style={{ display: 'none' }} />
                  {l}
                </label>
              ))}

              {/* Efectivo — solo recojo en tienda */}
              <label style={{ flex: 1, minWidth: '130px', border: `2px solid ${metodoPago==='EFECTIVO'?'#E63946': tipoEntrega==='DELIVERY'?'#F3F4F6':'#E5E7EB'}`, borderRadius: '8px', padding: '1rem', cursor: tipoEntrega==='DELIVERY'?'not-allowed':'pointer', background: metodoPago==='EFECTIVO'?'#FEF2F2':tipoEntrega==='DELIVERY'?'#F9FAFB':'white', textAlign: 'center', fontWeight: 600, color: tipoEntrega==='DELIVERY'?'#9CA3AF':'inherit', position: 'relative' }}>
                <input type="radio" value="EFECTIVO" checked={metodoPago==='EFECTIVO'} onChange={() => tipoEntrega !== 'DELIVERY' && setMetodoPago('EFECTIVO')} disabled={tipoEntrega==='DELIVERY'} style={{ display: 'none' }} />
                💵 Efectivo
                {tipoEntrega === 'DELIVERY' && (
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#9CA3AF', marginTop: '0.2rem' }}>Solo recojo en tienda</span>
                )}
              </label>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.8rem' }}>
              {metodoPago === 'YAPE' && '💜 Después de confirmar verás el número y QR para yapear'}
              {metodoPago === 'EFECTIVO' && '💵 Pagas al recoger en nuestra tienda. Se reserva 24 horas.'}
              {metodoPago === 'TRANSFERENCIA' && '🏦 Te mostraremos los datos bancarios para transferir'}
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div>
          <div className="sticky-summary" style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resumen del pedido</h3>
            {items.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                <span style={{ flex: 1, paddingRight: '0.5rem' }}>{i.nombre} x{i.cantidad}</span>
                <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>S/ {(Number(i.precioOferta||i.precio)*i.cantidad).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '0.8rem', paddingTop: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              {tipoEntrega === 'DELIVERY' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Delivery {distritoSeleccionado ? `(${distritoSeleccionado.nombre})` : ''}</span>
                  <span style={{ color: distritoSeleccionado ? '#374151' : '#9CA3AF', fontWeight: distritoSeleccionado ? 600 : 400 }}>
                    {distritoSeleccionado
                      ? distritoSeleccionado.consultar ? 'A consultar' : `S/ ${distritoSeleccionado.costo}.00`
                      : 'Selecciona distrito'}
                  </span>
                </div>
              )}
            </div>

            <div style={{ borderTop: '2px solid #E5E7EB', marginTop: '0.5rem', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: '#E63946' }}>
                {distritoSeleccionado && !distritoSeleccionado.consultar
                  ? `S/ ${totalConDelivery.toFixed(2)}`
                  : `S/ ${total.toFixed(2)}${tipoEntrega === 'DELIVERY' && !distritoSeleccionado ? ' + delivery' : ''}`
                }
              </span>
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <TerminosCheck aceptado={aceptoTerminos} onChange={setAceptoTerminos} />
            </div>

            <button onClick={handleConfirmarPedido} disabled={cargando || !aceptoTerminos} className="btn-primario"
              style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1rem', opacity: !aceptoTerminos ? 0.5 : 1, cursor: !aceptoTerminos ? 'not-allowed' : 'pointer' }}>
              {cargando ? 'Procesando...' : 'Continuar al pago →'}
            </button>

            {!aceptoTerminos && (
              <p style={{ fontSize: '0.78rem', color: '#E63946', textAlign: 'center', marginTop: '0.5rem' }}> Acepta los términos para continuar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
