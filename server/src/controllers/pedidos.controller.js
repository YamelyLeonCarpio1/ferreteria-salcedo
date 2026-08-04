const prisma = require('../prisma')
const { enviarConfirmacionPedido } = require('../services/email.service')

const crearPedido = async (req, res) => {
  try {
    const { items, direccionId, tipoEntrega, notas, metodoPago } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' })
    }

    // Verificar stock y calcular total
    let total = 0
    const detalles = []

    for (const item of items) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId }
      })

      if (!producto) {
        return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` })
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` })
      }

      const precioFinal = producto.precioOferta || producto.precio
      const subtotal = precioFinal * item.cantidad
      total += subtotal

      detalles.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnit: precioFinal,
        subtotal
      })
    }

    // Crear pedido con transacción
    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          usuarioId: req.usuario.id,
          direccionId: direccionId || null,
          total,
          tipoEntrega: tipoEntrega || 'DELIVERY',
          notas,
          detalles: { create: detalles },
          pago: {
            create: {
              metodo: metodoPago || 'YAPE',
              estado: 'PENDIENTE',
              monto: total
            }
          }
        },
        include: { detalles: true, pago: true }
      })

      // Descontar stock
      for (const item of items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: { stock: { decrement: item.cantidad } }
        })
      }

      return nuevoPedido
    })

    // Consultar el pedido completo con relaciones para el envío del correo
    const pedidoCompleto = await prisma.pedido.findUnique({
      where: { id: pedido.id },
      include: {
        usuario: true,
        detalles: { include: { producto: true } },
        pago: true
      }
    })

    if (pedidoCompleto?.usuario?.email) {
      enviarConfirmacionPedido(pedidoCompleto.usuario.email, pedidoCompleto.usuario.nombre, pedidoCompleto)
        .catch(err => console.error('Error enviando email pedido:', err))
    }

    res.status(201).json(pedido)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear pedido' })
  }
}

const getMisPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { usuarioId: req.usuario.id },
      include: {
        detalles: { include: { producto: true } },
        pago: true
      },
      orderBy: { creadoEn: 'desc' }
    })
    res.json(pedidos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}

const getPedido = async (req, res) => {
  try {
    const pedido = await prisma.pedido.findFirst({
      where: { id: parseInt(req.params.id), usuarioId: req.usuario.id },
      include: {
        detalles: { include: { producto: true } },
        pago: true,
        direccion: true
      }
    })
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' })
    res.json(pedido)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedido' })
  }
}

module.exports = { crearPedido, getMisPedidos, getPedido }