import React from 'react'
import { Link } from 'react-router-dom'

const FooterAdmin = () => {
  return (
    <footer style={{
      backgroundColor: '#1a3a4a',
      color: 'white',
      textAlign: 'center',
      padding: '1.25rem 1rem',
      marginTop: 'auto',
    }}>
      <div style={{ marginBottom: '0.6rem', fontSize: '0.9rem', fontWeight: 600 }}>
        Burroomies — Panel de Administración
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.3rem 1.25rem' }}>
        <Link to="/legal/aviso-privacidad" style={{ color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none' }}>
          Aviso de Privacidad
        </Link>
        <span style={{ color: '#475569', fontSize: '0.78rem' }}>·</span>
        <Link to="/legal/terminos-uso" style={{ color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none' }}>
          Términos y Condiciones
        </Link>
        <span style={{ color: '#475569', fontSize: '0.78rem' }}>·</span>
        <a href="mailto:contacto@rentipn.mx" style={{ color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none' }}>
          Contacto
        </a>
      </div>
    </footer>
  )
}

export default FooterAdmin