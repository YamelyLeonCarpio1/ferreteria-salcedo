const prisma  = require('../prisma')
const { cloudinary } = require('../lib/cloudinary')

const subirComprobante = async (req, res) => {
  try {
    const { pedidoId } = req.params
    const { codigoOp } = req.body

    let comprobanteUrl = null

    // Si hay imagen, subirla a Cloudinary
    if (req.file) {
      const resultado = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'ferreteria-salcedo/comprobantes' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })
      comprobanteUrl = resultado.secure_url
    }

    const pago = await prisma.pago.update({
      where: { pedidoId: parseInt(pedidoId) },
      data: {
        codigoOp:       codigoOp    || null,
        comprobanteUrl: comprobanteUrl || null,
        estado:         'PENDIENTE'
      }
    })

    res.json({ mensaje: 'Comprobante registrado, pendiente de verificación', pago })
  } catch (error) {
    console.error('❌ Error subirComprobante:', error.message)
    res.status(500).json({ error: 'Error al subir comprobante' })
  }
}

module.exports = { subirComprobante }