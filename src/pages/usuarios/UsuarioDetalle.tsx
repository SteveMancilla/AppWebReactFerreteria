import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import Sidebar from '../../components/Sidebar'
import { FaUserCircle, FaEnvelope, FaPhone, FaEdit, FaTrash } from 'react-icons/fa'

export default function UsuarioDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!id) return
      const docRef = doc(db, 'usuarios', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUsuario({ id: docSnap.id, ...docSnap.data() })
      }
    }

    fetchUsuario()
  }, [id])

  const handleEliminar = async () => {
    if (!usuario?.id) return
    const confirm = window.confirm('¿Estás seguro de eliminar este usuario?')
    if (!confirm) return
    await deleteDoc(doc(db, 'usuarios', usuario.id))
    navigate('/usuarios')
  }

  if (!usuario) return <div className="ml-64 p-6 text-lg">Cargando...</div>

  const imagenValida = usuario.imagenUrl && !usuario.imagenUrl.startsWith('/data')

  return (
    <div className="flex">
      <Sidebar onToggle={setSidebarOpen} />
      <main
        className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-6 w-full min-h-screen bg-gray-100`}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Perfil de usuario</h1>

        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-3xl mx-auto relative">
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <FaEdit /> Editar
            </button>
            <button
              onClick={handleEliminar}
              className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 flex items-center gap-2 text-sm"
            >
              <FaTrash /> Eliminar
            </button>
          </div>

          <div className="flex flex-col items-center mb-8">
            {imagenValida ? (
              <img
                src={usuario.imagenUrl}
                alt="Foto de perfil"
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow"
              />
            ) : (
              <FaUserCircle className="text-gray-400 w-36 h-36" />
            )}
            <h2 className="text-2xl font-bold mt-4 text-blue-700">
              {usuario.nombres} {usuario.apellidos}
            </h2>
            <p className="text-sm text-gray-500">ID: {usuario.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[16px] px-4">
            <div>
              <h3 className="text-gray-600 font-semibold flex items-center gap-2">
                <FaEnvelope /> Correo:
              </h3>
              <p className="text-gray-800 break-all">{usuario.correo || <span className="italic text-gray-400">null</span>}</p>
            </div>

            <div>
              <h3 className="text-gray-600 font-semibold flex items-center gap-2">
                <FaPhone /> Teléfono:
              </h3>
              <p className="text-gray-800">{usuario.telefono || <span className="italic text-gray-400">null</span>}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-gray-600 font-semibold">Imagen:</h3>
              <p className="text-gray-800 break-all">
                {usuario.imagenUrl ? usuario.imagenUrl : <span className="italic text-gray-400">null</span>}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}