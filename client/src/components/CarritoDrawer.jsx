import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useCarrito } from '../context/CarritoContext'
import { useNavigate } from 'react-router-dom'

export default function CarritoDrawer({ abierto, onCerrar }) {
  const { items, quitar, actualizar, total, totalItems } = useCarrito()
  const navigate = useNavigate()

  return (
    <>
      {/* Overlay */}
      {abierto && <div onClick={onCerrar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />}

      {/* Drawer */}
      <div className="cart-drawer" style={{ position: 'fixed', top: 0, right: abierto ? 0 : '-420px', width: '420px', maxWidth: '95vw', height: '100vh', background: 'white', zIndex: 201, boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800 }}>
            🛒 MI CARRITO <span style={{ color: '#E63946' }}>({totalItems})</span>
          </h2>
          <button onClick={onCerrar} style={{ background: 'none', border: 'none', color: '#6B7280' }}><X size={22} /></button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6B7280' }}>
              <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid #F3F4F6' }}>
                <img src={item.imagenes?.[0] || 'https://placehold.co/80x80?text=Foto'} alt={item.nombre} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{item.nombre}</p>
                  <p style={{ color: '#E63946', fontWeight: 700 }}>S/ {Number(item.precioOferta || item.precio).toFixed(2)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => actualizar(item.id, item.cantidad - 1)} style={{ width: '28px', height: '28px', border: '1px solid #E5E7EB', borderRadius: '4px', background: 'none', fontWeight: 700 }}>-</button>
                    <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                    <button onClick={() => actualizar(item.id, item.cantidad + 1)} style={{ width: '28px', height: '28px', border: '1px solid #E5E7EB', borderRadius: '4px', background: 'none', fontWeight: 700 }}>+</button>
                  </div>
                </div>
                <button onClick={() => quitar(item.id)} style={{ background: 'none', border: 'none', color: '#E63946', alignSelf: 'flex-start' }}><Trash2 size={18} /></button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total:</span>
              <span style={{ color: '#E63946' }}>S/ {total.toFixed(2)}</span>
            </div>
            <button className="btn-primario" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              onClick={() => { onCerrar(); navigate('/checkout') }}>
              Proceder al pago →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
