// src/pages/productos/ProductoCard.tsx
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

interface ProductoCardProps {
  producto: any
  onDelete: (id: string) => void
}

export default function ProductoCard({ producto, onDelete }: ProductoCardProps) {
  const imageUrl = `https://drive.google.com/uc?id=${producto.imagen_drive_id}`

  const handleDelete = async () => {
    const confirm = window.confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)
    if (confirm) {
      try {
        await deleteDoc(doc(db, 'productos', producto.id))
        onDelete(producto.id) // para actualizar la lista
      } catch (error) {
        console.error('Error al eliminar producto:', error)
      }
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md flex flex-col">
      <img src={imageUrl} alt={producto.nombre} className="w-full h-40 object-cover rounded mb-4" />
      <h3 className="text-lg font-bold">{producto.nombre}</h3>
      <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
      <ul className="text-sm mb-3">
        <li><strong>Tipo:</strong> {producto.tipo}</li>
        <li><strong>Precio:</strong> S/ {producto.precio}</li>
        <li><strong>Cantidad:</strong> {producto.cantidad}</li>
        <li><strong>Disponible:</strong> {producto.disponible ? 'Sí' : 'No'}</li>
      </ul>
      <div className="flex gap-4 mt-auto">
        <a href={`/productos/editar/${producto.id}`} className="text-blue-600 hover:underline">Editar</a>
        <button onClick={handleDelete} className="text-red-600 hover:underline">Eliminar</button>
      </div>
    </div>
  )
}