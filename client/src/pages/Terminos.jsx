import { useState } from 'react'
import { ChevronDown, ChevronUp, Truck, RefreshCw, Shield, CreditCard, MapPin, Phone } from 'lucide-react'

const Seccion = ({ titulo, icono, children }) => {
  const [abierto, setAbierto] = useState(true)
  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: '10px', marginBottom: '1rem', overflow: 'hidden' }}>
      <button onClick={() => setAbierto(!abierto)}
        style={{ width: '100%', padding: '1.2rem 1.5rem', background: 'white', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#1A1A2E' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          {icono} {titulo}
        </span>
        {abierto ? <ChevronUp size={20} color="#E63946" /> : <ChevronDown size={20} color="#E63946" />}
      </button>
      {abierto && (
        <div style={{ padding: '0 1.5rem 1.5rem', background: 'white', borderTop: '1px solid #F3F4F6' }}>
          {children}
        </div>
      )}
    </div>
  )
}

const Item = ({ titulo, children }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <h4 style={{ fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{titulo}</h4>
    <div style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.7 }}>{children}</div>
  </div>
)

const Tabla = ({ cabeceras, filas }) => (
  <div style={{ overflowX: 'auto', marginTop: '0.8rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
      <thead>
        <tr>
          {cabeceras.map((c, i) => (
            <th key={i} style={{ background: '#1A1A2E', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 700 }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F9FAFB' }}>
            {fila.map((celda, j) => (
              <td key={j} style={{ padding: '0.7rem 1rem', borderBottom: '1px solid #E5E7EB', color: '#374151' }}>{celda}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function Terminos() {
  const [tabActiva, setTabActiva] = useState('envio')

  const tabs = [
    { id: 'envio',      label: '🚚 Envíos',           },
    { id: 'reembolso',  label: '↩️ Devoluciones',     },
    { id: 'pagos',      label: '💳 Pagos',             },
    { id: 'privacidad', label: '🔒 Privacidad',        },
    { id: 'terminos',   label: '📄 Términos',          },
  ]

  return (
    <div>
      {/* Header */}
      <div className="terminos-header">
        <div className="contenedor">
          <h1>
            POLÍTICAS Y CONDICIONES
          </h1>
          <p style={{ color: '#9CA3AF', maxWidth: '500px', margin: '0 auto' }}>
            Toda la información sobre envíos, devoluciones, pagos y políticas de Ferretería Salcedo.
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: '0.8rem' }}>
            Última actualización: Enero 2025
          </p>
        </div>
      </div>

      <div className="contenedor page-padding">

        {/* Tabs */}
        <div className="terminos-tabs">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setTabActiva(tab.id)}
              style={{ padding: '0.7rem 1.2rem', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', color: tabActiva === tab.id ? '#E63946' : '#6B7280', borderBottom: tabActiva === tab.id ? '3px solid #E63946' : '3px solid transparent', marginBottom: '-2px', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ENVÍOS ── */}
        {tabActiva === 'envio' && (
          <div>
            <Seccion titulo="Métodos de Envío" icono={<Truck size={20} color="#E63946" />}>
              <Item titulo="🚚 Delivery a Domicilio">
                <p>Realizamos entregas a domicilio en Lima Metropolitana y Callao. El pedido es procesado una vez verificado el pago y coordinado con nuestro equipo de reparto.</p>
              </Item>

              <Tabla
                cabeceras={['Zona', 'Costo de Envío', 'Tiempo Estimado']}
                filas={[
                  ['Lima Centro (Cercado, Breña, Rímac)', 'S/ 5.00', '2-4 horas'],
                  ['Lima Moderna (Miraflores, San Isidro, Surco)', 'S/ 8.00', '3-5 horas'],
                  ['Lima Norte (Los Olivos, SMP, Comas)', 'S/ 10.00', '4-6 horas'],
                  ['Lima Este (SJL, Ate, Santa Anita)', 'S/ 10.00', '4-6 horas'],
                  ['Lima Sur (VMT, Chorrillos, VES)', 'S/ 12.00', '5-7 horas'],
                  ['Callao', 'S/ 10.00', '3-5 horas'],
                  ['Fuera de Lima', 'Consultar', 'A coordinar'],
                ]}
              />

              <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '1rem', marginTop: '1rem', fontSize: '0.88rem', color: '#92400E' }}>
                <strong>⚠️ Importante:</strong> Los tiempos de entrega son estimados y pueden variar según disponibilidad, tráfico y zona. Para pedidos grandes o materiales de construcción (cemento, mallas, etc.) el tiempo puede extenderse.
              </div>
            </Seccion>

            <Seccion titulo="Horarios de Entrega" icono={<MapPin size={20} color="#E63946" />}>
              <Item titulo="Horario de despacho">
                <p>Las entregas se realizan de <strong>Lunes a Sábado de 9:00am a 6:00pm</strong>. Los pedidos realizados después de las 4:00pm serán procesados al siguiente día hábil.</p>
              </Item>

              <Tabla
                cabeceras={['Hora del pedido', 'Procesamiento']}
                filas={[
                  ['Antes de las 12:00pm', 'Mismo día (tarde)'],
                  ['12:00pm - 4:00pm', 'Mismo día (noche) o siguiente día'],
                  ['Después de las 4:00pm', 'Siguiente día hábil'],
                  ['Sábados después de 2:00pm', 'Lunes siguiente'],
                  ['Domingos y feriados', 'Siguiente día hábil'],
                ]}
              />
            </Seccion>

            <Seccion titulo="Recojo en Tienda" icono={<MapPin size={20} color="#E63946" />}>
              <Item titulo="🏪 Recojo sin costo">
                <p>Puedes recoger tu pedido en nuestra tienda <strong>sin costo adicional</strong>. El pedido estará listo en <strong>30-60 minutos</strong> después de confirmado el pago.</p>
              </Item>
              <Item titulo="Dirección">
                <p>📍 <strong>Jr. Los Artesanos 245, Lima</strong><br/>
                Horario: Lunes a Sábado 8:00am - 7:00pm / Domingo 9:00am - 2:00pm<br/>
                📞 987-654-321</p>
              </Item>
              <Item titulo="¿Qué necesito para recoger?">
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Número de pedido (te llegará por email)</li>
                  <li>DNI del titular de la cuenta</li>
                  <li>En caso de recoger un tercero: autorización escrita + DNI de ambos</li>
                </ul>
              </Item>
            </Seccion>

            <Seccion titulo="Condiciones de Entrega" icono={<Shield size={20} color="#E63946" />}>
              <Item titulo="Responsabilidad en el envío">
                <p>Ferretería Salcedo garantiza la entrega de los productos en buen estado. Nuestros repartidores verificarán contigo la recepción del pedido.</p>
              </Item>
              <Item titulo="Si no estás en casa">
                <p>Si el cliente no se encuentra en el domicilio al momento de la entrega, se coordinará una nueva fecha. Se puede realizar un máximo de <strong>2 intentos de entrega</strong>. Si en el tercer intento no hay nadie, el pedido retorna a tienda y el cliente deberá recogerlo.</p>
              </Item>
              <Item titulo="Productos frágiles o grandes">
                <p>Materiales de construcción (cemento, mallas, tuberías largas) requieren coordinación especial. El costo de envío puede variar. Contáctanos antes de hacer el pedido si tienes dudas.</p>
              </Item>
            </Seccion>
          </div>
        )}

        {/* ── DEVOLUCIONES ── */}
        {tabActiva === 'reembolso' && (
          <div>
            <Seccion titulo="Política de Devoluciones" icono={<RefreshCw size={20} color="#E63946" />}>
              <div style={{ background: '#D1FAE5', borderRadius: '8px', padding: '1rem', marginTop: '1rem', marginBottom: '1.2rem', fontSize: '0.9rem', color: '#065F46' }}>
                <strong>✅ Tienes hasta 7 días calendario</strong> desde la recepción del producto para solicitar una devolución o cambio.
              </div>

              <Item titulo="Motivos aceptados para devolución">
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Producto defectuoso o dañado al momento de la entrega</li>
                  <li>Producto incorrecto (diferente al pedido)</li>
                  <li>Producto con falla de fabricación</li>
                  <li>Producto que no cumple con las especificaciones indicadas</li>
                </ul>
              </Item>

              <Item titulo="Condiciones para la devolución">
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>El producto debe estar en su empaque original sin abrir (salvo que el defecto sea interno)</li>
                  <li>Debe presentar el comprobante de compra (número de pedido)</li>
                  <li>No debe tener señales de uso, daño por el cliente o modificación</li>
                  <li>Pinturas, cementos y productos mezclados NO son devolvibles</li>
                </ul>
              </Item>
            </Seccion>

            <Seccion titulo="Proceso de Devolución" icono={<RefreshCw size={20} color="#E63946" />}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
                {[
                  { paso: '1', titulo: 'Contáctanos', desc: 'Escríbenos al WhatsApp o llama al 987-654-321 indicando tu número de pedido y motivo.' },
                  { paso: '2', titulo: 'Evaluación', desc: 'Nuestro equipo evaluará tu caso en un plazo de 24-48 horas hábiles.' },
                  { paso: '3', titulo: 'Aprobación', desc: 'Si procede, coordinaremos el recojo del producto o la visita a tienda.' },
                  { paso: '4', titulo: 'Reembolso o cambio', desc: 'Se procesa en 3-5 días hábiles según el método de pago original.' },
                ].map(p => (
                  <div key={p.paso} style={{ background: '#F9FAFB', borderRadius: '8px', padding: '1rem', borderLeft: '3px solid #E63946' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#E63946', marginBottom: '0.3rem' }}>Paso {p.paso}</div>
                    <strong style={{ fontSize: '0.9rem' }}>{p.titulo}</strong>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.3rem' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Política de Reembolsos" icono={<CreditCard size={20} color="#E63946" />}>
              <Tabla
                cabeceras={['Método de pago original', 'Método de reembolso', 'Plazo']}
                filas={[
                  ['Yape', 'Yape al número registrado', '1-2 días hábiles'],
                  ['Transferencia bancaria', 'Transferencia a la misma cuenta', '3-5 días hábiles'],
                  ['Efectivo (en tienda)', 'Efectivo en tienda', 'Inmediato al aprobar'],
                  ['Efectivo (contra entrega)', 'Transferencia o Yape', '2-3 días hábiles'],
                ]}
              />

              <div style={{ background: '#FEE2E2', borderRadius: '8px', padding: '1rem', marginTop: '1rem', fontSize: '0.88rem', color: '#991B1B' }}>
                <strong>❌ Productos NO devolvibles:</strong> Pinturas y esmaltes abiertos, cemento, yeso, mezclas preparadas, productos cortados a medida, artículos en oferta marcados como "sin devolución".
              </div>
            </Seccion>
          </div>
        )}

        {/* ── PAGOS ── */}
        {tabActiva === 'pagos' && (
          <div>
            <Seccion titulo="Métodos de Pago Aceptados" icono={<CreditCard size={20} color="#E63946" />}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
                {[
                  { emoji: '💜', titulo: 'Yape', desc: 'Yapea al 987-654-321 a nombre de Ferretería Salcedo. Sube tu captura para verificación inmediata.' },
                  { emoji: '🏦', titulo: 'Transferencia BCP', desc: 'Cuenta: 191-12345678-0-12 / CCI: 00219100123456780123. Titular: Ferretería Salcedo S.A.C.' },
                  { emoji: '💵', titulo: 'Efectivo', desc: 'Pago al repartidor contra entrega o en nuestra tienda al recoger el pedido. Monto exacto.' },
                ].map(m => (
                  <div key={m.titulo} style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '1.2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{m.emoji}</div>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.4rem' }}>{m.titulo}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5 }}>{m.desc}</p>
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Proceso de Verificación de Pago" icono={<Shield size={20} color="#E63946" />}>
              <Item titulo="¿Cuánto demora la verificación?">
                <Tabla
                  cabeceras={['Método', 'Tiempo de verificación']}
                  filas={[
                    ['Yape (con captura)', '15-30 minutos en horario de atención'],
                    ['Transferencia BCP', '1-3 horas hábiles'],
                    ['Efectivo contra entrega', 'Al momento de la entrega'],
                    ['Efectivo en tienda', 'Inmediato'],
                  ]}
                />
              </Item>
              <Item titulo="¿Qué pasa si mi pago es rechazado?">
                <p>Si el comprobante no es válido o el monto no coincide, serás notificado y tendrás <strong>24 horas</strong> para regularizar. De lo contrario el pedido será cancelado y el stock liberado.</p>
              </Item>
            </Seccion>

            <Seccion titulo="Seguridad en los Pagos" icono={<Shield size={20} color="#E63946" />}>
              <Item titulo="Protección de datos financieros">
                <p>Ferretería Salcedo <strong>nunca solicita</strong> claves de tarjeta, PIN de Yape ni contraseñas bancarias. Solo pedimos la captura de pantalla de la operación realizada. Desconfía de cualquier contacto que solicite esta información.</p>
              </Item>
              <Item titulo="Comprobantes de pago">
                <p>Emitimos boleta o factura electrónica por todas las compras. Si necesitas factura, indícalo en las notas del pedido con tu RUC y razón social.</p>
              </Item>
            </Seccion>
          </div>
        )}

        {/* ── PRIVACIDAD ── */}
        {tabActiva === 'privacidad' && (
          <div>
            <Seccion titulo="Política de Privacidad" icono={<Shield size={20} color="#E63946" />}>
              <Item titulo="¿Qué datos recopilamos?">
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Nombre completo y DNI (para verificación de identidad)</li>
                  <li>Correo electrónico (para confirmaciones y seguimiento)</li>
                  <li>Número de teléfono (para coordinar entregas)</li>
                  <li>Dirección de entrega</li>
                  <li>Historial de compras en nuestra plataforma</li>
                </ul>
              </Item>
              <Item titulo="¿Para qué usamos tus datos?">
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Procesar y entregar tus pedidos</li>
                  <li>Enviarte confirmaciones y actualizaciones de estado</li>
                  <li>Mejorar tu experiencia de compra</li>
                  <li>Informarte sobre ofertas y promociones (puedes desuscribirte)</li>
                  <li>Cumplir con obligaciones legales y tributarias</li>
                </ul>
              </Item>
              <Item titulo="¿Compartimos tus datos?">
                <p>No vendemos ni compartimos tus datos personales con terceros, salvo en los siguientes casos:</p>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Empresa de reparto (solo nombre y dirección para la entrega)</li>
                  <li>Entidades bancarias para verificación de pagos</li>
                  <li>SUNAT u organismos legales cuando sea requerido por ley</li>
                </ul>
              </Item>
              <Item titulo="Tus derechos (Ley N° 29733 - Perú)">
                <p>Conforme a la Ley de Protección de Datos Personales del Perú, tienes derecho a:</p>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li><strong>Acceso:</strong> Solicitar qué datos tenemos sobre ti</li>
                  <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
                  <li><strong>Cancelación:</strong> Solicitar eliminar tus datos</li>
                  <li><strong>Oposición:</strong> Oponerte al uso de tus datos para fines comerciales</li>
                </ul>
                <p style={{ marginTop: '0.5rem' }}>Para ejercer estos derechos escríbenos a: <strong>ventas@ferrreteriasalcedo.com</strong></p>
              </Item>
            </Seccion>

            <Seccion titulo="Cookies y Tecnología" icono={<Shield size={20} color="#E63946" />}>
              <Item titulo="Uso de cookies">
                <p>Usamos cookies esenciales para mantener tu sesión activa y tu carrito de compras. No usamos cookies de rastreo publicitario de terceros.</p>
              </Item>
              <Item titulo="Almacenamiento local">
                <p>Tu carrito de compras se guarda en tu navegador (localStorage) para que no pierdas los productos seleccionados. Esta información no se envía a nuestros servidores hasta que realizas el pedido.</p>
              </Item>
            </Seccion>
          </div>
        )}

        {/* ── TÉRMINOS ── */}
        {tabActiva === 'terminos' && (
          <div>
            <Seccion titulo="Términos y Condiciones de Uso" icono={<Shield size={20} color="#E63946" />}>
              <Item titulo="1. Aceptación de los términos">
                <p>Al acceder y usar el sitio web de Ferretería Salcedo, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo, por favor abstente de usar nuestros servicios.</p>
              </Item>
              <Item titulo="2. Registro de cuenta">
                <p>Para realizar compras debes crear una cuenta con información verídica. Eres responsable de mantener la confidencialidad de tu contraseña. Notifícanos inmediatamente si sospechas uso no autorizado.</p>
              </Item>
              <Item titulo="3. Disponibilidad de productos">
                <p>Los productos mostrados en el catálogo están sujetos a disponibilidad de stock. En caso de que un producto se agote después de tu compra, te contactaremos para ofrecerte alternativas o proceder con el reembolso.</p>
              </Item>
              <Item titulo="4. Precios">
                <p>Los precios mostrados en el sitio incluyen IGV (18%) y están expresados en Soles peruanos (S/). Ferretería Salcedo se reserva el derecho de modificar precios sin previo aviso, pero el precio al momento de confirmar el pedido será el definitivo.</p>
              </Item>
              <Item titulo="5. Cancelación de pedidos">
                <p>Puedes cancelar tu pedido <strong>antes de que sea verificado el pago</strong> sin penalidad. Una vez verificado el pago y en preparación, la cancelación está sujeta a evaluación.</p>
              </Item>
              <Item titulo="6. Responsabilidad">
                <p>Ferretería Salcedo no se responsabiliza por el uso inadecuado de los productos vendidos. Las especificaciones técnicas de los productos son provistas por los fabricantes. Para usos especiales o profesionales, consulta con nuestro equipo antes de comprar.</p>
              </Item>
              <Item titulo="7. Modificaciones">
                <p>Ferretería Salcedo se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al ser publicados en el sitio web.</p>
              </Item>
              <Item titulo="8. Jurisdicción">
                <p>Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será sometida a los tribunales competentes de Lima, Perú.</p>
              </Item>
            </Seccion>

            <Seccion titulo="Garantías de Productos" icono={<Shield size={20} color="#E63946" />}>
              <Tabla
                cabeceras={['Categoría', 'Garantía', 'Condiciones']}
                filas={[
                  ['Cerraduras y Candados', '12 meses', 'Defectos de fabricación'],
                  ['Herramientas Eléctricas', '12 meses', 'Defectos de fabricación, uso normal'],
                  ['Herramientas Manuales', '6 meses', 'Defectos de fabricación'],
                  ['Electricidad', '6 meses', 'Defectos de fabricación'],
                  ['Pinturas', 'Sin garantía', 'Productos consumibles'],
                  ['Plomería', '3 meses', 'Defectos de fabricación'],
                  ['Fijaciones y Tornillos', 'Sin garantía', 'Productos consumibles'],
                  ['Construcción', 'Sin garantía', 'Productos consumibles'],
                ]}
              />
              <div style={{ background: '#DBEAFE', borderRadius: '8px', padding: '1rem', marginTop: '1rem', fontSize: '0.88rem', color: '#1E40AF' }}>
                <strong>ℹ️ Nota:</strong> La garantía no cubre daños por mal uso, accidentes, modificaciones no autorizadas o desgaste normal por uso.
              </div>
            </Seccion>
          </div>
        )}

        {/* Contacto */}
        <div style={{ background: '#1A1A2E', color: 'white', borderRadius: '12px', padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            ¿Tienes alguna duda?
          </h3>
          <p style={{ color: '#9CA3AF', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
            Nuestro equipo está disponible para ayudarte de Lunes a Sábado 8am - 7pm
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:987654321" style={{ background: '#E63946', color: 'white', padding: '0.7rem 1.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={16} /> 987-654-321
            </a>
            <a href="mailto:ventas@ferrreteriasalcedo.com" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '0.7rem 1.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
              ✉️ ventas@ferrreteriasalcedo.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}