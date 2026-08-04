import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, X, FileText, Printer } from 'lucide-react'

const WA_NUMERO = '51987654321'

const ESTADO = {
  PENDIENTE:       { bg: '#FEF3C7', color: '#92400E', texto: 'Pendiente de pago' },
  PAGO_VERIFICADO: { bg: '#D1FAE5', color: '#065F46', texto: 'Pago verificado ✓' },
  EN_PREPARACION:  { bg: '#DBEAFE', color: '#1E40AF', texto: 'En preparación' },
  ENVIADO:         { bg: '#EDE9FE', color: '#5B21B6', texto: 'Enviado 🚚' },
  ENTREGADO:       { bg: '#D1FAE5', color: '#065F46', texto: 'Entregado ✓' },
  CANCELADO:       { bg: '#FEE2E2', color: '#991B1B', texto: 'Cancelado' },
}

const WaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const FbIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const IgIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

function ModalComprobante({ pedido, onCerrar }) {
  const fechaStr = new Date(pedido.creadoEn).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>📄 COMPROBANTE DE PAGO</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => window.print()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1A1A2E', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 0.9rem', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
              <Printer size={14} /> Imprimir
            </button>
            <button onClick={onCerrar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={22} /></button>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #E5E7EB', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#E63946' }}>🔧 FERRETERÍA SALCEDO</h2>
            <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.2rem' }}>RUC: 20123456789</p>
            <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>Jr. Los Artesanos 245, Lima | 📞 987-654-321</p>
            <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>ventas@ferrreteriasalcedo.com</p>
          </div>

          <div style={{ background: '#1A1A2E', color: 'white', textAlign: 'center', padding: '0.7rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px' }}>
              {pedido.pago?.metodo === 'TRANSFERENCIA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA'} N° {String(pedido.id).padStart(6, '0')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
            {[
              ['Fecha de emisión', fechaStr],
              ['N° de pedido', `#${pedido.id}`],
              ['Método de pago', pedido.pago?.metodo || '-'],
              ['Estado del pago', pedido.pago?.estado || '-'],
              ['Tipo de entrega', pedido.tipoEntrega === 'DELIVERY' ? 'Delivery' : 'Recojo en tienda'],
              ['Estado del pedido', ESTADO[pedido.estado]?.texto || pedido.estado],
            ].map(([k, v]) => (
              <div key={k} style={{ background: '#F9FAFB', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '0.1rem' }}>{k}</p>
                <p style={{ fontWeight: 700, color: '#1A1A2E' }}>{v}</p>
              </div>
            ))}
          </div>

          {pedido.notas && (
            <div style={{ background: '#EFF6FF', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
              <p style={{ fontWeight: 700, color: '#1E40AF', marginBottom: '0.2rem' }}>📍 Dirección de entrega</p>
              <p style={{ color: '#374151' }}>{pedido.notas}</p>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F3F4F6' }}>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Producto</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'center', fontWeight: 700, color: '#374151' }}>Cant.</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 700, color: '#374151' }}>P. Unit.</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 700, color: '#374151' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                  <td style={{ padding: '0.6rem 0.8rem', color: '#374151' }}>{d.producto?.nombre}</td>
                  <td style={{ padding: '0.6rem 0.8rem', textAlign: 'center', color: '#374151' }}>{d.cantidad}</td>
                  <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: '#374151' }}>S/ {Number(d.precioUnit).toFixed(2)}</td>
                  <td style={{ padding: '0.6rem 0.8rem', textAlign: 'right', fontWeight: 600, color: '#374151' }}>S/ {Number(d.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '0.8rem' }}>
            {[['Subtotal (sin IGV)', `S/ ${(Number(pedido.total)/1.18).toFixed(2)}`],['IGV (18%)', `S/ ${(Number(pedido.total)-Number(pedido.total)/1.18).toFixed(2)}`]].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem', color: '#6B7280' }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.5rem', color: '#E63946' }}>
              <span>TOTAL</span><span>S/ {Number(pedido.total).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed #E5E7EB', fontSize: '0.78rem', color: '#9CA3AF' }}>
            <p>¡Gracias por su compra en Ferretería Salcedo!</p>
            <p>Este documento es un comprobante electrónico generado automáticamente.</p>
            <p style={{ marginTop: '0.3rem' }}>Para consultas: 987-654-321 | ventas@ferrreteriasalcedo.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalCancelar({ pedido, onCerrar, onConfirmar }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '420px' }}>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.8rem', color: '#E63946' }}>
          ¿Cancelar pedido #{pedido.id}?
        </h3>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Según nuestros{' '}
          <a href="/terminos" target="_blank" style={{ color: '#E63946', fontWeight: 700 }}>Términos y Condiciones</a>,
          puedes cancelar tu pedido solo si el pago <strong>aún no ha sido verificado</strong>.
        </p>
        <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#92400E' }}>
          <strong>⚠️ Estado actual:</strong> {ESTADO[pedido.estado]?.texto}<br/>
          {pedido.estado !== 'PENDIENTE'
            ? '❌ Este pedido ya no puede cancelarse porque el pago fue verificado o está en proceso.'
            : '✅ Tu pedido puede ser cancelado ya que el pago está pendiente de verificación.'}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {pedido.estado === 'PENDIENTE' && (
            <button onClick={() => onConfirmar(pedido.id)}
              style={{ flex: 1, padding: '0.85rem', background: '#E63946', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              Sí, cancelar pedido
            </button>
          )}
          <button onClick={onCerrar}
            style={{ flex: 1, padding: '0.85rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MisPedidos() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos]                   = useState([])
  const [cargando, setCargando]                 = useState(true)
  const [expandido, setExpandido]               = useState(null)
  const [modalComprobante, setModalComprobante] = useState(null)
  const [modalCancelar, setModalCancelar]       = useState(null)

  const cargar = () => {
    if (!usuario) return
    setCargando(true)
    axios.get('/api/pedidos/mios').then(r => setPedidos(r.data)).finally(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [usuario])

  const cancelarPedido = async (pedidoId) => {
    try {
      await axios.put(`/api/admin/pedidos/${pedidoId}`, { estado: 'CANCELADO' })
      setModalCancelar(null)
      cargar()
    } catch { alert('No se pudo cancelar. Contáctanos directamente.') }
  }

  if (!usuario) return (
    <div className="contenedor" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <Link to="/login" className="btn-primario">Inicia sesión para ver tus pedidos</Link>
    </div>
  )

  return (
    <div className="contenedor" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>MIS PEDIDOS</h1>
      <p style={{ color: '#6B7280', marginBottom: '2rem', fontSize: '0.9rem' }}>{pedidos.length} pedido(s) realizados</p>

      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '3rem' }}>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
          <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>Aún no tienes pedidos</p>
          <Link to="/productos" className="btn-primario" style={{ display: 'inline-block', marginTop: '1rem' }}>Ir a comprar</Link>
        </div>
      ) : pedidos.map(pedido => {
        const est    = ESTADO[pedido.estado] || ESTADO.PENDIENTE
        const abierto = expandido === pedido.id

        return (
          <div key={pedido.id} style={{ border: '1px solid #E5E7EB', borderRadius: '12px', marginBottom: '1rem', background: 'white', overflow: 'hidden' }}>

            {/* Cabecera */}
            <div onClick={() => setExpandido(abierto ? null : pedido.id)}
              style={{ padding: '1.2rem 1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', background: abierto ? '#FAFAFA' : 'white', transition: 'background 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Pedido #{pedido.id}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.82rem', marginLeft: '0.8rem' }}>{new Date(pedido.creadoEn).toLocaleDateString('es-PE')}</span>
                </div>
                <span style={{ background: est.bg, color: est.color, padding: '0.25rem 0.7rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.78rem' }}>{est.texto}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 800, color: '#E63946', fontSize: '1.05rem' }}>S/ {Number(pedido.total).toFixed(2)}</span>
                {abierto ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
              </div>
            </div>

            {/* Preview */}
            <div style={{ padding: '0 1.5rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {pedido.detalles.slice(0, 3).map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F9FAFB', borderRadius: '6px', padding: '0.4rem 0.7rem', fontSize: '0.82rem' }}>
                  <img src={d.producto?.imagenes?.[0]} alt="" onError={e => { e.target.src = 'https://placehold.co/28x28?text=?' }}
                    style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span>{d.producto?.nombre?.substring(0, 25)}{d.producto?.nombre?.length > 25 ? '...' : ''}</span>
                  <span style={{ color: '#9CA3AF' }}>x{d.cantidad}</span>
                </div>
              ))}
              {pedido.detalles.length > 3 && <span style={{ fontSize: '0.82rem', color: '#6B7280', padding: '0.4rem 0.7rem' }}>+{pedido.detalles.length - 3} más</span>}
            </div>

            {/* Detalle expandido */}
            {abierto && (
              <div style={{ borderTop: '1px solid #F3F4F6', padding: '1.2rem 1.5rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#374151', marginBottom: '0.8rem' }}>PRODUCTOS</h4>
                {pedido.detalles.map(d => (
                  <div key={d.id} style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid #F9FAFB' }}>
                    <img src={d.producto?.imagenes?.[0]} alt="" onError={e => { e.target.src = 'https://placehold.co/56x56?text=?' }}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{d.producto?.nombre}</p>
                      <p style={{ color: '#6B7280', fontSize: '0.82rem' }}>x{d.cantidad} — S/ {Number(d.precioUnit).toFixed(2)} c/u</p>
                    </div>
                    <span style={{ fontWeight: 700, color: '#374151' }}>S/ {Number(d.subtotal).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginTop: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                    <p style={{ color: '#9CA3AF', marginBottom: '0.2rem' }}>Método de pago</p>
                    <p style={{ fontWeight: 700 }}>{pedido.pago?.metodo === 'YAPE' ? '💜 Yape' : pedido.pago?.metodo === 'EFECTIVO' ? '💵 Efectivo' : '🏦 Transferencia'}</p>
                  </div>
                  <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                    <p style={{ color: '#9CA3AF', marginBottom: '0.2rem' }}>Tipo de entrega</p>
                    <p style={{ fontWeight: 700 }}>{pedido.tipoEntrega === 'DELIVERY' ? '🚚 Delivery' : '🏪 Recojo en tienda'}</p>
                  </div>
                  {pedido.notas && (
                    <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.85rem', gridColumn: '1/-1' }}>
                      <p style={{ color: '#9CA3AF', marginBottom: '0.2rem' }}>📍 Dirección de entrega</p>
                      <p style={{ fontWeight: 600 }}>{pedido.notas}</p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Total del pedido</p>
                    <p style={{ fontWeight: 800, fontSize: '1.3rem', color: '#E63946' }}>S/ {Number(pedido.total).toFixed(2)}</p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Boleta/Factura */}
                  <button onClick={() => setModalComprobante(pedido)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1A1A2E', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                    <FileText size={16} />
                    {pedido.pago?.metodo === 'TRANSFERENCIA' ? 'Ver Factura' : 'Ver Boleta'}
                  </button>

                  {/* WhatsApp soporte */}
                  <a href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido #${pedido.id} por S/ ${Number(pedido.total).toFixed(2)}. Estado: ${ESTADO[pedido.estado]?.texto}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                    <WaIcon /> Soporte WhatsApp
                  </a>

                  {/* Compartir Facebook */}
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                    <FbIcon /> Facebook
                  </a>

                  {/* Compartir Instagram (copiar link) */}
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.origin); alert('¡Link copiado! Pégalo en tu historia de Instagram 📸') }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                    <IgIcon /> Instagram
                  </button>

                  {/* Cancelar */}
                  {pedido.estado === 'PENDIENTE' && (
                    <button onClick={() => setModalCancelar(pedido)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', color: '#E63946', border: '2px solid #E63946', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                      <X size={16} /> Cancelar pedido
                    </button>
                  )}

                  {/* Volver a comprar */}
                  <Link to="/productos"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                    🔁 Volver a comprar
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {modalComprobante && <ModalComprobante pedido={modalComprobante} onCerrar={() => setModalComprobante(null)} />}
      {modalCancelar    && <ModalCancelar    pedido={modalCancelar}    onCerrar={() => setModalCancelar(null)} onConfirmar={cancelarPedido} />}
    </div>
  )
}