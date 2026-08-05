import { useEffect, useState } from 'react'
import axios from '../lib/axios'

export default function Clientes() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    axios.get('/api/admin/clientes').then(r => setClientes(r.data))
  }, [])

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>CLIENTES</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>Cliente</th><th>Email</th><th>Teléfono</th><th>Pedidos</th><th>Registrado</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td><strong>{c.nombre} {c.apellido}</strong></td>
                <td style={{ fontSize: '0.85rem' }}>{c.email}</td>
                <td style={{ fontSize: '0.85rem' }}>{c.telefono || '-'}</td>
                <td><span style={{ fontWeight: 700, color: '#E63946' }}>{c._count.pedidos}</span></td>
                <td style={{ fontSize: '0.82rem', color: '#64748B' }}>{new Date(c.creadoEn).toLocaleDateString('es-PE')}</td>
                <td><span className={`badge-estado ${c.activo ? 'badge-verificado' : 'badge-cancelado'}`}>{c.activo ? 'Activo' : 'Inactivo'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}