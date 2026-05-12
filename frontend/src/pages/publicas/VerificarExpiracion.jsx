import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FooterInicio from '../../components/common/FooterInicio'
import { verificarExpiracion } from '../../services/authService'
import '../../styles/Arrendatario.css'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'

const VerificarExpiracion = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [estado, setEstado] = useState('cargando')
  const [diasRestantes, setDiasRestantes] = useState(null)

  useEffect(() => {
    const userId = location.state?.userId
    if (!userId) {
      navigate('/usuarios/inicio-sesion')
      return
    }

    const verificar = async () => {
      try {
        const data = await verificarExpiracion(userId)
        if (data.expirado) {
          localStorage.clear()
          setEstado('eliminado')
        } else {
          setDiasRestantes(data.diasRestantes)
          setEstado('activo')
        }
      } catch {
        setEstado('error')
      }
    }

    verificar()
  }, [location, navigate])

  if (estado === 'cargando') {
    return (
      <div className="atr-page">
        <NavbarArrendatario/>
        <div className="atr-verify-wrapper">
          <div className="atr-loading">
            <p>Verificando tu cuenta...</p>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (estado === 'eliminado') {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-verify-wrapper">
          <div className="atr-verify-card atr-verify-card-bordered" style={{ borderColor: '#DC2626' }}>
            <div className="atr-verify-header atr-verify-header-danger">
              <div className="atr-verify-header-icon">❌</div>
              <div className="atr-verify-header-title">Cuenta eliminada</div>
              <div className="atr-verify-header-sub">
                Tu cuenta ha sido eliminada del sistema
              </div>
            </div>
            <div className="atr-verify-body">
              <div className="atr-alert atr-alert-error">
                <div className="atr-alert-icon">⚠️</div>
                <div className="atr-alert-body">
                  <div className="atr-alert-title">No verificaste tu identidad</div>
                  <div className="atr-alert-desc">
                    No cumpliste con verificar tu identidad dentro del plazo de <strong>60 días</strong> desde tu registro.
                  </div>
                </div>
              </div>
              <p style={{ color: '#991B1B', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                Si deseas continuar usando la plataforma, deberás registrarte nuevamente.
              </p>
              <div className="atr-btn-group">
                <button
                  onClick={() => navigate('/registro')}
                  className="atr-btn-primary"
                  style={{ background: '#DC2626', boxShadow: '0 4px 16px rgba(220,38,38,0.25)' }}
                >
                  Registrarme de nuevo
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="atr-btn-ghost"
                >
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (estado === 'activo') {
    const getColorByDays = () => {
      if (diasRestantes <= 10) return '#DC2626'
      if (diasRestantes <= 20) return '#D97706'
      return '#F59E0B'
    }

    const getHeaderClass = () => {
      if (diasRestantes <= 10) return 'atr-verify-header-danger'
      return 'atr-verify-header-warning'
    }

    const getHeaderIcon = () => {
      if (diasRestantes <= 10) return '🚨'
      if (diasRestantes <= 20) return '⚠️'
      return '⏳'
    }

    const getHeaderSub = () => {
      if (diasRestantes <= 10) return '¡Urgente! Tu cuenta está por expirar'
      if (diasRestantes <= 20) return 'Atención: Tu cuenta requiere verificación'
      return 'Verifica tu identidad para usar todas las funciones'
    }

    const color = getColorByDays()
    const headerClass = getHeaderClass()
    const headerIcon = getHeaderIcon()
    const headerSub = getHeaderSub()

    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-verify-wrapper">
          <div className="atr-verify-card">
            <div className={`atr-verify-header ${headerClass}`}>
              <div className="atr-verify-header-icon">{headerIcon}</div>
              <div className="atr-verify-header-title">Cuenta sin verificar</div>
              <div className="atr-verify-header-sub">{headerSub}</div>
            </div>
            <div className="atr-verify-body">
              <div className="atr-days-box" style={{ backgroundColor: '#FFFBEB', border: `1px solid ${color}` }}>
                <div className="atr-days-label">Tiempo restante para verificar</div>
                <div className="atr-days-number" style={{ color }}>
                  {diasRestantes}
                </div>
                <div className="atr-days-unit" style={{ color }}>
                  {diasRestantes === 1 ? 'día' : 'días'}
                </div>
                
                <div className="atr-progress-bar-track">
                  <div 
                    className="atr-progress-bar-fill"
                    style={{ 
                      width: `${((60 - diasRestantes) / 60) * 100}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <div className="atr-progress-labels">
                  <span className="atr-progress-label">Día 0</span>
                  <span className="atr-progress-label">Día 60 (límite)</span>
                </div>
              </div>

              <div className="atr-alert atr-alert-warning" style={{ marginBottom: '1.5rem' }}>
                <div className="atr-alert-icon">⚠️</div>
                <div className="atr-alert-body">
                  <div className="atr-alert-title">¡Verifica tu identidad ahora!</div>
                  <div className="atr-alert-desc">
                    Si no verificas tu identidad en el plazo establecido, tu cuenta será eliminada automáticamente.
                  </div>
                </div>
              </div>

              <div className="atr-btn-group">
                <button
                  onClick={() => navigate('/arrendatario/perfil')}
                  className="atr-btn-primary"
                  style={{ background: '#F59E0B', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}
                >
                  📤 Verificar identidad ahora
                </button>
              </div>
            </div>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (estado === 'error') {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-verify-wrapper">
          <div className="atr-verify-card">
            <div className="atr-verify-header atr-verify-header-danger">
              <div className="atr-verify-header-icon">⚠️</div>
              <div className="atr-verify-header-title">Ocurrió un error</div>
              <div className="atr-verify-header-sub">
                No se pudo verificar el estado de tu cuenta
              </div>
            </div>
            <div className="atr-verify-body">
              <div className="atr-alert atr-alert-error">
                <div className="atr-alert-icon">⚠️</div>
                <div className="atr-alert-body">
                  <div className="atr-alert-title">Error de conexión</div>
                  <div className="atr-alert-desc">
                    Intenta iniciar sesión nuevamente.
                  </div>
                </div>
              </div>
              <div className="atr-btn-group">
                <button
                  onClick={() => navigate('/usuarios/inicio-sesion')}
                  className="atr-btn-primary"
                >
                  Volver al login
                </button>
              </div>
            </div>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  return null
}

export default VerificarExpiracion