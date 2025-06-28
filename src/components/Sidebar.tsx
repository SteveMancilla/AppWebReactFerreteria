import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import {
  FaBars, FaTimes, FaBoxOpen, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaStore
} from 'react-icons/fa'

export default function Sidebar() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth)
    navigate('/')
  }

  const toggleSidebar = () => {
    setOpen(!open)
  }

  const menuItems = [
    { icon: <FaChartBar />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaBoxOpen />, label: 'Productos', path: '/productos' },
    { icon: <FaUsers />, label: 'Usuarios', path: '/usuarios' },
    { icon: <FaChartBar />, label: 'Reportes', path: '/reportes' },
    { icon: '💵', label: 'Ventas', path: '/ventas' },
    { icon: <FaCog />, label: 'Ajustes', path: '/ajustes' },
  ]

  return (
    <aside className={`bg-[#0f172a] text-white h-screen p-4 transition-all duration-300 ${open ? 'w-64' : 'w-20'} fixed`}>
      <div className="flex items-center justify-between mb-8">
        {open && <h2 className="text-xl font-bold flex items-center gap-2"><FaStore /> Santa Rosa</h2>}
        <button onClick={toggleSidebar} className="text-lg">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <ul className="space-y-4 text-sm">
        {menuItems.map(({ icon, label, path }) => (
          <li key={label} className="flex items-center gap-3 hover:text-blue-400 cursor-pointer" onClick={() => navigate(path)}>
            <span>{icon}</span> {open && label}
          </li>
        ))}
        <li className="flex items-center gap-3 hover:text-red-400 cursor-pointer" onClick={handleLogout}>
          <FaSignOutAlt /> {open && 'Cerrar sesión'}
        </li>
      </ul>
    </aside>
  )
}