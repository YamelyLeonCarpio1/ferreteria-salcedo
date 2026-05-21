const router = require('express').Router()
const { register, login, perfil } = require('../controllers/auth.controller')
const { verificarToken } = require('../middleware/auth.middleware')

router.post('/register', register)
router.post('/login',    login)
router.get('/perfil',    verificarToken, perfil)

module.exports = router