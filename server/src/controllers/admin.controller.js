const prisma = require('../prisma')

const getDashboard = async (req, res) => {
  try {
    const [
      totalPedidos, pedidosPendientes, totalProductos,
      totalClientes, productosBajoStock
    ] = await prisma.$transaction([
      prisma.pedido.count(),
      prisma.pedido.count({ where: { estado: 'PENDIENTE' } }),
      prisma.producto.count({ where: { activo: true } }),
      prisma.usuario.count({ where: { rol: 'CLIENTE' } }),
      prisma.producto.findMany({
        where: { stock: { lte: prisma.producto.fields.stockMinimo } },
        take: 5
      })
    ])

    const ventasHoy = await prisma.pedido.aggregate({
      where: {
        estado: { not: 'CANCELADO' },
        creadoEn: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      },
      _sum: { total: true }
    })

    const pagosPendientes = await prisma.pago.count({
      where: { estado: 'PENDIENTE' }
    })

    res.json({
      totalPedidos,
      pedidosPendientes,
      totalProductos,
      totalClientes,
      ventasHoy: ventasHoy._sum.total || 0,
      pagosPendientes,
      productosBajoStock
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard' })
  }
}

const getPedidos = async (req, res) => {
  try {
    const { estado, pagina = 1, limite = 20 } = req.query
    const where = estado ? { estado } : {}

    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        usuario: { select: { nombre: true, apellido: true, email: true } },
        detalles: { include: { producto: { select: { nombre: true } } } },
        pago: true
      },
      orderBy: { creadoEn: 'desc' },
      skip: (pagina - 1) * limite,
      take: parseInt(limite)
    })
    res.json(pedidos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}

const updatePedido = async (req, res) => {
  try {
    const { estado } = req.body
    const pedido = await prisma.pedido.update({
      where: { id: parseInt(req.params.id) },
      data: { estado }
    })
    res.json(pedido)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' })
  }
}

const verificarPago = async (req, res) => {
  try {
    const { accion, notas } = req.body // accion: 'VERIFICAR' o 'RECHAZAR'
    const pedidoId = parseInt(req.params.id)

    const estadoPago  = accion === 'VERIFICAR' ? 'VERIFICADO' : 'RECHAZADO'
    const estadoPedido = accion === 'VERIFICAR' ? 'PAGO_VERIFICADO' : 'CANCELADO'

    await prisma.$transaction([
      prisma.pago.update({
        where: { pedidoId },
        data: {
          estado: estadoPago,
          notas,
          verificadoEn: new Date(),
          verificadoPor: req.usuario.id
        }
      }),
      prisma.pedido.update({
        where: { id: pedidoId },
        data: { estado: estadoPedido }
      })
    ])

    res.json({ mensaje: `Pago ${estadoPago.toLowerCase()} correctamente` })
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar pago' })
  }
}

const getProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { creadoEn: 'desc' }
    })
    res.json(productos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, precioOferta, stock, stockMinimo, sku, categoriaId, destacado } = req.body
    const producto = await prisma.producto.create({
      data: {
        nombre, descripcion, precio: parseFloat(precio),
        precioOferta: precioOferta ? parseFloat(precioOferta) : null,
        stock: parseInt(stock), stockMinimo: parseInt(stockMinimo || 5),
        sku, categoriaId: parseInt(categoriaId),
        destacado: destacado || false,
        imagenes: []
      }
    })
    res.status(201).json(producto)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' })
  }
}

const updateProducto = async (req, res) => {
  try {
    const data = { ...req.body }
    if (data.precio)      data.precio      = parseFloat(data.precio)
    if (data.precioOferta) data.precioOferta = parseFloat(data.precioOferta)
    if (data.stock)       data.stock       = parseInt(data.stock)
    if (data.categoriaId) data.categoriaId = parseInt(data.categoriaId)

    const producto = await prisma.producto.update({
      where: { id: parseInt(req.params.id) },
      data
    })
    res.json(producto)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' })
  }
}

const eliminarProducto = async (req, res) => {
  try {
    await prisma.producto.update({
      where: { id: parseInt(req.params.id) },
      data: { activo: false }
    })
    res.json({ mensaje: 'Producto desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
}

module.exports = {
  getDashboard, getPedidos, updatePedido, verificarPago,
  getProductos, crearProducto, updateProducto, eliminarProducto
}