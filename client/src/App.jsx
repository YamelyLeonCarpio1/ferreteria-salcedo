import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CarritoProvider } from './context/CarritoContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import MisPedidos from './pages/MisPedidos'
import Producto from './pages/Producto'

function Footer() {
  return (
    <footer style={{ background: '#1A1A2E', color: '#9CA3AF', padding: '3rem 0 1.5rem', marginTop: '4rem' }}>
      <div className="contenedor">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: 'white', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>FERRETERÍA SALCEDO</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Tu ferretería de confianza en Lima. Más de 20 años sirviendo a la comunidad.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Contacto</h4>
            <p style={{ fontSize: '0.9rem' }}>📍 Jr. Los Artesanos 245, Lima</p>
            <p style={{ fontSize: '0.9rem' }}>📞 987-654-321</p>
            <p style={{ fontSize: '0.9rem' }}>✉️ ventas@ferrreteriasalcedo.com</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Horario</h4>
            <p style={{ fontSize: '0.9rem' }}>Lunes a Sábado: 8am - 7pm</p>
            <p style={{ fontSize: '0.9rem' }}>Domingo: 9am - 2pm</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem' }}>Pagos aceptados</h4>
            <p style={{ fontSize: '0.9rem' }}>💜 Yape</p>
            <p style={{ fontSize: '0.9rem' }}>💵 Efectivo</p>
            <p style={{ fontSize: '0.9rem' }}>🏦 Transferencia bancaria</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          © 2024 Ferretería Salcedo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <Toaster position="top-right" />
          <Navbar />
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/productos"   element={<Productos />} />
            <Route path="/checkout"    element={<Checkout />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/producto/:id" element={<Producto />} />
          </Routes>
          <Footer />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}