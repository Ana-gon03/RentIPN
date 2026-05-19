import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import NavbarSimple from '../../components/common/NavbarSimple'
import FooterInicio from '../../components/common/FooterInicio'
import { loginUsuario, reenviarCodigo } from '../../services/authService'
import '../../styles/Login.css'
import burroLogo from '../../assets/burro.png'
import { API_URL } from '../../config'

const UsuariosInicioSesionPage = () => {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  // Estados para recuperar contraseña (funcionalidad de ella)
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false)
  const [correoRecuperar, setCorreoRecuperar] = useState('')
  const [enviandoRecuperar, setEnviandoRecuperar] = useState(false)
  const [mensajeRecuperar, setMensajeRecuperar] = useState('')
  const [errorRecuperar, setErrorRecuperar] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const data = await loginUsuario(correo, password)

      if (data.rol === 'arrendador') {
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('rol', data.rol)
        localStorage.setItem('correo', data.correo)
        localStorage.setItem('arrendadorId', data.arrendadorId)

        if (!data.correoVerificado) {
          await reenviarCodigo(data.correo)
          navigate('/verificar-correo-login', {
            state: {
              correo: data.correo,
              userId: data.userId,
              rol: 'arrendador',
              arrendadorId: data.arrendadorId
            }
          })
          return
        }
        localStorage.setItem('correoVerificado', '1')
        navigate('/arrendador/mis-arrendamientos')
        return
      }

      if (data.rol === 'arrendatario') {
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('rol', data.rol)
        localStorage.setItem('correo', data.correo)
        localStorage.setItem('arrendatarioId', data.arrendatarioId)
        localStorage.setItem('fechaRegistro', data.fechaRegistro)
        localStorage.setItem('arrendatarioVerificado', data.arrendatarioVerificado)
        localStorage.setItem('arrendatarioFechaVerificacion', data.arrendatarioFechaVerificacion || null)

        if (!data.correoVerificado) {
          await reenviarCodigo(data.correo)
          navigate('/verificar-correo-login', {
            state: {
              correo: data.correo,
              userId: data.userId,
              rol: 'arrendatario',
              arrendatarioId: data.arrendatarioId,
              fechaRegistro: data.fechaRegistro,
              arrendatarioVerificado: data.arrendatarioVerificado
            }
          })
          return
        }

        localStorage.setItem('correoVerificado', '1')

        if (data.arrendatarioVerificado) {
          navigate('/arrendatario/buscar-vivienda')
          return
        }

        navigate('/verificar-expiracion', {
          state: { userId: data.userId }
        })
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  // ============ RECUPERAR CONTRASEÑA (funcionalidad de ella) ============
  const handleRecuperarPassword = async (e) => {
    e.preventDefault()

    if (!correoRecuperar.trim()) {
      setErrorRecuperar('Ingresa tu correo electrónico')
      return
    }

    setEnviandoRecuperar(true)
    setErrorRecuperar('')
    setMensajeRecuperar('')

    try {
      const response = await fetch(`${API_URL}/auth/recuperar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correoRecuperar })
      })

      const data = await response.json()

      if (response.ok) {
        setMensajeRecuperar('Código enviado. Redirigiendo...')
        setTimeout(() => {
          setMostrarRecuperar(false)
          navigate('/restablecer-password', {
            state: { correo: correoRecuperar }
          })
        }, 1000)
      } else {
        setErrorRecuperar(data.error || 'Error al enviar el código')
      }
    } catch (err) {
      setErrorRecuperar('Error de conexión. Intenta de nuevo.')
    } finally {
      setEnviandoRecuperar(false)
    }
  }

  return (
    <div className="login-page">
      <NavbarSimple />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <img
                src={burroLogo}
                alt="RentIPN"
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            </div>
            <h2>¡Bienvenido de vuelta!</h2>
            <p>Ingresa tus datos para acceder a tu cuenta</p>
          </div>

          <div className="login-body">
            <form onSubmit={handleSubmit}>
              <div className="login-group">
                <label className="login-label">
                  Correo electrónico <span>*</span>
                </label>
                <div className="login-input-wrapper">
                  <input
                    type="email"
                    className="login-input"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="login-group">
                <label className="login-label">
                  Contraseña <span>*</span>
                </label>
                <div className="login-input-wrapper">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    className="login-input login-input-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {mostrarPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Link de recuperar contraseña - funcionalidad de ella con diseño tuyo */}
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarRecuperar(true)
                      setErrorRecuperar('')
                      setMensajeRecuperar('')
                      setCorreoRecuperar('')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6c63ff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textDecoration: 'underline',
                      padding: 0
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  <span className="login-error-icon">⚠️</span>
                  <span className="login-error-text">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="login-btn"
                disabled={cargando}
              >
                {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>

              <div className="login-divider">
                <div className="login-divider-line"></div>
                <span className="login-divider-text">¿No tienes cuenta?</span>
                <div className="login-divider-line"></div>
              </div>

              <div className="login-register-link">
                <Link to="/registro">Regístrate aquí</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ===== MODAL RECUPERAR CONTRASEÑA (con diseño bonito) ===== */}
      {mostrarRecuperar && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 20px 35px rgba(0,0,0,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f0eef7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <span style={{ fontSize: '30px' }}>🔐</span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1A1633', fontSize: '20px' }}>
                Recuperar Contraseña
              </h3>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
                Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
              </p>
            </div>

            {mensajeRecuperar && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '8px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                ✅ {mensajeRecuperar}
              </div>
            )}

            {errorRecuperar && (
              <div style={{
                padding: '12px',
                backgroundColor: '#ffebee',
                color: '#c62828',
                borderRadius: '8px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '13px'
              }}>
                ❌ {errorRecuperar}
              </div>
            )}

            {!mensajeRecuperar && (
              <form onSubmit={handleRecuperarPassword}>
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px', color: '#333' }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correoRecuperar}
                    onChange={(e) => { setCorreoRecuperar(e.target.value); setErrorRecuperar('') }}
                    placeholder="correo@ejemplo.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setMostrarRecuperar(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8e8e8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviandoRecuperar}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: enviandoRecuperar ? '#ccc' : '#1A1633',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: enviandoRecuperar ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!enviandoRecuperar) e.currentTarget.style.backgroundColor = '#2a2348'
                    }}
                    onMouseLeave={(e) => {
                      if (!enviandoRecuperar) e.currentTarget.style.backgroundColor = '#1A1633'
                    }}
                  >
                    {enviandoRecuperar ? '⏳ Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <FooterInicio />
    </div>
  )
}

export default UsuariosInicioSesionPage
