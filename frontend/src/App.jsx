import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas públicas
import HomePage from './pages/publicas/HomePage'
import RegistroUsuarioPage from './pages/publicas/RegistroUsuarioPage'
import UsuariosInicioSesionPage from './pages/publicas/UsuariosInicioSesionPage'
import VerificarCorreoPage from './pages/publicas/VerificarCorreoPage'
import Bienvenidapage from './pages/publicas/Bienvenidapage'
import AvisoPrivacidadPage from './pages/publicas/AvisoPrivacidadPage'
import TerminosUsoPage from './pages/publicas/TerminosUsoPage'
import FaqPage from './pages/publicas/FaqPage'


// Páginas de admin
import AdminInicioSesionPage from './pages/admin/AdminInicioSesionPage'
import AdminArrendatariosPage from './pages/admin/AdminArrendatariosPage'
import AdminArrendadoresPage from './pages/admin/AdminArrendadoresPage'
import AdminPropiedadesPage from './pages/admin/AdminPropiedadesPage'
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/registro" element={<RegistroUsuarioPage />} />
        <Route path="/usuarios/inicio-sesion" element={<UsuariosInicioSesionPage />} />
        <Route path="/verificar-correo" element={<VerificarCorreoPage />} />
        <Route path="/bienvenida" element={<Bienvenidapage />} />
        <Route path="/legal/aviso-privacidad" element={<AvisoPrivacidadPage />} />
        <Route path="/legal/terminos-uso" element={<TerminosUsoPage />} />  
        <Route path="/faq" element={<FaqPage />} />
        
        {/* Rutas de admin */}
        <Route path="/admin/inicio-sesion" element={<AdminInicioSesionPage />} />
        <Route path="/admin/arrendatarios" element={
          <ProtectedAdminRoute>
            <AdminArrendatariosPage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/arrendadores" element={
          <ProtectedAdminRoute>
            <AdminArrendadoresPage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/propiedades" element={
          <ProtectedAdminRoute>
            <AdminPropiedadesPage />
          </ProtectedAdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App