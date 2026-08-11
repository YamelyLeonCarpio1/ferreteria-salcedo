import { useEffect, useState } from 'react'
import axios from '../lib/axios'
import { ShoppingBag, Package, Users, DollarSign, AlertTriangle, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Dashboard() {
  const [stats, setStats]   = useState(null)
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    axios.get('/api/admin/dashboard').then(r => setStats(r.data))
    axios.get('/api/admin/pedidos?estado=PENDIENTE').then(r => setPedidos(r.data.slice(0, 5)))
  }, [])

  const tarjetas = stats ? [
    { label: 'Pedidos totales',    valor: stats.totalPedidos,    icon: <ShoppingBag size={22} />, color: '#E63946', bg: '#FEE2E2' },
    { label: 'Pendientes de pago', valor: stats.pedidosPendientes, icon: <Clock size={22} />,      color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Productos activos',  valor: stats.totalProductos,  icon: <Package size={22} />,    color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Clientes',           valor: stats.clientes,        icon: <Users size={22} />,      color: '#10B981', bg: '#D1FAE5' },
    { label: 'Ingresos verificados', valor: `S/ ${Number(stats.ingresos).toFixed(2)}`, icon: <DollarSign size={22} />, color: '#8B5CF6', bg: '#EDE9FE' },
  ] : []

  const datosGrafico = [
    { dia: 'Lun', ventas: 4 }, { dia: 'Mar', ventas: 7 },
    { dia: 'Mié', ventas: 5 }, { dia: 'Jue', ventas: 9 },
    { dia: 'Vie', ventas: 12 }, { dia: 'Sáb', ventas: 15 },
    { dia: 'Dom', ventas: 6 },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>DASHBOARD</h1>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>Resumen general de la ferretería</p>

      {/* Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {tarjetas.map((t, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: t.bg, color: t.color, width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {t.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>{t.label}</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2 }}>{t.valor}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Gráfico */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Pedidos esta semana</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="ventas" fill="#E63946" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pedidos pendientes */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>⏳ Pendientes de verificación</h3>
          {pedidos.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>No hay pedidos pendientes</p>
          ) : (
            pedidos.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid var(--borde)' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pedido #{p.id}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{p.usuario.nombre} {p.usuario.apellido}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#E63946' }}>S/ {Number(p.total).toFixed(2)}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>{p.pago?.metodo}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
