import { ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import toast from 'react-hot-toast'

export default function ProductoCard({ producto }) {
  const { agregar } = useCarrito()
  const tieneOferta = producto.precioOferta && Number(producto.precioOferta) < Number(producto.precio)
  const descuento = tieneOferta ? Math.round((1 - Number(producto.precioOferta) / Number(producto.precio)) * 100) : 0

  const handleAgregar = (e) => {
    e.preventDefault()
    agregar(producto)
    toast.success('Agregado al carrito', { icon: '🛒' })
  }

  return (
    <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden', background: 'white', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>

        {/* Imagen */}
        <div style={{ position: 'relative', paddingTop: '75%', background: '#F9FAFB' }}>
          <img 
              src={producto.imagenes?.[0] || 'https://placehold.co/300x225?text=Producto'} 
              alt={producto.nombre}
              onError={e => { e.target.src = 'https://placehold.co/300x225?text=Sin+imagen' }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          {tieneOferta && (
            <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#E63946', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              -{descuento}%
            </span>
          )}
          {producto.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700 }}>Sin stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '0.3rem' }}>{producto.categoria?.nombre}</p>
          <p style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.6rem', lineHeight: 1.3, minHeight: '2.4em' }}>{producto.nombre}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {tieneOferta ? (
                <>
                  <span style={{ color: '#E63946', fontWeight: 800, fontSize: '1.1rem' }}>S/ {Number(producto.precioOferta).toFixed(2)}</span>
                  <span style={{ color: '#9CA3AF', textDecoration: 'line-through', fontSize: '0.85rem', marginLeft: '0.4rem' }}>S/ {Number(producto.precio).toFixed(2)}</span>
                </>
              ) : (
                <span style={{ color: '#1A1A2E', fontWeight: 800, fontSize: '1.1rem' }}>S/ {Number(producto.precio).toFixed(2)}</span>
              )}
            </div>
            <button onClick={handleAgregar} disabled={producto.stock === 0}
              style={{ background: producto.stock === 0 ? '#E5E7EB' : '#E63946', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}