const router = require('express').Router()
const { subirComprobante, crearPreferenciaMercadoPago, simularPago } = require('../controllers/pagos.controller')
const { verificarToken } = require('../middleware/auth.middleware')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/comprobante/:pedidoId', verificarToken, upload.single('comprobante'), subirComprobante)
router.post('/mercadopago/preferencia/:pedidoId', verificarToken, crearPreferenciaMercadoPago)
router.post('/mercadopago/simular/:pedidoId', verificarToken, simularPago)

module.exports = router
