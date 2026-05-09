import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NavbarAdmin = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminId')
    navigate('/admin/inicio-sesion')
  }

  return (
    <nav style={{
      backgroundColor: '#1a3a4a',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <Link to="/admin/inicio-sesion" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        👑 Admin Burroomies
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/admin/arrendatarios" style={{ color: 'white', textDecoration: 'none' }}>
            🎓 Arrendatarios
        </Link>
        <Link to="/admin/arrendadores" style={{ color: 'white', textDecoration: 'none' }}>
          🏠 Arrendadores
        </Link>
        <Link to="/admin/propiedades" style={{ color: 'white', textDecoration: 'none' }}>
          🏘️ Propiedades
        </Link>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: 'transparent', 
            color: '#ff9999', 
            border: '1px solid #ff9999',
            padding: '0.2rem 0.8rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default NavbarAdmin