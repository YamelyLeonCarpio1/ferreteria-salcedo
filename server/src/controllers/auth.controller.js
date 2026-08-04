const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const crypto  = require('crypto')
const prisma  = require('../prisma')
const {
  enviarCodigoVerificacion,
  enviarBienvenida,
  enviarConfirmacionPedido
} = require('../services/email.service')

const generarToken = (usuario) => jwt.sign(
  { id: usuario.id, email: usuario.email, rol: usuario.rol },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
)

const generarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString()

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body
    if (!nombre || !apellido || !email || !password)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })

    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const codigo = generarCodigo()
    const expiracion = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    await prisma.usuario.create({
      data: {
        nombre, apellido, email,
        password: hashedPassword,
        telefono,
        verificado: false,
        codigoVerif: codigo,
        codigoVerifExp: expiracion
      }
    })

    await enviarCodigoVerificacion(email, nombre, codigo)

    res.status(201).json({
      mensaje: 'Cuenta creada. Revisa tu correo para obtener el código de verificación.',
      email,
      requiereVerificacion: true
    })
  } catch (error) {
    console.error('Error register:', error)
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

// POST /api/auth/verificar
const verificarCodigo = async (req, res) => {
  try {
    const { email, codigo } = req.body

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
    if (usuario.verificado) return res.status(400).json({ error: 'La cuenta ya está verificada' })
    if (usuario.codigoVerif !== codigo) return res.status(400).json({ error: 'Código incorrecto' })
    if (new Date() > usuario.codigoVerifExp) return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' })

    await prisma.usuario.update({
      where: { email },
      data: { verificado: true, codigoVerif: null, codigoVerifExp: null }
    })

    await enviarBienvenida(email, usuario.nombre)

    const token = generarToken(usuario)
    res.json({
      mensaje: '¡Cuenta verificada exitosamente!',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, rol: usuario.rol }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar código' })
  }
}

// POST /api/auth/reenviar-codigo
const reenviarCodigo = async (req, res) => {
  try {
    const { email } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
    if (usuario.verificado) return res.status(400).json({ error: 'La cuenta ya está verificada' })

    const codigo = generarCodigo()
    const expiracion = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.usuario.update({
      where: { email },
      data: { codigoVerif: codigo, codigoVerifExp: expiracion }
    })

    await enviarCodigoVerificacion(email, usuario.nombre, codigo)
    res.json({ mensaje: 'Código reenviado a tu correo' })
  } catch (error) {
    res.status(500).json({ error: 'Error al reenviar código' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const passwordValido = await bcrypt.compare(password, usuario.password)
    if (!passwordValido) return res.status(401).json({ error: 'Credenciales incorrectas' })
    if (!usuario.activo) return res.status(401).json({ error: 'Cuenta desactivada' })

    // Si no está verificado, pedir verificación
    if (!usuario.verificado) {
      return res.status(403).json({
        error: 'Cuenta no verificada',
        requiereVerificacion: true,
        email: usuario.email
      })
    }

    const token = generarToken(usuario)
    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, rol: usuario.rol }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

// GET /api/auth/perfil
const perfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id:true, nombre:true, apellido:true, email:true, telefono:true, rol:true, creadoEn:true, direcciones:true }
    })
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body
    const usuario = await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { nombre, apellido, telefono }
    })
    res.json({ mensaje: 'Perfil actualizado', usuario })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' })
  }
}

const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id } })
    const valido = await bcrypt.compare(passwordActual, usuario.password)
    if (!valido) return res.status(400).json({ error: 'La contraseña actual es incorrecta' })
    const hash = await bcrypt.hash(passwordNueva, 10)
    await prisma.usuario.update({ where: { id: req.usuario.id }, data: { password: hash } })
    res.json({ mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}

const eliminarCuenta = async (req, res) => {
  try {
    const { password } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id } })
    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' })

    // Verificar que no tenga pedidos activos
    const pedidosActivos = await prisma.pedido.count({
      where: {
        usuarioId: req.usuario.id,
        estado: { in: ['PENDIENTE', 'PAGO_VERIFICADO', 'EN_PREPARACION', 'ENVIADO'] }
      }
    })
    if (pedidosActivos > 0)
      return res.status(400).json({ error: `Tienes ${pedidosActivos} pedido(s) activo(s). Espera a que se completen antes de eliminar tu cuenta.` })

    // Desactivar cuenta (no eliminar físicamente para mantener historial)
    await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { activo: false, email: `eliminado_${Date.now()}_${usuario.email}` }
    })

    res.json({ mensaje: 'Cuenta eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cuenta' })
  }
}

const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    // Por seguridad, siempre respondemos igual aunque no exista el email
    if (!usuario || !usuario.activo) {
      return res.json({ mensaje: 'Si el email existe, recibirás instrucciones en tu correo.' })
    }

    const codigo = generarCodigo()
    const expiracion = new Date(Date.now() + 15 * 60 * 1000) // 15 min

    await prisma.usuario.update({
      where: { email },
      data: { codigoVerif: codigo, codigoVerifExp: expiracion }
    })

    // Enviar email con código
    const { enviarRecuperacionPassword } = require('../services/email.service')
    await enviarRecuperacionPassword(email, usuario.nombre, codigo)

    res.json({ mensaje: 'Si el email existe, recibirás instrucciones en tu correo.' })
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar solicitud' })
  }
}

const resetearPassword = async (req, res) => {
  try {
    const { email, codigo, passwordNueva } = req.body
    if (!passwordNueva || passwordNueva.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
    if (usuario.codigoVerif !== codigo) return res.status(400).json({ error: 'Código incorrecto' })
    if (new Date() > usuario.codigoVerifExp) return res.status(400).json({ error: 'El código ha expirado' })

    const hash = await bcrypt.hash(passwordNueva, 10)
    await prisma.usuario.update({
      where: { email },
      data: { password: hash, codigoVerif: null, codigoVerifExp: null }
    })

    res.json({ mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al resetear contraseña' })
  }
}

module.exports = {
  register, login, perfil, verificarCodigo, reenviarCodigo,
  actualizarPerfil, cambiarPassword, eliminarCuenta,
  solicitarRecuperacion, resetearPassword
}