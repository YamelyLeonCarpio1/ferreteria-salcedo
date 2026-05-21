const router = require('express').Router()
const { subirComprobante } = require('../controllers/pagos.controller')
const { verificarToken } = require('../middleware/auth.middleware')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/comprobante/:pedidoId', verificarToken, upload.single('comprobante'), subirComprobante)

module.exports = router