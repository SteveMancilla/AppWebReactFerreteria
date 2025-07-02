import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login' // tu login actual
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import { AuthProvider } from './firebase/useAuth'
import ProductosList from './pages/productos/ProductosList'
import NuevoProducto from './pages/productos/NuevoProducto'
import EditarProducto from './pages/productos/EditarProducto'
import UsuariosList from './pages/usuarios/UsuariosList'

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
