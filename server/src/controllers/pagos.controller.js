const prisma  = require('../prisma')
const { cloudinary } = require('../lib/cloudinary')

const demoPagosActivo = () =>
  process.env.PAYMENT_DEMO_MODE === 'true' ||
  (process.env.NODE_ENV !== 'production' && !process.env.MERCADOPAGO_ACCESS_TOKEN)

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

// Crea una preferencia de Mercado Pago cuando existe una credencial de pruebas.
// Nunca se reciben ni almacenan datos de tarjeta en esta aplicación.
const crearPreferenciaMercadoPago = async (req, res) => {
  try {
    const pedidoId = parseInt(req.params.pedidoId)
    const pedido = await prisma.pedido.findFirst({
      where: { id: pedidoId, usuarioId: req.usuario.id },
      include: { detalles: { include: { producto: true } }, pago: true }
    })
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' })
    if (pedido.pago?.metodo !== 'MERCADOPAGO') return res.status(400).json({ error: 'El pedido no usa Mercado Pago' })

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token && demoPagosActivo()) {
      return res.json({
        modo: 'DEMO',
        mensaje: 'Modo demostración activo. No se realizará ningún cobro real.'
      })
    }
    if (!token) return res.status(503).json({ error: 'Configura Mercado Pago de pruebas o habilita PAYMENT_DEMO_MODE=true' })

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const respuesta = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: pedido.detalles.map(d => ({
          title: d.producto.nombre,
          quantity: d.cantidad,
          currency_id: 'PEN',
          unit_price: Number(d.precioUnit)
        })),
        external_reference: String(pedido.id),
        back_urls: {
          success: `${baseUrl}/mis-pedidos?payment=success`,
          failure: `${baseUrl}/mis-pedidos?payment=failure`,
          pending: `${baseUrl}/mis-pedidos?payment=pending`
        },
        auto_return: 'approved'
      })
    })
    const data = await respuesta.json()
    if (!respuesta.ok) {
      console.error('Mercado Pago:', data)
      return res.status(502).json({ error: 'No se pudo iniciar el checkout de pruebas' })
    }
    res.json({ modo: 'MERCADOPAGO', initPoint: data.sandbox_init_point || data.init_point })
  } catch (error) {
    console.error('Error Mercado Pago:', error.message)
    res.status(500).json({ error: 'Error al iniciar Mercado Pago' })
  }
}

// Solo para demostración académica/local. Debe desactivarse en producción.
const simularPago = async (req, res) => {
  try {
    if (!demoPagosActivo()) {
      return res.status(403).json({ error: 'La simulación de pagos está desactivada' })
    }
    const pedidoId = parseInt(req.params.pedidoId)
    const { resultado } = req.body
    if (!['APROBADO', 'RECHAZADO', 'PENDIENTE'].includes(resultado)) {
      return res.status(400).json({ error: 'Resultado de simulación inválido' })
    }
    const pedido = await prisma.pedido.findFirst({ where: { id: pedidoId, usuarioId: req.usuario.id }, include: { pago: true } })
    if (!pedido || pedido.pago?.metodo !== 'MERCADOPAGO') return res.status(404).json({ error: 'Pago de demostración no encontrado' })

    const estadoPago = resultado === 'APROBADO' ? 'VERIFICADO' : resultado === 'RECHAZADO' ? 'RECHAZADO' : 'PENDIENTE'
    const estadoPedido = resultado === 'APROBADO' ? 'PAGO_VERIFICADO' : resultado === 'RECHAZADO' ? 'CANCELADO' : 'PENDIENTE'
    await prisma.$transaction([
      prisma.pago.update({ where: { pedidoId }, data: { estado: estadoPago, codigoOp: `DEMO-${resultado}`, notas: 'Pago simulado; no hubo cobro real.', verificadoEn: resultado === 'APROBADO' ? new Date() : null } }),
      prisma.pedido.update({ where: { id: pedidoId }, data: { estado: estadoPedido } })
    ])
    res.json({ mensaje: `Simulación ${resultado.toLowerCase()} registrada`, resultado })
  } catch (error) {
    console.error('Error simulación pago:', error.message)
    res.status(500).json({ error: 'Error al simular el pago' })
  }
}

module.exports = { subirComprobante, crearPreferenciaMercadoPago, simularPago }
