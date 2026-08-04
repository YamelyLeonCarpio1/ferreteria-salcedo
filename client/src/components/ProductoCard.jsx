import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import toast from 'react-hot-toast'

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default function ProductoCard({ producto }) {
  const { agregar } = useCarrito()
  const tieneOferta = producto.precioOferta && Number(producto.precioOferta) < Number(producto.precio)
  const descuento   = tieneOferta ? Math.round((1 - Number(producto.precioOferta) / Number(producto.precio)) * 100) : 0

  const handleAgregar = (e) => {
    e.preventDefault()
    agregar(producto)
    toast.success('Agregado al carrito', { icon: '🛒' })
  }

  const compartirWhatsApp = (e) => {
    e.preventDefault()
    const precio  = Number(producto.precioOferta || producto.precio).toFixed(2)
    const mensaje = encodeURIComponent(
      `🔧 *${producto.nombre}*\n💰 Precio: S/ ${precio}\n\nVer producto: ${window.location.origin}/producto/${producto.id}\n\n_Ferretería Salcedo - Tu ferretería de confianza_`
    )
    window.open(`https://wa.me/?text=${mensaje}`, '_blank')
  }

  const compartirFacebook = (e) => {
    e.preventDefault()
    const url = encodeURIComponent(`${window.location.origin}/producto/${producto.id}`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
  }

  const compartirInstagram = (e) => {
    e.preventDefault()
    // Instagram no tiene API de compartir directa en web,
    // copiamos el link al portapapeles y notificamos al usuario
    navigator.clipboard.writeText(`${window.location.origin}/producto/${producto.id}`)
    toast.success('¡Link copiado! Pégalo en Instagram 📸', { icon: '📋' })
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

          {/* Botones compartir — aparecen al hacer hover */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '0.3rem', opacity: 0, transition: 'opacity 0.2s' }}
            className="share-buttons"
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
            <button onClick={compartirWhatsApp} title="Compartir por WhatsApp"
              style={{ width: '30px', height: '30px', background: '#25D366', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              <WhatsAppIcon size={14} />
            </button>
            <button onClick={compartirFacebook} title="Compartir en Facebook"
              style={{ width: '30px', height: '30px', background: '#1877F2', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              <FacebookIcon size={14} />
            </button>
            <button onClick={compartirInstagram} title="Copiar link para Instagram"
              style={{ width: '30px', height: '30px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              <InstagramIcon size={14} />
            </button>
          </div>
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

            {/* Botones acción */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={compartirWhatsApp} title="Compartir por WhatsApp"
                style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WhatsAppIcon size={16} />
              </button>
              <button onClick={handleAgregar} disabled={producto.stock === 0}
                style={{ background: producto.stock === 0 ? '#E5E7EB' : '#E63946', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}