import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login' // tu login actual
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import { AuthProvider } from './firebase/useAuth'
import ProductosList from './pages/productos/ProductosList'
import NuevoProducto from './pages/productos/NuevoProducto'
import EditarProducto from './pages/productos/EditarProducto'
import UsuariosList from './pages/usuarios/UsuariosList'
import UsuarioDetalle from './pages/usuarios/UsuarioDetalle'
import EditarUsuario from './pages/usuarios/EditarUsuario'
import NuevoUsuario from './pages/usuarios/NuevoUsuario'
import Reportes from './pages/Reportes'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/productos' element={<ProductosList />} />
          <Route path="/productos/nuevo" element={<NuevoProducto />} />
          <Route path="/productos/editar/:id" element={<EditarProducto />} />
          <Route path="/usuarios" element={<UsuariosList />} />
          <Route path="/usuarios/:id" element={<UsuarioDetalle /> } />
          <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
          <Route path="/usuarios/nuevo" element={<NuevoUsuario />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
