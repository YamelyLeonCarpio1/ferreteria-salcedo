const router = require('express').Router()
const {
  getProductos, getProducto, getDestacados, getProductosPorCategoria
} = require('../controllers/productos.controller')

router.get('/',                     getProductos)
router.get('/destacados',           getDestacados)
router.get('/categoria/:categoriaId', getProductosPorCategoria)
router.get('/:id',                  getProducto)

module.exports = router