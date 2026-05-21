import { createContext, useContext, useState, useEffect } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem('carrito')
    return guardado ? JSON.parse(guardado) : []
  })

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items))
  }, [items])

  const agregar = (producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id)
      if (existe) {
        return prev.map(i => i.id === producto.id
          ? { ...i, cantidad: i.cantidad + cantidad }
          : i)
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const quitar = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const actualizar = (id, cantidad) => {
    if (cantidad <= 0) return quitar(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }

  const vaciar = () => setItems([])

  const total = items.reduce((acc, i) => {
    const precio = Number(i.precioOferta || i.precio)
    return acc + precio * i.cantidad
  }, 0)

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, actualizar, vaciar, total, totalItems }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => useContext(CarritoContext)