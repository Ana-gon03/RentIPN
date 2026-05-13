import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../../assets/burro.png'
import '../../styles/Arrendador.css'

const NavbarArrendador = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleCerrarSesion = () => {
    localStorage.clear()
    navigate('/')
  }

  const nombre = localStorage.getItem('usuarioNom') || 'Arrendador'

  return (
    <nav className="arr-nav">
      <div className="arr-nav-inner">
        <Link to="/" className="arr-nav-brand">
          <img src={logoImg} alt="RentIPN" className="arr-nav-logo" />
          <span className="arr-nav-brand-name">RentIPN</span>
        </Link>

        <div className="arr-nav-links">
          <Link
            to="/arrendador/mis-viviendas"
            className={`arr-nav-link${isActive('/arrendador/mis-viviendas') ? ' active' : ''}`}
          >
            🏠 Mis Viviendas
          </Link>
          <Link
            to="/arrendador/mis-arrendamientos"
            className={`arr-nav-link${isActive('/arrendador/mis-arrendamientos') ? ' active' : ''}`}
          >
            📋 Mis Arrendamientos
          </Link>
        </div>

        <div className="arr-nav-right">
          <Link to="/arrendador/perfil" className="arr-nav-profile">
            <div className="arr-nav-avatar">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <span className="arr-nav-profile-name">Mi Perfil</span>
          </Link>
          <button className="arr-nav-logout" onClick={handleCerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavbarArrendador
