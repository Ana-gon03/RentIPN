import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavbarSimple from '../../components/common/NavbarSimple'
import FooterInicio from '../../components/common/FooterInicio'
import '../../styles/VerificarCorreo.css'

const RestablecerPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const correo = location.state?.correo || ''

  const [paso, setPaso] = useState(1)
  const [codigo, setCodigo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  const [tiempoReenvio, setTiempoReenvio] = useState(60)

  if (!correo) {
    navigate('/usuarios/inicio-sesion')
    return null
  }

  useEffect(() => {
    if (tiempoReenvio <= 0) return
    const timer = setTimeout(() => setTiempoReenvio(tiempoReenvio - 1), 1000)
    return () => clearTimeout(timer)
  }, [tiempoReenvio])

  const handleVerificarCodigo = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (codigo.length !== 8) {
      setError('El código debe tener 8 dígitos')
      return
    }

    setCargando(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/verificar-codigo-recuperacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigo })
      })

      const data = await response.json()

      if (response.ok) {
        setMensaje('Código verificado correctamente')
        setPaso(2)
      } else {
        setError(data.error || 'Código incorrecto')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleRestablecerPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    
    if (!pwRegex.test(nuevaPassword)) {
      setError('La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo')
      return
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/restablecer-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigo, nuevaPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setMensaje('¡Contraseña restablecida! Redirigiendo...')
        setExito(true)
        setTimeout(() => {
          navigate('/usuarios/inicio-sesion')
        }, 3000)
      } else {
        setError(data.error || 'Error al restablecer')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleReenviarCodigo = async () => {
    setCargando(true)
    setError('')
    setMensaje('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      })

      const data = await response.json()

      if (response.ok) {
        setMensaje('Código reenviado. Revisa tu correo.')
        setTiempoReenvio(60)
        setCodigo('')
      } else {
        setError(data.error || 'Error al reenviar')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  const getHeaderIcon = () => {
    if (exito) return '✅'
    if (paso === 1) return '🔐'
    return '🔒'
  }

  const getHeaderTitle = () => {
    if (exito) return '¡Contraseña restablecida!'
    if (paso === 1) return 'Verifica tu código'
    return 'Nueva contraseña'
  }

  const getHeaderSub = () => {
    if (exito) return 'Serás redirigido al inicio de sesión...'
    if (paso === 1) return `Ingresa el código que enviamos a ${correo}`
    return 'Crea una contraseña segura para tu cuenta'
  }

  return (
    <div className="verificar-page">
      <NavbarSimple />
      
      <div className="verificar-container">
        <div className="verificar-card">
          <div className="verificar-header">
            <div className="verificar-icon">{getHeaderIcon()}</div>
            <h2>{getHeaderTitle()}</h2>
            <p>{getHeaderSub()}</p>
          </div>
          
          <div className="verificar-body">

            {error && (
              <div className="verificar-error">
                <span>⚠️</span> {error}
              </div>
            )}
            {mensaje && (
              <div className="verificar-success">
                <span>✓</span> {mensaje}
              </div>
            )}

            {/* PASO 1: Ingresar código */}
            {!exito && paso === 1 && (
              <form onSubmit={handleVerificarCodigo}>
                <div className="verificar-code-group">
                  <label className="verificar-code-label">Código de verificación (8 dígitos)</label>
                  <input
                    type="text"
                    className="verificar-code-input"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                    placeholder="12345678"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="verificar-btn verificar-btn-primary"
                  disabled={cargando || codigo.length !== 8}
                >
                  {cargando ? 'Verificando...' : 'Verificar Código →'}
                </button>

                <button
                  type="button"
                  className="verificar-btn verificar-btn-secondary"
                  onClick={handleReenviarCodigo}
                  disabled={cargando || tiempoReenvio > 0}
                >
                  {tiempoReenvio > 0
                    ? `Reenviar código en ${tiempoReenvio}s`
                    : 'Reenviar código'}
                </button>
              </form>
            )}

            {/* PASO 2: Nueva contraseña */}
            {!exito && paso === 2 && (
              <form onSubmit={handleRestablecerPassword}>
                <div className="verificar-code-group">
                  <label className="verificar-code-label">Nueva contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={mostrarPassword ? 'text' : 'password'}
                      className="verificar-code-input"
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      style={{ letterSpacing: 'normal' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        color: '#9ca3af'
                      }}
                    >
                      {mostrarPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="verificar-code-group">
                  <label className="verificar-code-label">Confirmar contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={mostrarPassword ? 'text' : 'password'}
                      className="verificar-code-input"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      placeholder="Repite tu nueva contraseña"
                      style={{ letterSpacing: 'normal' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        color: '#9ca3af'
                      }}
                    >
                      {mostrarPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="verificar-info" style={{ marginBottom: '1.5rem' }}>
                  <label>Requisitos de la contraseña</label>
                  <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un símbolo (@$!%*?&)</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="verificar-btn verificar-btn-primary"
                  disabled={cargando}
                >
                  {cargando ? 'Restableciendo...' : 'Restablecer Contraseña →'}
                </button>
              </form>
            )}

            <div className="verificar-hint">
              <button
                onClick={() => navigate('/usuarios/inicio-sesion')}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ← Volver a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <FooterInicio />
    </div>
  )
}

export default RestablecerPasswordPage