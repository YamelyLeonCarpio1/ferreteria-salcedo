import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShoppingCart, ArrowLeft, Star, Package } from 'lucide-react'
import { useCarrito } from '../context/CarritoContext'
import toast from 'react-hot-toast'

export default function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregar } = useCarrito()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [imgActiva, setImgActiva] = useState(0)

  useEffect(() => {
    setCargando(true)
    axios.get(`/api/productos/${id}`)
      .then(r => setProducto(r.data))
      .catch(() => navigate('/productos'))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
      Cargando producto...
    </div>
  )

  if (!producto) return null

  const tieneOferta = producto.precioOferta && Number(producto.precioOferta) < Number(producto.precio)
  const precio      = Number(tieneOferta ? producto.precioOferta : producto.precio)
  const descuento   = tieneOferta ? Math.round((1 - Number(producto.precioOferta) / Number(producto.precio)) * 100) : 0

  const handleAgregar = () => {
    agregar(producto, cantidad)
    toast.success(`${cantidad} unidad(es) agregada(s) al carrito 🛒`)
  }

  return (
    <div className="contenedor page-padding">

      {/* Breadcrumb */}
      <div className="breadcrumb-row" style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: '#6B7280' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#E63946', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Volver
        </button>
        <span>/</span>
        <span>{producto.categoria?.nombre}</span>
        <span>/</span>
        <span style={{ color: '#1A1A2E', fontWeight: 500 }}>{producto.nombre}</span>
      </div>

      {/* Contenido principal */}
      <div className="grid-2" style={{ gap: '3rem' }}>

        {/* Imágenes */}
        <div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#F9FAFB', marginBottom: '1rem', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={producto.imagenes?.[imgActiva] || 'https://placehold.co/500x500?text=Sin+imagen'}
              alt={producto.nombre}
              onError={e => { e.target.src = 'https://placehold.co/500x500?text=Sin+imagen' }}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
            />
          </div>
          {/* Miniaturas */}
          {producto.imagenes?.length > 1 && (
            <div className="product-thumbnails" style={{ display: 'flex', gap: '0.5rem' }}>
              {producto.imagenes.map((img, i) => (
                <button key={i} onClick={() => setImgActiva(i)}
                  style={{ width: '70px', height: '70px', border: `2px solid ${imgActiva === i ? '#E63946' : '#E5E7EB'}`, borderRadius: '8px', overflow: 'hidden', background: 'none', cursor: 'pointer', padding: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info del producto */}
        <div>
          {/* Categoría */}
          <p style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            {producto.categoria?.nombre}
          </p>

          {/* Nombre */}
          <h1 className="producto-nombre" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            {producto.nombre}
          </h1>

          {/* SKU */}
          {producto.sku && (
            <p style={{ fontSize: '0.82rem', color: '#9CA3AF', marginBottom: '1rem' }}>
              SKU: {producto.sku}
            </p>
          )}

          {/* Precio */}
          <div style={{ marginBottom: '1.5rem' }}>
            {tieneOferta ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#E63946' }}>
                  S/ {Number(producto.precioOferta).toFixed(2)}
                </span>
                <span style={{ fontSize: '1.2rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  S/ {Number(producto.precio).toFixed(2)}
                </span>
                <span style={{ background: '#E63946', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                  -{descuento}%
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1A1A2E' }}>
                S/ {Number(producto.precio).toFixed(2)}
              </span>
            )}
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <p style={{ color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {producto.descripcion}
            </p>
          )}

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Package size={16} color={producto.stock > 0 ? '#10B981' : '#E63946'} />
            {producto.stock > 0 ? (
              <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.9rem' }}>
                En stock ({producto.stock} disponibles)
              </span>
            ) : (
              <span style={{ color: '#E63946', fontWeight: 600, fontSize: '0.9rem' }}>Sin stock</span>
            )}
          </div>

          {/* Cantidad y botón */}
          {producto.stock > 0 && (
            <div className="add-cart-row" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => setCantidad(c => Math.max(1, c - 1))}
                  style={{ width: '40px', height: '44px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}>−</button>
                <span style={{ width: '44px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>{cantidad}</span>
                <button onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))}
                  style={{ width: '40px', height: '44px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}>+</button>
              </div>

              <button onClick={handleAgregar} className="btn-primario"
                style={{ flex: 1, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <ShoppingCart size={20} /> Agregar al carrito
              </button>
            </div>
          )}

          {/* Beneficios */}
          <div style={{ background: '#F9FAFB', borderRadius: '10px', padding: '1rem', fontSize: '0.88rem' }}>
            {['🚚 Delivery el mismo día en Lima', '💜 Paga con Yape o efectivo', '✅ Producto garantizado'].map((b, i) => (
              <p key={i} style={{ marginBottom: i < 2 ? '0.4rem' : 0, color: '#4B5563' }}>{b}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Reseñas */}
      {producto.resenas?.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            RESEÑAS ({producto.resenas.length})
          </h2>
          {producto.resenas.map(r => (
            <div key={r.id} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <strong>{r.usuario.nombre} {r.usuario.apellido}</strong>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} fill={s <= r.calificacion ? '#FFB703' : 'none'} color={s <= r.calificacion ? '#FFB703' : '#D1D5DB'} />
                  ))}
                </div>
              </div>
              {r.comentario && <p style={{ color: '#4B5563', fontSize: '0.9rem' }}>{r.comentario}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
