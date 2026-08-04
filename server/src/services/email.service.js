const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

// ── Plantilla base HTML ───────────────────────────────────
const plantillaBase = (contenido) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#F3F4F6; color:#1A1A2E; }
    .wrapper { max-width:600px; margin:0 auto; padding:2rem 1rem; }
    .header { background:#1A1A2E; padding:1.5rem 2rem; border-radius:12px 12px 0 0; text-align:center; }
    .header h1 { color:#E63946; font-size:1.6rem; font-weight:800; letter-spacing:1px; }
    .header p { color:#9CA3AF; font-size:0.85rem; margin-top:0.3rem; }
    .body { background:white; padding:2rem; }
    .footer { background:#1A1A2E; padding:1.2rem 2rem; border-radius:0 0 12px 12px; text-align:center; }
    .footer p { color:#6B7280; font-size:0.78rem; }
    .footer a { color:#E63946; }
    .btn { display:inline-block; background:#E63946; color:white !important; padding:0.8rem 2rem; border-radius:8px; font-weight:700; text-decoration:none; margin:1rem 0; }
    .badge { display:inline-block; padding:0.3rem 0.8rem; border-radius:999px; font-weight:700; font-size:0.82rem; }
    .info-box { background:#F9FAFB; border-radius:8px; padding:1rem 1.2rem; margin:1rem 0; border-left:4px solid #E63946; }
    .table { width:100%; border-collapse:collapse; margin:1rem 0; }
    .table th { background:#1A1A2E; color:white; padding:0.6rem 0.8rem; text-align:left; font-size:0.82rem; }
    .table td { padding:0.6rem 0.8rem; border-bottom:1px solid #F3F4F6; font-size:0.88rem; }
    .table tr:last-child td { border-bottom:none; }
    .total-row td { font-weight:800; color:#E63946; font-size:1rem; border-top:2px solid #E5E7EB; }
    .codigo { font-size:2.5rem; font-weight:800; letter-spacing:8px; color:#E63946; text-align:center; padding:1.5rem; background:#FEF2F2; border-radius:10px; border:2px dashed #E63946; margin:1.5rem 0; }
    .estado-timeline { margin:1rem 0; }
    .estado-paso { display:flex; align-items:center; gap:0.8rem; padding:0.6rem 0; }
    .estado-circulo { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800; flex-shrink:0; }
    .activo { background:#E63946; color:white; }
    .completado { background:#10B981; color:white; }
    .pendiente { background:#E5E7EB; color:#9CA3AF; }
    h2 { font-size:1.3rem; font-weight:800; margin-bottom:0.5rem; }
    p { line-height:1.6; color:#4B5563; margin-bottom:0.5rem; }
    .wa-btn { display:inline-flex; align-items:center; gap:0.4rem; background:#25D366; color:white !important; padding:0.6rem 1.2rem; border-radius:6px; font-weight:700; text-decoration:none; font-size:0.88rem; margin-top:0.8rem; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🔧 FERRETERÍA SALCEDO</h1>
      <p>Jr. Los Artesanos 245, Lima | 987-654-321</p>
    </div>
    <div class="body">${contenido}</div>
    <div class="footer">
      <p>© 2025 Ferretería Salcedo — <a href="mailto:ventas@ferrreteriasalcedo.com">ventas@ferrreteriasalcedo.com</a></p>
      <p style="margin-top:0.3rem">Si no solicitaste este correo, ignóralo o contáctanos.</p>
    </div>
  </div>
</body>
</html>
`

// ── 1. Email de verificación de cuenta ───────────────────
const enviarCodigoVerificacion = async (email, nombre, codigo) => {
  const html = plantillaBase(`
    <h2>¡Hola, ${nombre}! 👋</h2>
    <p>Gracias por registrarte en <strong>Ferretería Salcedo</strong>. Para completar tu registro y activar tu cuenta, usa el siguiente código:</p>

    <div class="codigo">${codigo}</div>

    <div class="info-box">
      <p><strong>⏰ Este código expira en 15 minutos.</strong></p>
      <p>Si no creaste esta cuenta, ignora este correo.</p>
    </div>

    <p style="font-size:0.85rem; color:#9CA3AF;">Por seguridad, nunca compartamos tu código con nadie, incluyendo nuestro personal.</p>
  `)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${codigo} — Código de verificación | Ferretería Salcedo`,
    html
  })
}

// ── 2. Email de bienvenida (después de verificar) ────────
const enviarBienvenida = async (email, nombre) => {
  const html = plantillaBase(`
    <h2>¡Bienvenido a Ferretería Salcedo, ${nombre}! 🎉</h2>
    <p>Tu cuenta ha sido verificada exitosamente. Ya puedes disfrutar de todos nuestros productos y servicios.</p>

    <div class="info-box">
      <p>🛒 <strong>Explora nuestro catálogo</strong> con más de 40 productos de ferretería</p>
      <p>💜 <strong>Paga con Yape</strong>, efectivo o transferencia bancaria</p>
      <p>🚚 <strong>Delivery el mismo día</strong> en Lima Metropolitana</p>
    </div>

    <center><a href="${process.env.CLIENT_URL}/productos" class="btn">Ver catálogo →</a></center>

    <a href="https://wa.me/51987654321" class="wa-btn">💬 ¿Necesitas ayuda? Escríbenos</a>
  `)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '¡Bienvenido a Ferretería Salcedo! Tu cuenta está lista ✅',
    html
  })
}

// ── 3. Email de confirmación de pedido con boleta ────────
const enviarConfirmacionPedido = async (email, nombre, pedido) => {
  const metodoPago = pedido.pago?.metodo || 'YAPE'
  const esFactura  = metodoPago === 'TRANSFERENCIA'
  const subtotalSinIGV = Number(pedido.total) / 1.18
  const igv = Number(pedido.total) - subtotalSinIGV
  const fecha = new Date(pedido.creadoEn).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit', year:'numeric' })

  const filasProductos = pedido.detalles.map(d => `
    <tr>
      <td>${d.producto?.nombre || 'Producto'}</td>
      <td style="text-align:center">${d.cantidad}</td>
      <td style="text-align:right">S/ ${Number(d.precioUnit).toFixed(2)}</td>
      <td style="text-align:right">S/ ${Number(d.subtotal).toFixed(2)}</td>
    </tr>
  `).join('')

  const instruccionPago = metodoPago === 'YAPE'
    ? `<div class="info-box" style="border-color:#7C3AED"><p>💜 <strong>Yapea al: 987-654-321</strong> a nombre de Ferretería Salcedo</p><p>Monto exacto: <strong style="color:#E63946">S/ ${Number(pedido.total).toFixed(2)}</strong></p><p>Luego sube tu captura en "Mis pedidos" → "Ver boleta"</p></div>`
    : metodoPago === 'TRANSFERENCIA'
    ? `<div class="info-box" style="border-color:#1E40AF"><p>🏦 <strong>BCP Cuenta:</strong> 191-12345678-0-12</p><p><strong>CCI:</strong> 00219100123456780123</p><p>Monto: <strong style="color:#E63946">S/ ${Number(pedido.total).toFixed(2)}</strong></p></div>`
    : `<div class="info-box" style="border-color:#10B981"><p>💵 <strong>Pago en efectivo</strong> al momento de la entrega o en tienda.</p><p>Ten listo: <strong style="color:#E63946">S/ ${Number(pedido.total).toFixed(2)}</strong></p></div>`

  const html = plantillaBase(`
    <h2>¡Pedido recibido, ${nombre}! 📦</h2>
    <p>Tu pedido <strong>#${pedido.id}</strong> ha sido registrado correctamente el ${fecha}.</p>

    ${instruccionPago}

    <h3 style="font-weight:700; margin:1.2rem 0 0.5rem; font-size:1rem">${esFactura ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA'} N° ${String(pedido.id).padStart(6, '0')}</h3>

    <table class="table">
      <thead><tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th></tr></thead>
      <tbody>
        ${filasProductos}
        <tr><td colspan="3" style="text-align:right;font-size:0.82rem;color:#9CA3AF">Subtotal sin IGV</td><td style="text-align:right;font-size:0.82rem;color:#9CA3AF">S/ ${subtotalSinIGV.toFixed(2)}</td></tr>
        <tr><td colspan="3" style="text-align:right;font-size:0.82rem;color:#9CA3AF">IGV (18%)</td><td style="text-align:right;font-size:0.82rem;color:#9CA3AF">S/ ${igv.toFixed(2)}</td></tr>
        <tr class="total-row"><td colspan="3" style="text-align:right">TOTAL</td><td style="text-align:right">S/ ${Number(pedido.total).toFixed(2)}</td></tr>
      </tbody>
    </table>

    <div class="info-box">
      <p>📍 <strong>Entrega:</strong> ${pedido.tipoEntrega === 'DELIVERY' ? pedido.notas || 'Delivery a domicilio' : 'Recojo en tienda — Jr. Los Artesanos 245, Lima'}</p>
      <p>💳 <strong>Método de pago:</strong> ${metodoPago}</p>
    </div>

    <center><a href="${process.env.CLIENT_URL}/mis-pedidos" class="btn">Ver mis pedidos →</a></center>
    <a href="https://wa.me/51987654321?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido #${pedido.id}`)}" class="wa-btn">💬 Consultar por WhatsApp</a>
  `)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Pedido #${pedido.id} recibido — S/ ${Number(pedido.total).toFixed(2)} | Ferretería Salcedo`,
    html
  })
}

// ── 4. Email de actualización de estado del pedido ───────
const enviarActualizacionEstado = async (email, nombre, pedido) => {
  const ESTADOS = {
    PAGO_VERIFICADO: {
      emoji: '✅', titulo: '¡Pago verificado!',
      descripcion: 'Tu pago ha sido confirmado por nuestro equipo. Estamos preparando tu pedido.',
      color: '#10B981', paso: 2
    },
    EN_PREPARACION: {
      emoji: '📦', titulo: 'Preparando tu pedido',
      descripcion: 'Nuestro equipo está empacando y preparando tu pedido con mucho cuidado.',
      color: '#3B82F6', paso: 3
    },
    ENVIADO: {
      emoji: '🚚', titulo: '¡Tu pedido está en camino!',
      descripcion: 'Tu pedido ha sido enviado. El repartidor está en camino a tu dirección.',
      color: '#8B5CF6', paso: 4
    },
    ENTREGADO: {
      emoji: '🎉', titulo: '¡Pedido entregado!',
      descripcion: '¡Tu pedido ha sido entregado exitosamente! Esperamos que estés satisfecho.',
      color: '#10B981', paso: 5
    },
    CANCELADO: {
      emoji: '❌', titulo: 'Pedido cancelado',
      descripcion: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
      color: '#E63946', paso: 0
    },
  }

  const estadoInfo = ESTADOS[pedido.estado]
  if (!estadoInfo) return

  const pasos = [
    { num: 1, label: 'Pedido recibido',    completado: true },
    { num: 2, label: 'Pago verificado',    completado: estadoInfo.paso >= 2 },
    { num: 3, label: 'En preparación',     completado: estadoInfo.paso >= 3 },
    { num: 4, label: 'Enviado',            completado: estadoInfo.paso >= 4 },
    { num: 5, label: 'Entregado',          completado: estadoInfo.paso >= 5 },
  ]

  const timeline = pasos.map(p => {
    const esPasoActual = p.num === estadoInfo.paso
    const clase = esPasoActual ? 'activo' : p.completado ? 'completado' : 'pendiente'
    const icono = p.completado ? '✓' : p.num
    return `
      <div class="estado-paso">
        <div class="estado-circulo ${clase}">${icono}</div>
        <span style="font-weight:${esPasoActual ? '700' : '400'}; color:${esPasoActual ? estadoInfo.color : p.completado ? '#10B981' : '#9CA3AF'}">${p.label}${esPasoActual ? ' ← Aquí estás' : ''}</span>
      </div>
    `
  }).join('')

  const infoEnvio = pedido.tipoEntrega === 'DELIVERY' && pedido.notas
    ? `<div class="info-box"><p>📍 <strong>Dirección de entrega:</strong><br/>${pedido.notas}</p>${pedido.estado === 'ENVIADO' ? '<p style="margin-top:0.5rem">⏱️ Tiempo estimado de entrega: 2-4 horas</p>' : ''}</div>`
    : ''

  const html = plantillaBase(`
    <div style="text-align:center; padding:1rem 0">
      <div style="font-size:3rem">${estadoInfo.emoji}</div>
      <h2 style="color:${estadoInfo.color}; font-size:1.5rem">${estadoInfo.titulo}</h2>
    </div>

    <p>Hola <strong>${nombre}</strong>, tu pedido <strong>#${pedido.id}</strong> ha sido actualizado.</p>
    <p>${estadoInfo.descripcion}</p>

    <h3 style="font-weight:700; margin:1.5rem 0 0.8rem; font-size:0.9rem; text-transform:uppercase; color:#9CA3AF">Seguimiento del pedido</h3>
    <div class="estado-timeline">${timeline}</div>

    ${infoEnvio}

    <div class="info-box">
      <p>💰 <strong>Total del pedido:</strong> S/ ${Number(pedido.total).toFixed(2)}</p>
      <p>📅 <strong>Fecha:</strong> ${new Date(pedido.creadoEn).toLocaleDateString('es-PE')}</p>
    </div>

    <center><a href="${process.env.CLIENT_URL}/mis-pedidos" class="btn">Ver seguimiento →</a></center>
    <a href="https://wa.me/51987654321?text=${encodeURIComponent(`Hola, consulta sobre mi pedido #${pedido.id} — Estado: ${pedido.estado}`)}" class="wa-btn">💬 Consultar por WhatsApp</a>
  `)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${estadoInfo.emoji} Pedido #${pedido.id} — ${estadoInfo.titulo} | Ferretería Salcedo`,
    html
  })
}

const enviarRecuperacionPassword = async (email, nombre, codigo) => {
  const html = plantillaBase(`
    <h2>Recuperar contraseña 🔐</h2>
    <p>Hola <strong>${nombre}</strong>, recibimos una solicitud para restablecer tu contraseña.</p>
    <p>Usa el siguiente código:</p>
    <div class="codigo">${codigo}</div>
    <div class="info-box">
      <p><strong>⏰ Este código expira en 15 minutos.</strong></p>
      <p>Si no solicitaste esto, ignora este correo. Tu contraseña no cambiará.</p>
    </div>
  `)
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${codigo} — Recuperar contraseña | Ferretería Salcedo`,
    html
  })
}

module.exports = {
  enviarCodigoVerificacion,
  enviarBienvenida,
  enviarConfirmacionPedido,
  enviarActualizacionEstado,
  enviarRecuperacionPassword,
}