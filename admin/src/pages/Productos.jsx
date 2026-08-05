import { useEffect, useState } from 'react'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', precioOferta: '', stock: '', stockMinimo: '5', sku: '', categoriaId: '', destacado: false, imagenes: [] }

export default function ProductosAdmin() {
  const [productos, setProductos]   = useState([])
  const [categorias, setCategorias] = useState([])
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState(FORM_VACIO)
  const [editando, setEditando]     = useState(null)
  
  // Estados para Cloudinary
  const [subiendo, setSubiendo]     = useState(false)
  const [imagenesForm, setImagenesForm] = useState([])

  const cargar = () => {
    axios.get('/api/admin/productos').then(r => setProductos(r.data))
    axios.get('/api/categorias').then(r => setCategorias(r.data))
  }

  useEffect(() => { cargar() }, [])

  const abrirEditar = (p) => {
    setEditando(p.id)
    setImagenesForm(p.imagenes || []) 
    setForm({ 
      nombre: p.nombre, 
      descripcion: p.descripcion || '', 
      precio: p.precio, 
      precioOferta: p.precioOferta || '', 
      stock: p.stock, 
      stockMinimo: p.stockMinimo, 
      sku: p.sku || '', 
      categoriaId: p.categoriaId, 
      destacado: p.destacado,
      imagenes: p.imagenes || []
    })
    setModal(true)
  }

  const handleSubirImagen = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('imagen', file)
      const r = await axios.post('/api/admin/upload-imagen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const nuevasImagenes = [...imagenesForm, r.data.url]
      setImagenesForm(nuevasImagenes)
      setForm(p => ({ ...p, imagenes: nuevasImagenes }))
      toast.success('Imagen subida a Cloudinary ✓')
    } catch {
      toast.error('Error al subir imagen')
    } finally {
      setSubiendo(false)
    }
  }

  const quitarImagen = (url) => {
    const nuevas = imagenesForm.filter(i => i !== url)
    setImagenesForm(nuevas)
    setForm(p => ({ ...p, imagenes: nuevas }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      if (editando) {
        await axios.put(`/api/admin/productos/${editando}`, form)
        toast.success('Producto actualizado')
      } else {
        await axios.post('/api/admin/productos', form)
        toast.success('Producto creado')
      }
      cerrarYLimpiar()
    } catch { toast.error('Error al guardar') }
  }

  const toggleActivo = async (p) => {
    await axios.patch(`/api/admin/productos/${p.id}`, { activo: !p.activo })
    cargar()
  }

  const cerrarYLimpiar = () => {
    setModal(false)
    setEditando(null)
    setForm(FORM_VACIO)
    setImagenesForm([])
    cargar()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 800 }}>PRODUCTOS</h1>
          <p style={{ color: '#64748B' }}>{productos.length} productos registrados</p>
        </div>
        <button onClick={() => { setModal(true); setEditando(null); setForm(FORM_VACIO); setImagenesForm([]) }} className="btn btn-rojo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <img 
                      src={p.imagenes?.[0] || 'https://placehold.co/40x40'} 
                      alt="" 
                      onError={e => { e.target.src = 'https://placehold.co/40x40?text=?' }}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} 
                      />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.nombre}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748B' }}>SKU: {p.sku || '-'}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{p.categoria?.nombre}</td>
                <td>
                  <p style={{ fontWeight: 700 }}>S/ {Number(p.precio).toFixed(2)}</p>
                  {p.precioOferta && <p style={{ fontSize: '0.78rem', color: '#E63946' }}>Oferta: S/ {Number(p.precioOferta).toFixed(2)}</p>}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: p.stock <= p.stockMinimo ? '#E63946' : '#10B981' }}>{p.stock}</span>
                  {p.stock <= p.stockMinimo && <span style={{ fontSize: '0.72rem', color: '#E63946', display: 'block' }}>⚠ Stock bajo</span>}
                </td>
                <td>
                  <span className={`badge-estado ${p.activo ? 'badge-verificado' : 'badge-cancelado'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => abrirEditar(p)} className="btn btn-gris" style={{ padding: '0.4rem 0.6rem' }}><Pencil size={14} /></button>
                    <button onClick={() => toggleActivo(p)} className="btn btn-gris" style={{ padding: '0.4rem 0.6rem', color: p.activo ? '#E63946' : '#10B981' }}>
                      {p.activo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal formulario */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {editando ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
            </h2>
            <form onSubmit={handleGuardar}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['nombre','Nombre',true],['sku','SKU',false]].map(([k,l,r]) => (
                  <div key={k} style={{ gridColumn: k === 'nombre' ? '1/-1' : 'auto' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.85rem' }}>{l}{r?' *':''}</label>
                    <input required={r} value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} />
                  </div>
                ))}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.85rem' }}>Descripción</label>
                  <textarea rows={2} value={form.descripcion} onChange={e => setForm(p => ({...p, descripcion: e.target.value}))} style={{ resize: 'vertical' }} />
                </div>
                {[['precio','Precio *',true],['precioOferta','Precio oferta',false],['stock','Stock *',true],['stockMinimo','Stock mínimo',true]].map(([k,l,r]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.85rem' }}>{l}</label>
                    <input type="number" required={r} value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} />
                  </div>
                ))}
                
                {/* INTERFAZ DE IMÁGENES DE CLOUDINARY */}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                    📸 Imágenes del producto
                  </label>

                  {/* Imágenes ya subidas */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {imagenesForm.map((url, i) => (
                      <div key={i} style={{ position: 'relative', width: '70px', height: '70px' }}>
                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--borde)' }} />
                        <button type="button" onClick={() => quitarImagen(url)}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#E63946', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Botón subir */}
                  <label style={{ display: 'inline-block', background: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                    {subiendo ? '⏳ Subiendo...' : '+ Subir imagen'}
                    <input type="file" accept="image/*" onChange={handleSubirImagen} style={{ display: 'none' }} disabled={subiendo} />
                  </label>
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.85rem' }}>Categoría *</label>
                  <select required value={form.categoriaId} onChange={e => setForm(p => ({...p, categoriaId: e.target.value}))}>
                    <option value="">Seleccionar...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="destacado" checked={form.destacado} onChange={e => setForm(p => ({...p, destacado: e.target.checked}))} style={{ width: 'auto' }} />
                  <label htmlFor="destacado" style={{ fontWeight: 600, fontSize: '0.88rem' }}>Marcar como destacado</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-rojo" style={{ flex: 1, padding: '0.8rem' }}>Guardar</button>
                <button type="button" onClick={cerrarYLimpiar} className="btn btn-gris" style={{ flex: 1, padding: '0.8rem' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}