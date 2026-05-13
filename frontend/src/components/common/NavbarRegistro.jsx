import React from 'react'
import { Link } from 'react-router-dom'
import burroLogo from '../../assets/burro.png'
import '../../styles/Registro.css'

const NavbarRegistro = () => {
  return (
    <nav className="registro-nav">
      <Link to="/" className="registro-nav-brand">
        <img src={burroLogo} alt="RentIPN" />
        <span>RentIPN</span>
      </Link>
      <Link to="/usuarios/inicio-sesion" className="registro-nav-login">
        Iniciar Sesión
      </Link>
    </nav>
  )
}

export default NavbarRegistro