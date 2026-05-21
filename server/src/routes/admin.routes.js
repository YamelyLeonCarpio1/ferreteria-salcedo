const router = require('express').Router()
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware')
const {
  getDashboard, getPedidos, updatePedido,
  getProductos, crearProducto, updateProducto, eliminarProducto,
  verificarPago
} = require('../controllers/admin.controller')

router.use(verificarToken, verificarAdmin)

router.get('/dashboard',           getDashboard)
router.get('/pedidos',             getPedidos)
router.put('/pedidos/:id',         updatePedido)
router.post('/pedidos/:id/pago',   verificarPago)
router.get('/productos',           getProductos)
router.post('/productos',          crearProducto)
router.put('/productos/:id',       updateProducto)
router.delete('/productos/:id',    eliminarProducto)

module.exports = router