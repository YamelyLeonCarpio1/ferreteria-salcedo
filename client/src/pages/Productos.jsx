import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductoCard from '../components/ProductoCard'
import { SlidersHorizontal } from 'lucide-react'

export default function Productos() {
  const [searchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)

  const buscar    = searchParams.get('buscar')    || ''
  const catNombre = searchParams.get('categoria') || ''
  const catId     = searchParams.get('categoriaId') || ''

  useEffect(() => {
    axios.get('/api/categorias').then(r => setCategorias(r.data))
  }, [])

  useEffect(() => {
    setCargando(true)
    const params = new URLSearchParams()
    if (buscar) params.set('buscar', buscar)
    if (catId)  params.set('categoria', catId)
    params.set('limit', '24')

    axios.get(`/api/productos?${params}`)
      .then(r => { setProductos(r.data.productos); setTotal(r.data.total) })
      .finally(() => setCargando(false))
  }, [buscar, catId])

  return (
    <div className="contenedor" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>

        {/* Sidebar filtros */}
        <aside style={{ width: '220px', flexShrink: 0, display: 'window innerWidth < 768px ? "none" : "block"' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={18} /> CATEGORÍAS
          </h3>
          {categorias.map(cat => (
            <a key={cat.id} href={`/productos?categoriaId=${cat.id}`}
              style={{ display: 'block', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.9rem', background: catId == cat.id ? '#FEE2E2' : 'transparent', color: catId == cat.id ? '#E63946' : '#374151', transition: 'background 0.2s' }}>
              {cat.nombre}
              <span style={{ float: 'right', color: '#9CA3AF', fontSize: '0.8rem' }}>{cat._count?.productos}</span>
            </a>
          ))}
        </aside>

        {/* Grid productos */}
        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800 }}>
              {buscar ? `Resultados para "${buscar}"` : catNombre || 'TODOS LOS PRODUCTOS'}
            </h1>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>{total} productos</span>
          </div>

          {cargando ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>Cargando productos...</div>
          ) : productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>No se encontraron productos</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.2rem' }}>
              {productos.map(p => <ProductoCard key={p.id} producto={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}