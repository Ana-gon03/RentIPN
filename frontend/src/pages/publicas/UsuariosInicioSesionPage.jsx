import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import NavbarSimple from '../../components/common/NavbarSimple'  // ← Cambia a NavbarSimple
import FooterInicio from '../../components/common/FooterInicio'
import { loginUsuario, reenviarCodigo } from '../../services/authService'
import '../../styles/Login.css'
import burroLogo from '../../assets/burro.png'

const UsuariosInicioSesionPage = () => {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

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

    return (
    <div className="login-page">
      <NavbarSimple />
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
              <div className="login-icon">
                <img 
                  src={burroLogo} 
                  alt="Burroomies" 
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
                {cargando ? 'Ingresando...' : 'Iniciar Sesión →'}
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
      
      <FooterInicio />
    </div>
  )
}

export default UsuariosInicioSesionPage