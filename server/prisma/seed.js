// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando datos...')

  // ─── ADMIN ───────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.usuario.upsert({
  where:  { email: 'admin@ferrreteriasalcedo.com' },
  update: {},
  create: {
    nombre:     'Admin',
    apellido:   'Salcedo',
    email:      'admin@ferrreteriasalcedo.com',
    password:   adminPassword,
    rol:        'ADMIN',
    verificado: true  // ← agregar esta línea
  }
})

  // ─── CATEGORÍAS ──────────────────────────────────────────
  const cats = [
    { id: 1, nombre: 'Cerraduras y Candados',   descripcion: 'Seguridad para puertas, rejas y más' },
    { id: 2, nombre: 'Herramientas Manuales',   descripcion: 'Martillos, destornilladores, alicates y más' },
    { id: 3, nombre: 'Herramientas Eléctricas', descripcion: 'Taladros, amoladoras, sierras' },
    { id: 4, nombre: 'Pinturas y Accesorios',   descripcion: 'Pinturas, brochas, rodillos y diluyentes' },
    { id: 5, nombre: 'Electricidad',            descripcion: 'Cables, interruptores, tomacorrientes' },
    { id: 6, nombre: 'Plomería',                descripcion: 'Tuberías, llaves de paso, pegamentos' },
    { id: 7, nombre: 'Fijaciones y Tornillos',  descripcion: 'Tacos, tornillos, clavos, anclajes' },
    { id: 8, nombre: 'Construcción',            descripcion: 'Cemento, yeso, porcelana, fragua' },
  ]

  for (const c of cats) {
    await prisma.categoria.upsert({
      where:  { nombre: c.nombre },
      update: {},
      create: c
    })
  }

  // ─── PRODUCTOS ───────────────────────────────────────────
  // Imágenes: URLs reales de productos de ferretería de Promart / Sodimac Perú
  const productos = [

    // ── CERRADURAS Y CANDADOS ──
    {
      nombre: 'Cerradura Yale Seguridad Alta 3 Llaves',
      descripcion: 'Cerradura de sobreponer de alta seguridad, con 3 llaves y acabado niquelado. Ideal para puertas de madera y metal.',
      precio: 89.90, stock: 25, stockMinimo: 5, sku: 'YALE-001', categoriaId: 1, destacado: true,
      imagenes: ['https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg',
                 'https://promart.vteximg.com.br/arquivos/ids/6363810-1000-1000/image-94b7d1cbc78b4c05a8a5ee5516f0f12a.jpg']
    },
    {
      nombre: 'Candado Forte 50mm con Llave',
      descripcion: 'Candado de acero inoxidable resistente al corte, arco de 10mm. Uso interior y exterior.',
      precio: 32.50, stock: 40, stockMinimo: 8, sku: 'FORTE-001', categoriaId: 1,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/5186006_01']
    },
    {
      nombre: 'Cerradura de Embutir CISA 3 Golpes',
      descripcion: 'Cerradura embutida italiana, 3 golpes, reversible, para puertas de 40-80mm de espesor.',
      precio: 145.00, precioOferta: 128.00, stock: 15, stockMinimo: 4, sku: 'CISA-001', categoriaId: 1, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4623507_01']
    },
    {
      nombre: 'Candado Corto Bronce 40mm Forte',
      descripcion: 'Candado de bronce resistente a la corrosión, ideal para uso en exterior y zonas húmedas.',
      precio: 18.90, stock: 60, stockMinimo: 10, sku: 'FORTE-002', categoriaId: 1,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2117819_01']
    },
    {
      nombre: 'Cerrojo de Sobreponer Yale Negro',
      descripcion: 'Cerrojo de barra plana, acabado negro mate, para puertas de madera. Fácil instalación.',
      precio: 24.90, stock: 35, stockMinimo: 8, sku: 'YALE-002', categoriaId: 1,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1047684_01']
    },
    {
      nombre: 'Cerradura Digital Smart Touch Yale',
      descripcion: 'Cerradura digital con teclado táctil, 4-8 dígitos, batería 9V incluida. Sin llave.',
      precio: 289.00, precioOferta: 249.00, stock: 8, stockMinimo: 2, sku: 'YALE-003', categoriaId: 1, destacado: true,
      imagenes: ['https://promart.vteximg.com.br/arquivos/ids/7534521-1000-1000/image-digital-yale.jpg']
    },

    // ── HERRAMIENTAS MANUALES ──
    {
      nombre: 'Martillo de Carpintero 16oz Truper',
      descripcion: 'Martillo profesional con mango de fibra de vidrio antivibración, cabeza de acero al carbono 16 oz.',
      precio: 38.50, stock: 45, stockMinimo: 10, sku: 'TRUP-001', categoriaId: 2, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2080148_01']
    },
    {
      nombre: 'Destornillador Estrella Ph2 x 150mm Kamasa',
      descripcion: 'Destornillador de punta estrella Ph2, mango ergonómico bimateria, punta endurecida.',
      precio: 12.90, stock: 80, stockMinimo: 20, sku: 'KAMA-001', categoriaId: 2,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2057793_01']
    },
    {
      nombre: 'Set 6 Destornilladores Kamasa',
      descripcion: 'Juego de 6 destornilladores: 3 planos y 3 estrellas. Mangos bicolores antideslizantes.',
      precio: 35.90, precioOferta: 29.90, stock: 30, stockMinimo: 8, sku: 'KAMA-002', categoriaId: 2, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/3082596_01']
    },
    {
      nombre: 'Alicate Universal 8" Truper',
      descripcion: 'Alicate universal de 8 pulgadas, acero al cromo-vanadio, mango con aislamiento 1000V.',
      precio: 28.50, stock: 40, stockMinimo: 10, sku: 'TRUP-002', categoriaId: 2,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2080242_01']
    },
    {
      nombre: 'Cinta Métrica 5m Truper',
      descripcion: 'Cinta métrica de 5 metros, carcasa de ABS resistente, freno automático, gancho magnético.',
      precio: 18.50, stock: 60, stockMinimo: 15, sku: 'TRUP-003', categoriaId: 2,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2078881_01']
    },
    {
      nombre: 'Nivel de Aluminio 60cm Kamasa',
      descripcion: 'Nivel de aluminio de 60cm con 3 burbujas (horizontal, vertical e inclinado). Acabado anodizado.',
      precio: 32.00, stock: 25, stockMinimo: 6, sku: 'KAMA-003', categoriaId: 2,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2112648_01']
    },
    {
      nombre: 'Llave de Boca 10" Ajustable Truper',
      descripcion: 'Llave ajustable de 10 pulgadas, acero forjado, apertura máxima 30mm, acabado cromado.',
      precio: 24.90, stock: 35, stockMinimo: 8, sku: 'TRUP-004', categoriaId: 2,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2079980_01']
    },
    {
      nombre: 'Wincha de Albañil 30m Truper',
      descripcion: 'Wincha de nylon resistente con carcasa de ABS y manivela metálica. 30 metros.',
      precio: 45.00, stock: 20, stockMinimo: 5, sku: 'TRUP-005', categoriaId: 2,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2081236_01']
    },

    // ── HERRAMIENTAS ELÉCTRICAS ──
    {
      nombre: 'Taladro Percutor 650W Ingco 13mm',
      descripcion: 'Taladro percutor 650W, portabrocas de 13mm, velocidad variable, función martillo. Incluye estuche.',
      precio: 159.00, precioOferta: 139.00, stock: 18, stockMinimo: 3, sku: 'INGCO-001', categoriaId: 3, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4109853_01']
    },
    {
      nombre: 'Amoladora Angular 4.5" 850W Ingco',
      descripcion: 'Amoladora angular 850W, disco de 4.5 pulgadas, protector ajustable, empuñadura lateral.',
      precio: 129.00, stock: 15, stockMinimo: 3, sku: 'INGCO-002', categoriaId: 3,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4109861_01']
    },
    {
      nombre: 'Atornillador Inalámbrico 12V Ingco',
      descripcion: 'Atornillador inalámbrico 12V, 2 baterías de litio, cargador rápido, 25 posiciones de torque.',
      precio: 189.00, precioOferta: 169.00, stock: 12, stockMinimo: 3, sku: 'INGCO-003', categoriaId: 3, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4109887_01']
    },
    {
      nombre: 'Sierra Caladora 650W Ingco',
      descripcion: 'Sierra caladora 650W, 4 posiciones de péndulo, velocidad variable, corta madera hasta 80mm.',
      precio: 199.00, stock: 8, stockMinimo: 2, sku: 'INGCO-004', categoriaId: 3,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4109895_01']
    },
    {
      nombre: 'Lijadora Orbital 180W Ingco',
      descripcion: 'Lijadora orbital 180W, plato de 93x185mm, velocidad variable, bolsa recolectora de polvo.',
      precio: 145.00, precioOferta: 125.00, stock: 10, stockMinimo: 3, sku: 'INGCO-005', categoriaId: 3,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4109939_01']
    },

    // ── PINTURAS Y ACCESORIOS ──
    {
      nombre: 'Pintura Látex Blanco Humo 4L Vencedor',
      descripcion: 'Pintura para interiores, lavable, alta cobertura. Rinde 40m² por galón a 2 manos. Secado rápido.',
      precio: 54.90, stock: 40, stockMinimo: 8, sku: 'VENC-001', categoriaId: 4, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/3168802_01']
    },
    {
      nombre: 'Pintura Esmalte Negro Brillante 1L Tekno',
      descripcion: 'Esmalte brillante para metal y madera, alta resistencia a la humedad y corrosión. 1 litro.',
      precio: 28.90, stock: 35, stockMinimo: 8, sku: 'TEKN-001', categoriaId: 4,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2117394_01']
    },
    {
      nombre: 'Rodillo Antigoteo 23cm con Bandeja',
      descripcion: 'Rodillo de felpa 23cm con extensión telescópica y bandeja plástica. Para interiores y exteriores.',
      precio: 22.90, stock: 50, stockMinimo: 12, sku: 'ROD-001', categoriaId: 4,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2119256_01']
    },
    {
      nombre: 'Brocha Cerda Natural 4" Pincesa',
      descripcion: 'Brocha profesional de cerda natural mezclada, mango de madera. Ideal para esmaltes y barnices.',
      precio: 14.50, stock: 70, stockMinimo: 15, sku: 'PINC-001', categoriaId: 4,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2101521_01']
    },
    {
      nombre: 'Thinner Acrílico 1L Anypsa',
      descripcion: 'Diluyente acrílico para pinturas de agua, limpieza de herramientas y reducción de viscosidad.',
      precio: 12.90, stock: 60, stockMinimo: 15, sku: 'ANYP-001', categoriaId: 4,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2085648_01']
    },
    {
      nombre: 'Lija al Agua Grano 220 Hoja Norton',
      descripcion: 'Lija al agua de óxido de aluminio, grano 220. Ideal para preparación de superficies y acabados finos.',
      precio: 2.50, stock: 200, stockMinimo: 50, sku: 'NORT-001', categoriaId: 4,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1083416_01']
    },
    {
      nombre: 'Pintura Imprimante Blanco 4L Vencedor',
      descripcion: 'Imprimante sellador para interiores y exteriores, base agua. Sella y prepara la superficie antes de pintar.',
      precio: 39.90, precioOferta: 34.90, stock: 30, stockMinimo: 6, sku: 'VENC-002', categoriaId: 4,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/3168836_01']
    },

    // ── ELECTRICIDAD ──
    {
      nombre: 'Interruptor Simple BTICINO Blanco',
      descripcion: 'Interruptor de pared 10A 250V, color blanco, diseño modular. Incluye placa y bastidor.',
      precio: 12.90, stock: 120, stockMinimo: 25, sku: 'BTIC-001', categoriaId: 5,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1004082_01']
    },
    {
      nombre: 'Tomacorriente Doble con Tierra BTICINO',
      descripcion: 'Tomacorriente doble con puesta a tierra 16A 250V, color blanco. Incluye placa y bastidor.',
      precio: 15.90, stock: 100, stockMinimo: 20, sku: 'BTIC-002', categoriaId: 5,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1004116_01']
    },
    {
      nombre: 'Cable NHX-80 2.5mm² Indeco x 100m',
      descripcion: 'Cable eléctrico NHX-80 de 2.5mm², 100 metros. Para instalaciones domésticas e industriales.',
      precio: 89.00, stock: 20, stockMinimo: 4, sku: 'INDE-001', categoriaId: 5, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4162301_01']
    },
    {
      nombre: 'Tablero Eléctrico 12 Polos Ticino',
      descripcion: 'Tablero de distribución de 12 polos, con puerta opaca, riel DIN y barra de neutros.',
      precio: 68.00, precioOferta: 59.90, stock: 15, stockMinimo: 3, sku: 'TICI-001', categoriaId: 5,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2075232_01']
    },
    {
      nombre: 'Cinta Aislante Temflex 3M 18mm x 20m',
      descripcion: 'Cinta aislante de PVC autoadhesiva, resistente a humedad y temperatura. Pack x 5 unidades.',
      precio: 18.50, stock: 150, stockMinimo: 30, sku: '3M-001', categoriaId: 5,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1013688_01']
    },
    {
      nombre: 'Foco LED 9W E27 Luz Fría Philips',
      descripcion: 'Foco LED 9W equivalente a 60W, luz fría 6500K, casquillo E27, vida útil 15,000 horas.',
      precio: 8.90, stock: 200, stockMinimo: 40, sku: 'PHIL-001', categoriaId: 5,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/3082042_01']
    },

    // ── PLOMERÍA ──
    {
      nombre: 'Llave de Paso PVC 1/2" Nicoll',
      descripcion: 'Llave de paso esférica PVC para agua fría y caliente, conexión roscada 1/2 pulgada.',
      precio: 18.90, stock: 80, stockMinimo: 15, sku: 'NICO-001', categoriaId: 6,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2066792_01']
    },
    {
      nombre: 'Tubo PVC Desagüe 4" x 3m Nicoll',
      descripcion: 'Tubo de PVC para desagüe, diámetro 4 pulgadas, largo 3 metros. Norma NTP.',
      precio: 32.00, stock: 30, stockMinimo: 6, sku: 'NICO-002', categoriaId: 6,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2066876_01']
    },
    {
      nombre: 'Pegamento Cpvc Tangit 125ml',
      descripcion: 'Pegamento para tuberías CPVC y PVC, alta resistencia a presión y temperatura. 125ml.',
      precio: 22.90, stock: 50, stockMinimo: 10, sku: 'TANG-001', categoriaId: 6,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2066818_01']
    },
    {
      nombre: 'Ducha Eléctrica Terma 5500W',
      descripcion: 'Ducha eléctrica 5500W, caudal regulable, temperatura constante. Incluye accesorios de instalación.',
      precio: 89.00, precioOferta: 79.00, stock: 20, stockMinimo: 4, sku: 'TERM-001', categoriaId: 6, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/3196948_01']
    },
    {
      nombre: 'Codo PVC 90° 2" Nicoll x 5und',
      descripcion: 'Codo de PVC a 90 grados de 2 pulgadas, pack de 5 unidades. Para agua fría y desagüe.',
      precio: 12.50, stock: 100, stockMinimo: 20, sku: 'NICO-003', categoriaId: 6,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2068012_01']
    },
    {
      nombre: 'Inodoro One Piece Blanco Trébol',
      descripcion: 'Inodoro one piece con fluxómetro, tanque bajo, doble descarga 3/6L. Color blanco.',
      precio: 389.00, precioOferta: 349.00, stock: 8, stockMinimo: 2, sku: 'TREB-001', categoriaId: 6, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2077198_01']
    },

    // ── FIJACIONES Y TORNILLOS ──
    {
      nombre: 'Tacos Fischer S8 x 100und',
      descripcion: 'Tacos de expansión nylon S8 para concreto, ladrillo y piedra. Caja de 100 unidades.',
      precio: 15.90, stock: 200, stockMinimo: 40, sku: 'FISC-001', categoriaId: 7,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1066684_01']
    },
    {
      nombre: 'Tornillo Autorroscante 8x1" Spax x 100und',
      descripcion: 'Tornillo autorroscante para madera, punta aguda, cabeza Phillips, zincado. Caja 100 und.',
      precio: 12.90, stock: 300, stockMinimo: 60, sku: 'SPAX-001', categoriaId: 7,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/4101280_01']
    },
    {
      nombre: 'Clavo de Acero 2.5" x 1kg Prodac',
      descripcion: 'Clavo liso de acero galvanizado 2.5 pulgadas, bolsa de 1 kilogramo. Para madera y drywall.',
      precio: 8.90, stock: 150, stockMinimo: 30, sku: 'PROD-001', categoriaId: 7,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1066762_01']
    },
    {
      nombre: 'Ancla Química Fischer 345ml',
      descripcion: 'Anclaje químico de resina epoxi para cargas pesadas en concreto y ladrillo. 345ml.',
      precio: 68.00, precioOferta: 59.00, stock: 20, stockMinimo: 4, sku: 'FISC-002', categoriaId: 7, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2079654_01']
    },
    {
      nombre: 'Bisagra Plana Zincada 3" x 4und Forte',
      descripcion: 'Bisagra de sobreponer plana zincada de 3 pulgadas, pack de 4 unidades con tornillos incluidos.',
      precio: 9.90, stock: 120, stockMinimo: 25, sku: 'FORT-001', categoriaId: 7,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/1047781_01']
    },

    // ── CONSTRUCCIÓN ──
    {
      nombre: 'Cemento Portland Tipo I 42.5kg Sol',
      descripcion: 'Cemento portland tipo I en bolsa de 42.5kg. Para obras de concreto en general.',
      precio: 32.00, stock: 50, stockMinimo: 10, sku: 'SOL-001', categoriaId: 8, destacado: true,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2062798_01']
    },
    {
      nombre: 'Porcelana para Pisos Celima 25kg',
      descripcion: 'Pegamento cementicio para porcelanato y cerámica en pisos y paredes. Bolsa 25kg.',
      precio: 28.50, stock: 40, stockMinimo: 8, sku: 'CELI-001', categoriaId: 8,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2062988_01']
    },
    {
      nombre: 'Fragua Celima Gris Plata 1kg',
      descripcion: 'Fragua cementicia color gris plata para juntas de cerámico y porcelanato. Bolsa 1kg.',
      precio: 8.50, stock: 100, stockMinimo: 20, sku: 'CELI-002', categoriaId: 8,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2063036_01']
    },
    {
      nombre: 'Yeso de Construcción 18kg Finacast',
      descripcion: 'Yeso blanco de construcción para acabados interiores, cielorrasos y tartajeos. Bolsa 18kg.',
      precio: 22.00, stock: 35, stockMinimo: 8, sku: 'FINA-001', categoriaId: 8,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2063262_01']
    },
    {
      nombre: 'Malla Metálica Electrosoldada 2"x2" 1x2m',
      descripcion: 'Malla de acero electrosoldada cuadrícula 2x2 pulgadas, plancha 1x2 metros. Para losas y muros.',
      precio: 45.00, stock: 25, stockMinimo: 5, sku: 'MALL-001', categoriaId: 8,
      imagenes: ['https://sodimac.scene7.com/is/image/SodimacPE/2064872_01']
    },
  ]

  console.log(`📦 Creando ${productos.length} productos...`)

  for (const prod of productos) {
    const { categoriaId, ...data } = prod
    await prisma.producto.upsert({
      where:  { sku: prod.sku },
      update: { ...data, categoria: { connect: { id: categoriaId } } },
      create: { ...data, categoria: { connect: { id: categoriaId } } }
    })
  }

  // ─── BANNERS ─────────────────────────────────────────────
  const banners = [
    { titulo: 'Herramientas al mejor precio', imagen: 'https://sodimac.scene7.com/is/image/SodimacPE/banner-herramientas', link: '/productos?categoriaId=2', orden: 1 },
    { titulo: 'Ofertas en pinturas', imagen: 'https://sodimac.scene7.com/is/image/SodimacPE/banner-pinturas', link: '/productos?categoriaId=4', orden: 2 },
  ]
  for (const b of banners) {
    const existe = await prisma.banner.findFirst({ where: { titulo: b.titulo } })
    if (!existe) await prisma.banner.create({ data: b })
  }

  console.log(`✅ Listo: ${productos.length} productos, ${cats.length} categorías, 1 admin`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())