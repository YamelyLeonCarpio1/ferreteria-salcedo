const prisma = require('../prisma')

const getProductos = async (req, res) => {
  try {
    const { buscar, categoriaId, orden, pagina = 1, limite = 12 } = req.query
    const skip = (pagina - 1) * limite

    const where = { activo: true }
    if (buscar) {
      where.nombre = { contains: buscar, mode: 'insensitive' }
    }
    if (categoriaId) {
      where.categoriaId = parseInt(categoriaId)
    }

    let orderBy = { creadoEn: 'desc' }
    if (orden === 'precio_asc')  orderBy = { precio: 'asc' }
    if (orden === 'precio_desc') orderBy = { precio: 'desc' }
    if (orden === 'nombre')      orderBy = { nombre: 'asc' }

    const [productos, total] = await prisma.$transaction([
      prisma.producto.findMany({
        where, orderBy,
        skip: parseInt(skip),
        take: parseInt(limite),
        include: { categoria: { select: { nombre: true } } }
      }),
      prisma.producto.count({ where })
    ])

    res.json({
      productos,
      total,
      paginas: Math.ceil(total / limite),
      paginaActual: parseInt(pagina)
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

const getProducto = async (req, res) => {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        categoria: true,
        resenas: {
          include: {
            usuario: { select: { nombre: true, apellido: true } }
          }
        }
      }
    })
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(producto)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' })
  }
}

const getDestacados = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: { activo: true, destacado: true },
      take: 8,
      include: { categoria: { select: { nombre: true } } }
    })
    res.json(productos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destacados' })
  }
}

const getProductosPorCategoria = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        categoriaId: parseInt(req.params.categoriaId)
      },
      include: { categoria: { select: { nombre: true } } }
    })
    res.json(productos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}

module.exports = { getProductos, getProducto, getDestacados, getProductosPorCategoria }