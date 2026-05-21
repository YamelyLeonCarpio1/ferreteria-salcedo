const router = require('express').Router()
const prisma = require('../prisma')

router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { activo: true },
      include: { _count: { select: { productos: true } } }
    })
    res.json(categorias)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
})

module.exports = router