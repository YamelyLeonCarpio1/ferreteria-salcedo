import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, CheckCircle } from 'lucide-react'

export default function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [metodoPago, setMetodoPago]     = useState('YAPE')
  const [tipoEntrega, setTipoEntrega]   = useState('DELIVERY')
  const [direccion, setDireccion]       = useState({ calle: '', distrito: '', referencia: '' })
  const [cargando, setCargando]         = useState(false)
  const [comprobante, setComprobante]   = useState(null)
  const [codigoOp, setCodigoOp]         = useState('')
  const [pedidoCreado, setPedidoCreado] = useState(null)
  const [paso, setPaso]                 = useState(1)

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

  // ── PASO 1: Crear el pedido ──────────────────────────────
  const handleConfirmarPedido = async () => {
    if (tipoEntrega === 'DELIVERY' && !direccion.calle.trim())
      return toast.error('Ingresa tu dirección de entrega')

    setCargando(true)
    try {
      const r = await axios.post('/api/pedidos', {
        items: items.map(i => ({ productoId: i.id, cantidad: i.cantidad })),
        tipoEntrega,
        metodoPago,
        notas: tipoEntrega === 'DELIVERY'
          ? `${direccion.calle}, ${direccion.distrito}. Ref: ${direccion.referencia}`
          : 'Recojo en tienda'
      })
      // ✅ FIX: r.data es el pedido directamente (no r.data.pedido)
      setPedidoCreado(r.data)
      // ✅ FIX: NO vaciamos el carrito aquí, lo hacemos al confirmar el pago
      setPaso(2)
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al crear pedido')
    } finally {
      setCargando(false)
    }
  }

  // ── PASO 2: Subir comprobante ────────────────────────────
  const handleSubirComprobante = async () => {
    if ((metodoPago === 'YAPE' || metodoPago === 'TRANSFERENCIA') && !comprobante)
      return toast.error('Debes subir el comprobante de pago')

    setCargando(true)
    try {
      const form = new FormData()
      if (comprobante) form.append('comprobante', comprobante)
      if (codigoOp)    form.append('codigoOp', codigoOp)

      await axios.post(`/api/pagos/comprobante/${pedidoCreado.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // ✅ FIX: vaciamos el carrito SOLO cuando el pago fue confirmado
      vaciar()
      setPaso(3)
      toast.success('¡Comprobante enviado correctamente!')
    } catch (e) {
      toast.error('Error al enviar comprobante')
    } finally {
      setCargando(false)
    }
  }

  const handleEfectivoConfirmar = async () => {
    setCargando(true)
    try {
      await axios.post(`/api/pagos/comprobante/${pedidoCreado.id}`, { codigoOp: 'EFECTIVO' })
      // ✅ FIX: vaciamos el carrito SOLO cuando el pedido en efectivo fue confirmado
      vaciar()
      setPaso(3)
    } catch {
      toast.error('Error al confirmar')
    } finally {
      setCargando(false)
    }
  }

  // ── PASO 3: Confirmación final ───────────────────────────
  if (paso === 3) return (
    <div className="contenedor" style={{ padding: '3rem 1.5rem', maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '2.5rem' }}>
        <CheckCircle size={64} color="#10B981" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          ¡PEDIDO CONFIRMADO!
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
          Tu pedido <strong>#{pedidoCreado?.id}</strong> ha sido recibido.
        </p>

        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          {metodoPago === 'EFECTIVO' ? (
            <>
              <p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.3rem' }}>✅ Pago al recibir confirmado</p>
              <p style={{ fontSize: '0.88rem', color: '#065F46' }}>Ten listo el monto exacto al momento de la entrega.</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.3rem' }}>📋 Comprobante enviado</p>
              <p style={{ fontSize: '0.88rem', color: '#065F46' }}>Nuestro equipo verificará tu pago en los próximos minutos y recibirás la confirmación.</p>
            </>
          )}
        </div>

        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.88rem' }}>
          <p style={{ fontWeight: 700, color: '#92400E', marginBottom: '0.3rem' }}>📦 Seguimiento de tu pedido</p>
          <p style={{ color: '#92400E' }}>Puedes ver el estado de tu pedido en tiempo real en <strong>"Mis pedidos"</strong>.</p>
        </div>

        <button onClick={() => navigate('/mis-pedidos')} className="btn-primario" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
          Ver mis pedidos →
        </button>
      </div>
    </div>
  )

  // ── PASO 2: Pantalla de pago ─────────────────────────────
  if (paso === 2) return (
    <div className="contenedor" style={{ padding: '3rem 1.5rem', maxWidth: '520px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
        REALIZAR PAGO
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
        Pedido #{pedidoCreado?.id} — Total: <strong style={{ color: '#E63946' }}>S/ {Number(pedidoCreado?.total).toFixed(2)}</strong>
      </p>

      {/* ── YAPE ── */}
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
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#E63946', marginTop: '0.5rem' }}>
              Monto: S/ {Number(pedidoCreado?.total).toFixed(2)}
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              Código de operación Yape (opcional)
            </label>
            <input value={codigoOp} onChange={e => setCodigoOp(e.target.value)}
              placeholder="Ej: 987654321"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              📸 Sube la captura de pantalla de tu Yape *
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px dashed #C4B5FD', borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: comprobante ? '#F5F3FF' : 'white', justifyContent: 'center' }}>
              <Upload size={18} color="#7C3AED" />
              <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem' }}>
                {comprobante ? `✓ ${comprobante.name}` : 'Seleccionar imagen'}
              </span>
              <input type="file" accept="image/*" onChange={e => setComprobante(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>

          <button onClick={handleSubirComprobante} disabled={cargando || !comprobante}
            style={{ width: '100%', padding: '1rem', background: comprobante ? '#7C3AED' : '#E5E7EB', color: comprobante ? 'white' : '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: comprobante ? 'pointer' : 'not-allowed' }}>
            {cargando ? 'Enviando...' : 'Confirmar pago con Yape'}
          </button>
        </div>
      )}

      {/* ── TRANSFERENCIA ── */}
      {metodoPago === 'TRANSFERENCIA' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 800, color: '#1E40AF', marginBottom: '1rem', fontSize: '1.1rem' }}>🏦 Transferencia Bancaria</h3>

          <div style={{ background: '#EFF6FF', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <p style={{ fontWeight: 700, marginBottom: '0.8rem', color: '#1E40AF' }}>Datos de cuenta:</p>
            {[
              ['Banco', 'BCP'],
              ['Cuenta corriente', '191-12345678-0-12'],
              ['CCI', '00219100123456780123'],
              ['Titular', 'Ferretería Salcedo S.A.C.'],
              ['RUC', '20123456789'],
              ['Monto exacto', `S/ ${Number(pedidoCreado?.total).toFixed(2)}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid #BFDBFE', fontSize: '0.88rem' }}>
                <span style={{ color: '#6B7280' }}>{k}</span>
                <strong style={{ color: k === 'Monto exacto' ? '#E63946' : '#1E3A8A' }}>{v}</strong>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              Número de operación *
            </label>
            <input value={codigoOp} onChange={e => setCodigoOp(e.target.value)}
              placeholder="Ej: 00123456789"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.88rem' }}>
              📸 Sube el voucher de transferencia *
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px dashed #BFDBFE', borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: comprobante ? '#EFF6FF' : 'white', justifyContent: 'center' }}>
              <Upload size={18} color="#1E40AF" />
              <span style={{ color: '#1E40AF', fontWeight: 600, fontSize: '0.9rem' }}>
                {comprobante ? `✓ ${comprobante.name}` : 'Seleccionar imagen o PDF'}
              </span>
              <input type="file" accept="image/*,.pdf" onChange={e => setComprobante(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>

          <button onClick={handleSubirComprobante} disabled={cargando || !comprobante}
            style={{ width: '100%', padding: '1rem', background: comprobante ? '#1E40AF' : '#E5E7EB', color: comprobante ? 'white' : '#9CA3AF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: comprobante ? 'pointer' : 'not-allowed' }}>
            {cargando ? 'Enviando...' : 'Confirmar transferencia'}
          </button>
        </div>
      )}

      {/* ── EFECTIVO ── */}
      {metodoPago === 'EFECTIVO' && (
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 800, color: '#065F46', marginBottom: '1rem', fontSize: '1.1rem' }}>💵 Pago en Efectivo</h3>

          <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.2rem' }}>
            {tipoEntrega === 'DELIVERY' ? (
              <>
                <p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.5rem' }}>🚚 Pago contra entrega</p>
                <p style={{ fontSize: '0.9rem', color: '#065F46', lineHeight: 1.6 }}>
                  El repartidor cobrará en efectivo al momento de la entrega.<br/>
                  Ten listo el monto exacto: <strong style={{ fontSize: '1.2rem', color: '#E63946' }}>S/ {Number(pedidoCreado?.total).toFixed(2)}</strong>
                </p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 700, color: '#065F46', marginBottom: '0.5rem' }}>🏪 Pago en tienda</p>
                <p style={{ fontSize: '0.9rem', color: '#065F46', lineHeight: 1.6 }}>
                  Paga en nuestra tienda al recoger tu pedido:<br/>
                  <strong>Jr. Los Artesanos 245, Lima</strong><br/>
                  Monto: <strong style={{ fontSize: '1.2rem', color: '#E63946' }}>S/ {Number(pedidoCreado?.total).toFixed(2)}</strong>
                </p>
              </>
            )}
          </div>

          <button onClick={handleEfectivoConfirmar} disabled={cargando}
            style={{ width: '100%', padding: '1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
            {cargando ? 'Confirmando...' : '✓ Confirmar pedido en efectivo'}
          </button>
        </div>
      )}
    </div>
  )

  // ── PASO 1: Formulario ───────────────────────────────────
  return (
    <div className="contenedor" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
        FINALIZAR COMPRA
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div>
          {/* Tipo entrega */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Tipo de entrega</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[['DELIVERY','🚚 Delivery a domicilio'],['RECOJO_TIENDA','🏪 Recojo en tienda']].map(([v,l]) => (
                <label key={v} style={{ flex: 1, border: `2px solid ${tipoEntrega===v?'#E63946':'#E5E7EB'}`, borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: tipoEntrega===v?'#FEF2F2':'white', textAlign: 'center', fontWeight: 600 }}>
                  <input type="radio" value={v} checked={tipoEntrega===v} onChange={() => setTipoEntrega(v)} style={{ display: 'none' }} />
                  {l}
                </label>
              ))}
            </div>
          </div>

          {/* Dirección */}
          {tipoEntrega === 'DELIVERY' && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Dirección de entrega</h3>
              {[['calle','Calle / Av. / Jr. *','Jr. Los Álamos 123'],['distrito','Distrito *','Miraflores'],['referencia','Referencia','Frente al parque']].map(([campo,label,ph]) => (
                <div key={campo} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>{label}</label>
                  <input value={direccion[campo]} onChange={e => setDireccion(p => ({...p,[campo]:e.target.value}))}
                    placeholder={ph}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.95rem' }} />
                </div>
              ))}
            </div>
          )}

          {/* Método de pago */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Método de pago</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[['YAPE','💜 Yape'],['EFECTIVO','💵 Efectivo'],['TRANSFERENCIA','🏦 Transferencia']].map(([v,l]) => (
                <label key={v} style={{ flex: 1, minWidth: '130px', border: `2px solid ${metodoPago===v?'#E63946':'#E5E7EB'}`, borderRadius: '8px', padding: '1rem', cursor: 'pointer', background: metodoPago===v?'#FEF2F2':'white', textAlign: 'center', fontWeight: 600 }}>
                  <input type="radio" value={v} checked={metodoPago===v} onChange={() => setMetodoPago(v)} style={{ display: 'none' }} />
                  {l}
                </label>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.8rem' }}>
              {metodoPago === 'YAPE' && '💜 Después de confirmar verás el número y QR para yapear'}
              {metodoPago === 'EFECTIVO' && '💵 Pagas al recibir tu pedido o al recoger en tienda'}
              {metodoPago === 'TRANSFERENCIA' && '🏦 Te mostraremos los datos bancarios para transferir'}
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resumen del pedido</h3>
            {items.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                <span style={{ flex: 1, paddingRight: '0.5rem' }}>{i.nombre} x{i.cantidad}</span>
                <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>S/ {(Number(i.precioOferta||i.precio)*i.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: '#E63946' }}>S/ {total.toFixed(2)}</span>
            </div>
            {tipoEntrega === 'DELIVERY' && (
              <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.4rem' }}>+ costo de delivery según zona</p>
            )}
            <button onClick={handleConfirmarPedido} disabled={cargando} className="btn-primario"
              style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', fontSize: '1rem' }}>
              {cargando ? 'Procesando...' : 'Continuar al pago →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}