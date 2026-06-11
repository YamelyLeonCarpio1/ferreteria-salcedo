import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ESTADOS = ['PENDIENTE','PAGO_VERIFICADO','EN_PREPARACION','ENVIADO','ENTREGADO','CANCELADO']

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro]   = useState('')

  const cargar = () => {
    const q = filtro ? `?estado=${filtro}` : ''
    axios.get(`/api/admin/pedidos${q}`).then(r => setPedidos(r.data))
  }

  useEffect(() => { cargar() }, [filtro])

  const cambiarEstado = async (id, estado) => {
    try {
      await axios.put(`/api/admin/pedidos/${id}`, { estado })
      toast.success('Estado actualizado')
      cargar()
    } catch { toast.error('Error al actualizar') }
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>GESTIÓN DE PEDIDOS</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFiltro('')} className="btn" style={{ background: !filtro ? '#E63946' : 'white', color: !filtro ? 'white' : '#374151', border: '1px solid var(--borde)' }}>Todos</button>
        {ESTADOS.map(e => (
          <button key={e} onClick={() => setFiltro(e)} className="btn"
            style={{ background: filtro === e ? '#E63946' : 'white', color: filtro === e ? 'white' : '#374151', border: '1px solid var(--borde)', fontSize: '0.8rem' }}>
            {e.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Entrega</th><th>Estado</th><th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td><strong>#{p.id}</strong><br/><span style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(p.creadoEn).toLocaleDateString('es-PE')}</span></td>
                <td>
                  <p style={{ fontWeight: 600 }}>{p.usuario.nombre} {p.usuario.apellido}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>{p.usuario.email}</p>
                </td>
                <td style={{ fontSize: '0.82rem' }}>{p.detalles.map(d => `${d.producto.nombre} x${d.cantidad}`).join(', ')}</td>
                <td><strong style={{ color: '#E63946' }}>S/ {Number(p.total).toFixed(2)}</strong></td>
                <td><span style={{ fontSize: '0.82rem', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{p.tipoEntrega}</span></td>
                <td><span className={`badge-estado badge-${p.estado.toLowerCase().replace('_', '')}`}>{p.estado.replace('_', ' ')}</span></td>
                <td>
                  <select value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.4rem' }}>
                    {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}