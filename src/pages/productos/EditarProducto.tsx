// src/pages/productos/EditarProducto.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Sidebar from '../../components/Sidebar'

export default function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    precio: '',
    cantidad: '',
    imagen_drive_id: '',
    disponible: false,
    destacado: false,
    reciente: false,
    oferta: false,
    descuento: 0,
    caracteristicas: ''
  })

  useEffect(() => {
    const fetchProducto = async () => {
      const docRef = doc(db, 'productos', id!)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setForm({
            nombre: data.nombre || '',
            descripcion: data.descripcion || '',
            tipo: data.tipo || '',
            precio: String(data.precio ?? ''),
            cantidad: String(data.cantidad ?? ''),
            imagen_drive_id: data.imagen_drive_id || '',
            disponible: Boolean(data.disponible),
            descuento: data.descuento ?? 0,
            destacado: Boolean(data.destacado),
            reciente: Boolean(data.reciente),
            oferta: Boolean(data.oferta),
            caracteristicas: data.caracteristicas || ''
        })
      }
    }

    fetchProducto()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const docRef = doc(db, 'productos', id!)
    await updateDoc(docRef, {
      ...form,
      precio: parseFloat(form.precio),
      cantidad: parseInt(form.cantidad),
      descuento: parseFloat(String(form.descuento)),
      disponible: Boolean(form.disponible),
      destacado: Boolean(form.destacado),
      reciente: Boolean(form.reciente),
      oferta: Boolean(form.oferta)
    })
    navigate('/productos')
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-20 md:ml-64 p-6 w-full min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block mb-1 font-semibold">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Tipo</label>
            <input type="text" name="tipo" value={form.tipo} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Precio</label>
            <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Cantidad</label>
            <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 font-semibold">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 font-semibold">Características</label>
            <textarea name="caracteristicas" value={form.caracteristicas} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">ID imagen Drive</label>
            <input type="text" name="imagen_drive_id" value={form.imagen_drive_id} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Descuento (%)</label>
            <input type="number" step="0.01" name="descuento" value={form.descuento} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Etiquetas</label>
            <label><input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} /> Disponible</label>
            <label><input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} /> Destacado</label>
            <label><input type="checkbox" name="reciente" checked={form.reciente} onChange={handleChange} /> Reciente</label>
            <label><input type="checkbox" name="oferta" checked={form.oferta} onChange={handleChange} /> Oferta</label>
          </div>
          <div className="col-span-2 text-right">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Guardar cambios
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}