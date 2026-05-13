import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../../assets/burro.png'
import '../../styles/Arrendatario.css'

const NavbarArrendatario = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleCerrarSesion = () => {
    localStorage.clear()
    navigate('/')
  }

  const nombre = localStorage.getItem('usuarioNom') || 'Estudiante'

  return (
    <nav className="atr-nav">
      <div className="atr-nav-inner">
        <Link to="/arrendatario/buscar-vivienda" className="atr-nav-brand">
          <img src={logoImg} alt="RentIPN" className="atr-nav-logo" />
          <span className="atr-nav-brand-name">RentIPN</span>
        </Link>

        <div className="atr-nav-links">
          <Link
            to="/arrendatario/buscar-vivienda"
            className={`atr-nav-link${isActive('/arrendatario/buscar-vivienda') ? ' active' : ''}`}
          >
            🔍 Buscar Vivienda
          </Link>
          <Link
            to="/arrendatario/mi-arrendamiento"
            className={`atr-nav-link${isActive('/arrendatario/mi-arrendamiento') ? ' active' : ''}`}
          >
            📋 Mi Arrendamiento
          </Link>
        </div>

        <div className="atr-nav-right">
          <Link to="/arrendatario/perfil" className="atr-nav-profile">
            <div className="atr-nav-avatar">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <span className="atr-nav-profile-name">Mi Perfil</span>
          </Link>
          <button className="atr-nav-logout" onClick={handleCerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavbarArrendatario