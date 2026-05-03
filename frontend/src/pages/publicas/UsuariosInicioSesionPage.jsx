import React from 'react'
import NavbarInicio from '../../components/common/NavbarInicio'
import FooterInicio from '../../components/common/FooterInicio'

const UsuariosInicioSesionPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarInicio />
      <main style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
        <h1>Iniciar Sesión - Usuarios</h1>
        <p>Formulario de inicio de sesión para arrendadores y arrendatarios próximamente...</p>
      </main>
      <FooterInicio />
    </div>
  )
}

export default UsuariosInicioSesionPage