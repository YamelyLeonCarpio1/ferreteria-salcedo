import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [metodoPago, setMetodoPago] = useState('YAPE')
  const [tipoEntrega, setTipoEntrega] = useState('DELIVERY')
  const [direccion, setDireccion] = useState({ calle: '', distrito: '', referencia: '' })
  const [cargando, setCargando] = useState(false)
  const [comprobante, setComprobante] = useState(null)
  const [codigoOp, setCodigoOp] = useState('')
  const [pedidoCreado, setPedidoCreado] = useState(null)

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

  const handlePedido = async () => {
    setCargando(true)
    try {
      const r = await axios.post('/api/pedidos', {
        items: items.map(i => ({ productoId: i.id, cantidad: i.cantidad })),
        tipoEntrega, metodoPago,
        notas: `${direccion.calle} ${direccion.distrito} - Ref: ${direccion.referencia}`
      })
      setPedidoCreado(r.data.pedido)
      vaciar()
      toast.success('¡Pedido creado! Ahora sube tu comprobante de pago.')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al crear pedido')
    } finally {
      setCargando(false)
    }
  }

  const handleComprobante = async () => {
    if (!comprobante) return toast.error('Selecciona una imagen del comprobante')
    setCargando(true)
    try {
      const form = new FormData()
      form.append('comprobante', comprobante)
      form.append('codigoOp', codigoOp)
      await axios.post(`/api/pagos/${pedidoCreado.id}/comprobante`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('¡Comprobante enviado! Te notificaremos cuando se verifique.')
      navigate('/mis-pedidos')
    } catch (e) {
      toast.error('Error al subir comprobante')
    } finally {
      setCargando(false)
    }
  }

  // Pantalla de subir comprobante Yape
  if (pedidoCreado && metodoPago === 'YAPE') return (
    <div className="contenedor" style={{ padding: '3rem 1.5rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💜</div>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>PAGA CON YAPE</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Yapea al siguiente número y sube la captura</p>

        <div style={{ background: '#F3F4F6', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Número Yape</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#7C3AED', letterSpacing: '2px' }}>987-654-321</p>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.5rem' }}>A nombre de: <strong>Ferretería Salcedo</strong></p>
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#E63946', marginTop: '0.8rem' }}>Monto: S/ {Number(pedidoCreado.total).toFixed(2)}</p>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.3rem' }}>Pedido #{pedidoCreado.id}</p>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>Código de operación (opcional)</label>
          <input value={codigoOp} onChange={e => setCodigoOp(e.target.value)} placeholder="Ej: 123456789"
            style={{ width: '100%', padding: '0.7rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.95rem' }} />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>📸 Sube la captura de tu Yape *</label>
          <input type="file" accept="image/*" onChange={e => setComprobante(e.target.files[0])}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px' }} />
        </div>

        <button onClick={handleComprobante} disabled={cargando} className="btn-primario" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
          {cargando ? 'Enviando...' : 'Enviar comprobante'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="contenedor" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>FINALIZAR COMPRA</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

        {/* Formulario */}
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
              {['calle','distrito','referencia'].map(campo => (
                <div key={campo} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'capitalize' }}>{campo}</label>
                  <input value={direccion[campo]} onChange={e => setDireccion(p => ({...p,[campo]:e.target.value}))}
                    placeholder={campo === 'calle' ? 'Jr. Los Álamos 123' : campo === 'distrito' ? 'Miraflores' : 'Frente al parque'}
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
          </div>
        </div>

        {/* Resumen */}
        <div>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Resumen del pedido</h3>
            {items.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                <span>{i.nombre} x{i.cantidad}</span>
                <span style={{ fontWeight: 600 }}>S/ {(Number(i.precioOferta||i.precio)*i.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: '#E63946' }}>S/ {total.toFixed(2)}</span>
            </div>
            {tipoEntrega === 'DELIVERY' && (
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.5rem' }}>+ costo de delivery según zona</p>
            )}
            <button onClick={handlePedido} disabled={cargando} className="btn-primario" style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', fontSize: '1rem' }}>
              {cargando ? 'Procesando...' : 'Confirmar pedido →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}