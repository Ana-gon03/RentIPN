import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'

const VerificacionExitosa = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const esRenovacion = location.state?.esRenovacion || false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarArrendatario />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px 30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}>
          <p style={{ fontSize: '60px', marginBottom: '20px' }}>
            {esRenovacion ? '🔄' : '✅'}
          </p>
          
          <h1 style={{ 
            fontSize: '22px', 
            color: esRenovacion ? '#e65100' : '#28a745',
            marginBottom: '15px'
          }}>
            {esRenovacion ? '¡Verificación renovada!' : '¡Verificación exitosa!'}
          </h1>
          
          <p style={{ 
            color: '#666', 
            fontSize: '14px', 
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            {esRenovacion 
              ? 'Tu verificación ha sido renovada por 6 meses más. Ya puedes ver los datos de contacto de los arrendadores.'
              : 'Tu identidad ha sido verificada correctamente. Ahora puedes ver los datos de contacto de los arrendadores.'
            }
          </p>

          <button
            onClick={() => navigate('/arrendatario/buscar-vivienda')}
            style={{
              padding: '14px 40px',
              backgroundColor: esRenovacion ? '#e65100' : '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 'bold'
            }}
          >
            🔍 Buscar vivienda
          </button>
        </div>
      </div>

      <FooterInicio />
    </div>
  )
}

export default VerificacionExitosa