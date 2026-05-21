const router = require('express').Router()
const { crearPedido, getMisPedidos, getPedido } = require('../controllers/pedidos.controller')
const { verificarToken } = require('../middleware/auth.middleware')

router.post('/',     verificarToken, crearPedido)
router.get('/mios',  verificarToken, getMisPedidos)
router.get('/:id',   verificarToken, getPedido)

module.exports = router