import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import NavbarInicio from '../../components/common/NavbarInicio'
import FooterInicio from '../../components/common/FooterInicio'
import { loginUsuario, reenviarCodigo } from '../../services/authService'

const UsuariosInicioSesionPage = () => {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  // Estados para recuperar contraseña
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

      // ── ARRENDADOR ──────────────────────────────────────────────
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

      // ── ARRENDATARIO ─────────────────────────────────────────────
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

  // ============ RECUPERAR CONTRASEÑA ============
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
      const response = await fetch('http://localhost:5000/api/auth/recuperar-password', {
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarInicio />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Correo electrónico</label><br />
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label>Contraseña</label><br />
              <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  style={{ width: '100%', padding: '0.5rem', paddingRight: '40px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '5px'
                  }}
                  title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Link de recuperar contraseña */}
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
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
                  color: '#1a237e',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                cursor: cargando ? 'not-allowed' : 'pointer',
                backgroundColor: '#1a237e',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </main>

      {/* ===== MODAL RECUPERAR CONTRASEÑA ===== */}
      {mostrarRecuperar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ fontSize: '40px', marginBottom: '10px' }}>🔑</p>
              <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px' }}>
                Recuperar Contraseña
              </h3>
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {/* Mensaje de éxito */}
            {mensajeRecuperar && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                ✅ {mensajeRecuperar}
              </div>
            )}

            {/* Mensaje de error */}
            {errorRecuperar && (
              <div style={{
                padding: '12px',
                backgroundColor: '#ffebee',
                color: '#c62828',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '13px'
              }}>
                ❌ {errorRecuperar}
              </div>
            )}

            {/* Formulario */}
            {!mensajeRecuperar && (
              <form onSubmit={handleRecuperarPassword}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correoRecuperar}
                    onChange={(e) => {
                      setCorreoRecuperar(e.target.value)
                      setErrorRecuperar('')
                    }}
                    placeholder="correo@ejemplo.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box'
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
                      padding: '10px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviandoRecuperar}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: enviandoRecuperar ? '#ccc' : '#1a237e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: enviandoRecuperar ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {enviandoRecuperar ? '⏳ Enviando...' : '📧 Enviar enlace'}
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