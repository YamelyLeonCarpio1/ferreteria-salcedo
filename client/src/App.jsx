import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Producto from './pages/Producto'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import MisPedidos from './pages/MisPedidos'
import Terminos from './pages/Terminos'
import MiCuenta from './pages/MiCuenta'

// ── Ícono WhatsApp SVG reutilizable ──────────────────────
const WhatsAppIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ── Botón flotante WhatsApp ───────────────────────────────
function WhatsAppFlotante() {
  const numero  = '916312463'
  const mensaje = encodeURIComponent('¡Hola! Quisiera hacer una consulta sobre sus productos 🔧')

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
      {/* Etiqueta */}
      <div style={{ background: '#1A1A2E', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        💬 ¿Necesitas ayuda?
      </div>

      {/* Botón principal */}
      <a href={`https://wa.me/${numero}?text=${mensaje}`}
        target="_blank" rel="noopener noreferrer"
        title="Chatea con nosotros por WhatsApp"
        style={{ width: '58px', height: '58px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,211,102,0.5)', textDecoration: 'none', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        <WhatsAppIcon size={30} />
      </a>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
  const numero  = '916312463'
  const mensaje = encodeURIComponent('¡Hola! Quisiera hacer una consulta 🔧')

  return (
    <footer style={{ background: '#1A1A2E', color: '#9CA3AF', padding: '3rem 0 1.5rem', marginTop: '4rem' }}>
      <div className="contenedor">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

          {/* Columna 1 — Marca */}
          <div>
            <h3 style={{ color: 'white', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              FERRETERÍA SALCEDO
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Tu ferretería de confianza en Lima. Más de 20 años sirviendo a la comunidad.
            </p>
            {/* Redes sociales */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <a 
  href="https://wa.me/c/51916312463" 
  target="_blank" 
  rel="noopener noreferrer"
  title="Ver catálogo en WhatsApp"
  style={{ width: '36px', height: '36px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
  <WhatsAppIcon size={18} />
</a>
              <a href="https://www.facebook.com/profile.php?id=61572620540928" target="_blank" rel="noopener noreferrer"
                title="Facebook"
                style={{ width: '36px', height: '36px', background: '#1877F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                title="Instagram"
                style={{ width: '36px', height: '36px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@ferreteria.salcedo?_r=1&_t=ZS-98blp4YPB3A" target="_blank" rel="noopener noreferrer"
                title="TikTok"
                style={{ width: '36px', height: '36px', background: '#010101', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 — Contacto */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Contacto</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>📍 Jr. Los Artesanos 245, Lima</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>📞 916-312-463</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>✉️ ventas@ferrreteriasalcedo.com</p>
            <a href={`https://wa.me/${numero}?text=${mensaje}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#25D366', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              <WhatsAppIcon size={16} /> Escríbenos al WhatsApp
            </a>
          </div>

          {/* Columna 3 — Horario */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Horario</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>Lunes a Sábado: 8am - 7pm</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>Domingo: 9am - 2pm</p>
            <p style={{ fontSize: '0.9rem', color: '#FFB703', fontWeight: 600, marginTop: '0.8rem' }}>🚚 Delivery mismo día en Lima</p>
          </div>

          {/* Columna 4 — Pagos y políticas */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Pagos aceptados</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}> Yape</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}> Efectivo</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}> Transferencia bancaria</p>

            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.7rem' }}>Información</h4>
            <a href="/terminos" style={{ display: 'block', color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '0.3rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#FFB703'}
              onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
              Términos y Condiciones
            </a>
            <a href="/terminos" style={{ display: 'block', color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '0.3rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#FFB703'}
              onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
              Política de Privacidad
            </a>
            <a href="/terminos" style={{ display: 'block', color: '#9CA3AF', fontSize: '0.88rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#FFB703'}
              onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
              Política de Envíos y Devoluciones
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span>© 2025 Ferretería Salcedo. Todos los derechos reservados.</span>
          <span style={{ color: '#6B7280' }}>Hecho con ❤️ en Lima, Perú 🇵🇪</span>
        </div>
      </div>
    </footer>
  )
}

// ── App principal ─────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <Toaster position="top-right" />
          <Navbar />
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/productos"    element={<Productos />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/checkout"     element={<Checkout />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/mis-pedidos"  element={<MisPedidos />} />
            <Route path="/terminos"     element={<Terminos />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
          </Routes>
          <Footer />
          <WhatsAppFlotante />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}