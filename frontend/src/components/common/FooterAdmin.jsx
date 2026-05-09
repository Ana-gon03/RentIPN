import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ModalContacto from './ModalContacto'

const FooterAdmin = () => {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <>
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
          <button 
            onClick={() => setModalAbierto(true)}
            style={{ color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Contacto
          </button>
        </div>
      </footer>

      {modalAbierto && <ModalContacto onClose={() => setModalAbierto(false)} />}
    </>
  )
}

export default FooterAdmin