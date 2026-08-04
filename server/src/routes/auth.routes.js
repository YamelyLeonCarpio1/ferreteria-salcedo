const router = require('express').Router()
const { 
   register, login, perfil, verificarCodigo, reenviarCodigo,
  actualizarPerfil, cambiarPassword, eliminarCuenta,
  solicitarRecuperacion, resetearPassword
} = require('../controllers/auth.controller')
const { verificarToken } = require('../middleware/auth.middleware')

router.post('/register',         register)
router.post('/verificar',        verificarCodigo)
router.post('/reenviar-codigo',  reenviarCodigo)
router.post('/login',            login)
router.get('/perfil',            verificarToken, perfil)
router.put('/perfil',            verificarToken, actualizarPerfil)
router.put('/cambiar-password',  verificarToken, cambiarPassword)
router.delete('/cuenta', verificarToken, eliminarCuenta)

router.post('/recuperar-password',  solicitarRecuperacion)
router.post('/resetear-password',   resetearPassword)

module.exports = router