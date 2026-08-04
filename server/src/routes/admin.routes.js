const router = require('express').Router()
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware')
const {
  getDashboard, getPedidos, updatePedido,
  getProductos, crearProducto, updateProducto, eliminarProducto,
  verificarPago, getClientes
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
router.get('/clientes', getClientes)


const { upload, cloudinary } = require('../lib/cloudinary')

// POST /api/admin/upload-imagen — subir una imagen
router.post('/upload-imagen', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' })
    res.json({ url: req.file.path })
  } catch (error) {
    res.status(500).json({ error: 'Error al subir imagen' })
  }
})

// DELETE /api/admin/delete-imagen — eliminar imagen de Cloudinary
router.delete('/delete-imagen', async (req, res) => {
  try {
    const { publicId } = req.body
    await cloudinary.uploader.destroy(publicId)
    res.json({ mensaje: 'Imagen eliminada' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar imagen' })
  }
})
module.exports = router