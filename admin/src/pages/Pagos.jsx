import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Eye, X } from 'lucide-react'

export default function Pagos() {
  const [pedidos, setPedidos]   = useState([])
  const [filtro, setFiltro]     = useState('PENDIENTE')
  const [modal, setModal]       = useState(null)
  const [notas, setNotas]       = useState('')
  const [cargando, setCargando] = useState(false)

  const cargar = () => {
    axios.get(`/api/admin/pedidos?estado=${filtro}`).then(r => setPedidos(r.data))
  }

  useEffect(() => { cargar() }, [filtro])

  const verificar = async (pedidoId, accion) => {
    setCargando(true)
    try {
      await axios.patch(`/api/admin/pagos/${pedidoId}/verificar`, { accion, notas })
      toast.success(accion === 'VERIFICADO' ? '✅ Pago verificado' : '❌ Pago rechazado')
      setModal(null)
      setNotas('')
      cargar()
    } catch {
      toast.error('Error al procesar')
    } finally {
      setCargando(false)
    }
  }

  const FILTROS = [
    { valor: 'PENDIENTE',       label: 'Pendientes' },
    { valor: 'PAGO_VERIFICADO', label: 'Verificados' },
    { valor: 'CANCELADO',       label: 'Cancelados' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>VERIFICAR PAGOS</h1>
      <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Revisa los comprobantes Yape y confirma los pagos</p>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {FILTROS.map(f => (
          <button key={f.valor} onClick={() => setFiltro(f.valor)} className="btn"
            style={{ background: filtro === f.valor ? '#E63946' : 'white', color: filtro === f.valor ? 'white' : '#374151', border: '1px solid var(--borde)' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#64748B', padding: '2rem' }}>No hay pedidos en este estado</td></tr>
            ) : pedidos.map(p => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong></td>
                <td>
                  <p style={{ fontWeight: 600 }}>{p.usuario.nombre} {p.usuario.apellido}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>{p.usuario.telefono}</p>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: p.pago?.metodo === 'YAPE' ? '#7C3AED' : '#374151' }}>
                    {p.pago?.metodo === 'YAPE' ? '💜 Yape' : p.pago?.metodo === 'EFECTIVO' ? '💵 Efectivo' : '🏦 Transferencia'}
                  </span>
                </td>
                <td><strong style={{ color: '#E63946' }}>S/ {Number(p.total).toFixed(2)}</strong></td>
                <td style={{ fontSize: '0.82rem', color: '#64748B' }}>{new Date(p.creadoEn).toLocaleDateString('es-PE')}</td>
                <td>
                  <span className={`badge-estado badge-${p.pago?.estado?.toLowerCase() || 'pendiente'}`}>
                    {p.pago?.estado || 'SIN PAGO'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => setModal(p)} className="btn btn-gris" style={{ padding: '0.4rem 0.7rem' }} title="Ver detalle">
                      <Eye size={15} />
                    </button>
                    {p.pago?.estado === 'PENDIENTE' && (
                      <>
                        <button onClick={() => { setModal(p) }} className="btn btn-verde" style={{ padding: '0.4rem 0.7rem' }} title="Verificar">
                          <CheckCircle size={15} />
                        </button>
                        <button onClick={() => verificar(p.id, 'RECHAZADO')} className="btn btn-rojo" style={{ padding: '0.4rem 0.7rem' }} title="Rechazar">
                          <XCircle size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800 }}>PEDIDO #{modal.id}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#64748B' }}><X size={22} /></button>
            </div>

            {/* Info cliente */}
            <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.3rem' }}>👤 {modal.usuario.nombre} {modal.usuario.apellido}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>📧 {modal.usuario.email}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>📞 {modal.usuario.telefono}</p>
              {modal.notas && <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.3rem' }}>📍 {modal.notas}</p>}
            </div>

            {/* Productos */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Productos:</p>
              {modal.detalles.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span>{d.producto.nombre} x{d.cantidad}</span>
                  <span style={{ fontWeight: 600 }}>S/ {Number(d.subtotal).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: '0.5rem', fontSize: '1rem' }}>
                <span>Total</span>
                <span style={{ color: '#E63946' }}>S/ {Number(modal.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Comprobante */}
            {modal.pago?.comprobanteUrl && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📸 Comprobante Yape:</p>
                <img src={modal.pago.comprobanteUrl} alt="Comprobante"
                  style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--borde)' }} />
                {modal.pago.codigoOp && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Código op: <strong>{modal.pago.codigoOp}</strong></p>}
              </div>
            )}

            {!modal.pago?.comprobanteUrl && modal.pago?.metodo === 'YAPE' && (
              <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', fontSize: '0.88rem', color: '#92400E' }}>
                ⚠️ El cliente aún no ha subido el comprobante de Yape
              </div>
            )}

            {/* Notas y acciones */}
            {modal.pago?.estado === 'PENDIENTE' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.88rem' }}>Notas (opcional)</label>
                  <textarea value={notas} onChange={e => setNotas(e.target.value)}
                    placeholder="Ej: Pago verificado en Yape personal"
                    rows={2} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => verificar(modal.id, 'VERIFICADO')} disabled={cargando}
                    className="btn btn-verde" style={{ flex: 1, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} /> {cargando ? 'Procesando...' : 'Confirmar pago'}
                  </button>
                  <button onClick={() => verificar(modal.id, 'RECHAZADO')} disabled={cargando}
                    className="btn btn-rojo" style={{ flex: 1, padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <XCircle size={16} /> Rechazar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}