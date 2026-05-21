import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

const ESTADO_COLOR = {
  PENDIENTE: { bg: '#FEF3C7', color: '#92400E', texto: 'Pendiente de pago' },
  PAGO_VERIFICADO: { bg: '#D1FAE5', color: '#065F46', texto: 'Pago verificado ✓' },
  EN_PREPARACION: { bg: '#DBEAFE', color: '#1E40AF', texto: 'En preparación' },
  ENVIADO: { bg: '#EDE9FE', color: '#5B21B6', texto: 'Enviado' },
  ENTREGADO: { bg: '#D1FAE5', color: '#065F46', texto: 'Entregado ✓' },
  CANCELADO: { bg: '#FEE2E2', color: '#991B1B', texto: 'Cancelado' },
}

export default function MisPedidos() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario) return
    axios.get('/api/pedidos/mis-pedidos')
      .then(r => setPedidos(r.data))
      .finally(() => setCargando(false))
  }, [usuario])

  if (!usuario) return (
    <div className="contenedor" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <Link to="/login" className="btn-primario">Inicia sesión para ver tus pedidos</Link>
    </div>
  )

  return (
    <div className="contenedor" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>MIS PEDIDOS</h1>

      {cargando ? <p>Cargando...</p> : pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
          <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>Aún no tienes pedidos</p>
          <Link to="/productos" className="btn-primario" style={{ display: 'inline-block', marginTop: '1rem' }}>Ir a comprar</Link>
        </div>
      ) : (
        pedidos.map(pedido => {
          const estado = ESTADO_COLOR[pedido.estado] || ESTADO_COLOR.PENDIENTE
          return (
            <div key={pedido.id} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>Pedido #{pedido.id}</span>
                  <span style={{ color: '#6B7280', fontSize: '0.85rem', marginLeft: '1rem' }}>{new Date(pedido.creadoEn).toLocaleDateString('es-PE')}</span>
                </div>
                <span style={{ background: estado.bg, color: estado.color, padding: '0.3rem 0.8rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.82rem' }}>
                  {estado.texto}
                </span>
              </div>

              {pedido.detalles.map(d => (
                <div key={d.id} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <img src={d.producto.imagenes?.[0] || 'https://placehold.co/50x50'} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.producto.nombre}</p>
                    <p style={{ color: '#6B7280', fontSize: '0.82rem' }}>x{d.cantidad} — S/ {Number(d.subtotal).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Método: {pedido.pago?.metodo}</span>
                <span style={{ fontWeight: 800, color: '#E63946', fontSize: '1.1rem' }}>Total: S/ {Number(pedido.total).toFixed(2)}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}