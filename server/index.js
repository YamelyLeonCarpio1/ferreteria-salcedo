const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL,
      'http://localhost:5173',
      'http://localhost:5174'
    ]
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/auth',       require('./src/routes/auth.routes'))
app.use('/api/productos',  require('./src/routes/productos.routes'))
app.use('/api/categorias', require('./src/routes/categorias.routes'))
app.use('/api/pedidos',    require('./src/routes/pedidos.routes'))
app.use('/api/pagos',      require('./src/routes/pagos.routes'))
app.use('/api/admin',      require('./src/routes/admin.routes'))

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🔧 API Ferretería Salcedo funcionando' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
})