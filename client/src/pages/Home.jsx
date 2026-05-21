import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ProductoCard from '../components/ProductoCard'
import { ChevronRight, Truck, Shield, Clock, Tag } from 'lucide-react'

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    axios.get('/api/productos?destacado=true&limit=8').then(r => setDestacados(r.data.productos))
    axios.get('/api/categorias').then(r => setCategorias(r.data))
  }, [])

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D2D 100%)', color: 'white', padding: '4rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: 'url(https://placehold.co/800x400/E63946/E63946?text=+) center/cover', opacity: 0.08 }} />
        <div className="contenedor">
          <p style={{ color: '#FFB703', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '2px', fontSize: '0.85rem' }}>⚡ FERRETERÍA SALCEDO</p>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.2rem' }}>
            TODO PARA TU<br /><span style={{ color: '#E63946' }}>CONSTRUCCIÓN</span><br />Y HOGAR
          </h1>
          <p style={{ color: '#9CA3AF', maxWidth: '450px', marginBottom: '2rem', lineHeight: 1.6 }}>
            Herramientas, materiales y todo lo que necesitas. Delivery en Lima el mismo día.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/productos" className="btn-primario" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>Ver Catálogo</Link>
            <Link to="/productos?destacado=true" className="btn-secundario" style={{ padding: '0.9rem 2rem', fontSize: '1rem', color: 'white', borderColor: 'white' }}>Ofertas del día</Link>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div style={{ background: '#FFB703', padding: '1rem 0' }}>
        <div className="contenedor" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          {[
            { icon: <Truck size={20} />, texto: 'Delivery mismo día en Lima' },
            { icon: <Shield size={20} />, texto: 'Productos garantizados' },
            { icon: <Clock size={20} />, texto: 'Atención Lun-Sáb 8am-7pm' },
            { icon: <Tag size={20} />, texto: 'Paga con Yape o efectivo' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#1A1A2E', fontSize: '0.9rem' }}>
              {b.icon} {b.texto}
            </div>
          ))}
        </div>
      </div>

      {/* Categorías */}
      <section style={{ padding: '3rem 0' }}>
        <div className="contenedor">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800 }}>CATEGORÍAS</h2>
            <Link to="/productos" style={{ color: '#E63946', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Ver todo <ChevronRight size={18} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {categorias.map(cat => (
              <Link key={cat.id} to={`/productos?categoriaId=${cat.id}`}
                style={{ background: '#F3F4F6', borderRadius: '10px', padding: '1.5rem 1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', border: '2px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E63946'; e.currentTarget.style.background = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F3F4F6' }}>
                🔧 {cat.nombre}
                <p style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 400, marginTop: '0.3rem' }}>{cat._count?.productos} productos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section style={{ padding: '2rem 0 4rem', background: '#F9FAFB' }}>
        <div className="contenedor">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800 }}>⭐ PRODUCTOS DESTACADOS</h2>
            <Link to="/productos" style={{ color: '#E63946', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Ver todo <ChevronRight size={18} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
            {destacados.map(p => <ProductoCard key={p.id} producto={p} />)}
          </div>
        </div>
      </section>

      {/* Banner Yape */}
      <section style={{ background: '#1A1A2E', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
        <div className="contenedor">
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            💜 PAGA CON <span style={{ color: '#7C3AED' }}>YAPE</span> Y RECIBE HOY
          </h2>
          <p style={{ color: '#9CA3AF', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Realiza tu pedido, paga con Yape y lo verificamos en minutos. Delivery el mismo día en Lima.
          </p>
          <Link to="/productos" className="btn-primario" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>Comprar ahora</Link>
        </div>
      </section>
    </div>
  )
}