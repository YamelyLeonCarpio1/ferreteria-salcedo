const prisma = require('../prisma')

const subirComprobante = async (req, res) => {
  try {
    const { pedidoId } = req.params
    const { codigoOp } = req.body

    // Por ahora guardamos el código de operación
    // Cloudinary se integrará en el paso de deploy
    const pago = await prisma.pago.update({
      where: { pedidoId: parseInt(pedidoId) },
      data: {
        codigoOp: codigoOp || null,
        estado: 'PENDIENTE'
      }
    })

    res.json({ mensaje: 'Comprobante registrado, pendiente de verificación', pago })
  } catch (error) {
    res.status(500).json({ error: 'Error al subir comprobante' })
  }
}

module.exports = { subirComprobante }