const jwt = require('jsonwebtoken')
const prisma = require('../prisma')

const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    })

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Usuario no válido' })
    }

    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso solo para administradores' })
  }
  next()
}

module.exports = { verificarToken, verificarAdmin }