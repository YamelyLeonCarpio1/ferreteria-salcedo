// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Sembrando datos...')

  // Crear admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@ferrreteriasalcedo.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'Salcedo',
      email: 'admin@ferrreteriasalcedo.com',
      password: adminPassword,
      rol: 'ADMIN',
    },
  })

  // Crear categorías
  const categorias = [
    { nombre: 'Cerraduras y Candados', descripcion: 'Seguridad para tu hogar' },
    { nombre: 'Herramientas Manuales', descripcion: 'Martillos, destornilladores y más' },
    { nombre: 'Pinturas y Accesorios', descripcion: 'Todo para pintar' },
    { nombre: 'Electricidad', descripcion: 'Cables, enchufes, interruptores' },
    { nombre: 'Plomería', descripcion: 'Tuberías, llaves y accesorios' },
    { nombre: 'Fijaciones y Tornillos', descripcion: 'Clavos, tornillos, tacos' },
  ]

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: {},
      create: cat,
    })
  }

  // Crear productos de ejemplo
  const productos = [
    {
      nombre: 'Cerradura Yale Seguridad Alta',
      descripcion: 'Cerradura de alta seguridad con 3 llaves',
      precio: 89.90,
      stock: 25,
      stockMinimo: 5,
      sku: 'YALE-001',
      imagenes: ['https://placehold.co/400x400?text=Cerradura+Yale'],
      categoriaId: 1,
      destacado: true,
    },
    {
      nombre: 'Martillo de Carpintero 16oz',
      descripcion: 'Martillo profesional con mango de fibra de vidrio',
      precio: 35.50,
      stock: 40,
      stockMinimo: 10,
      sku: 'MART-001',
      imagenes: ['https://placehold.co/400x400?text=Martillo'],
      categoriaId: 2,
    },
    {
      nombre: 'Pintura Látex Blanco 4L',
      descripcion: 'Pintura para interiores, lavable, alta cobertura',
      precio: 52.00,
      precioOferta: 45.00,
      stock: 30,
      stockMinimo: 8,
      sku: 'PINT-001',
      imagenes: ['https://placehold.co/400x400?text=Pintura'],
      categoriaId: 3,
      destacado: true,
    },
    {
      nombre: 'Interruptor Simple BTICINO',
      descripcion: 'Interruptor de pared, 10A, color blanco',
      precio: 12.50,
      stock: 100,
      stockMinimo: 20,
      sku: 'ELEC-001',
      imagenes: ['https://placehold.co/400x400?text=Interruptor'],
      categoriaId: 4,
    },
    {
      nombre: 'Llave de Paso 1/2 PVC',
      descripcion: 'Llave de paso para agua fría y caliente',
      precio: 18.00,
      stock: 60,
      stockMinimo: 15,
      sku: 'PLOM-001',
      imagenes: ['https://placehold.co/400x400?text=Llave'],
      categoriaId: 5,
    },
    {
      nombre: 'Tacos Fischer 8mm x 100und',
      descripcion: 'Tacos de expansión para concreto y ladrillo',
      precio: 15.90,
      stock: 200,
      stockMinimo: 50,
      sku: 'FIJ-001',
      imagenes: ['https://placehold.co/400x400?text=Tacos'],
      categoriaId: 6,
    },
  ]

  for (const prod of productos) {
    await prisma.producto.upsert({
      where: { sku: prod.sku },
      update: {},
      create: prod,
    })
  }

  console.log('✅ Datos sembrados correctamente')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())