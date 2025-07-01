import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../../firebase/config'
import ProductoCard from './ProductoCard'
import Sidebar from '../../components/Sidebar'
import { Link } from 'react-router-dom'

const PAGE_SIZE = 15

export default function ProductosList() {
  const [productos, setProductos] = useState<any[]>([])
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchProductos = async () => {
    setLoading(true)
    const productosRef = collection(db, 'productos')
    const q = lastDoc
      ? query(productosRef, orderBy('nombre'), startAfter(lastDoc), limit(PAGE_SIZE))
      : query(productosRef, orderBy('nombre'), limit(PAGE_SIZE))

    const snap = await getDocs(q)
    const productosData: any[] = []
    snap.forEach(doc => {
      productosData.push({ id: doc.id, ...doc.data() })
    })
    setProductos(prev => [...prev, ...productosData])
    setLastDoc(snap.docs[snap.docs.length - 1])
    setLoading(false)
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleDelete = (id: string) => {
    setProductos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-20 md:ml-64 p-6 w-full min-h-screen bg-gray-100">
        {/* TÍTULO Y BOTÓN */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Productos</h1>
          <Link
        to="/productos/nuevo"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Nuevo producto
        </Link>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map(prod => (
            <ProductoCard key={prod.id} producto={prod} onDelete={handleDelete} />
          ))}
        </div>

        {/* BOTÓN DE CARGAR MÁS */}
        {lastDoc && (
          <div className="mt-6 text-center">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={fetchProductos}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar más'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}