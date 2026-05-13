import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import '../../styles/Arrendatario.css'

const VerificacionExitosa = () => {
  const navigate = useNavigate()

  return (
    <div className="atr-page">
      <NavbarArrendatario />

      <div className="atr-verify-wrapper">
        <div className="atr-verify-card atr-verify-card-success">
          
          {/* Header */}
          <div className="atr-verify-header atr-verify-header-success">
            <div className="atr-verify-header-icon">🎉</div>
            <div className="atr-verify-header-title">¡Identidad verificada!</div>
            <div className="atr-verify-header-sub">
              Tu cuenta ahora tiene acceso completo
            </div>
          </div>

          <div className="atr-verify-body">
            
            <div className="atr-alert atr-alert-success" style={{ marginBottom: '1.5rem' }}>
              <div className="atr-alert-icon">✅</div>
              <div className="atr-alert-body">
                <div className="atr-alert-title">¡Felicidades!</div>
                <div className="atr-alert-desc">
                  Tu constancia fue validada exitosamente. Ya tienes acceso completo a la plataforma RentIPN.
                </div>
              </div>
            </div>

            <div className="atr-btn-group">
              <button
                onClick={() => navigate('/arrendatario/buscar-vivienda')}
                className="atr-btn-primary"
                style={{ background: '#16A34A', boxShadow: '0 4px 16px rgba(22,163,74,0.25)' }}
              >
                🏠 Buscar vivienda
              </button>
              <button
                onClick={() => navigate('/arrendatario/mi-arrendamiento')}
                className="atr-btn-ghost"
              >
                Ver mi arrendamiento
              </button>
            </div>

          </div>
        </div>
      </div>

      <FooterInicio />
    </div>
  )
}

export default VerificacionExitosa