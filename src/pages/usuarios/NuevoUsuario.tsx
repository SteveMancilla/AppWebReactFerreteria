// src/pages/usuarios/NuevoUsuario.tsx
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Sidebar from '../../components/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function NuevoUsuario() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    imagenUrl: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addDoc(collection(db, 'usuarios'), formData)
    navigate('/usuarios')
  }

  return (
    <div className="flex">
      <Sidebar onToggle={setSidebarOpen} />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 w-full min-h-screen bg-gray-100`}>
        <h1 className="text-3xl font-bold mb-6">Registrar nuevo usuario</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-xl space-y-4">
          <div>
            <label className="block font-semibold">Nombres</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block font-semibold">Apellidos</label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block font-semibold">Correo</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold">Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-semibold">Imagen (URL)</label>
            <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="text-right">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Guardar usuario
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}