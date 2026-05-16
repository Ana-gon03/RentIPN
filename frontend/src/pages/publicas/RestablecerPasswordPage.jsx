import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavbarInicio from '../../components/common/NavbarInicio'
import FooterInicio from '../../components/common/FooterInicio'

const RestablecerPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const correo = location.state?.correo || ''

  // Paso 1: Ingresar código
  // Paso 2: Ingresar nueva contraseña
  const [paso, setPaso] = useState(1)
  
  const [codigo, setCodigo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  // Si no hay correo, redirigir al login
  if (!correo) {
    navigate('/usuarios/inicio-sesion')
    return null
  }

  const handleVerificarCodigo = async (e) => {
    e.preventDefault()
    setError('')

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

    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      })

      const data = await response.json()

      if (response.ok) {
        setError('')
        alert('Código reenviado a tu correo')
      } else {
        setError(data.error || 'Error al reenviar')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarInicio />
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '430px',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '35px 30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <p style={{ fontSize: '48px', marginBottom: '10px' }}>
              {exito ? '✅' : paso === 1 ? '📧' : '🔐'}
            </p>
            <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '20px' }}>
              {exito 
                ? '¡Contraseña restablecida!' 
                : paso === 1 
                  ? 'Verificar código' 
                  : 'Nueva contraseña'
              }
            </h2>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              {exito 
                ? 'Serás redirigido al inicio de sesión...' 
                : paso === 1 
                  ? `Enviamos un código de 8 dígitos a ${correo}`
                  : 'Ingresa tu nueva contraseña'
              }
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '13px'
            }}>
              ❌ {error}
            </div>
          )}

          {/* PASO 1: Ingresar código */}
          {!exito && paso === 1 && (
            <form onSubmit={handleVerificarCodigo}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '').slice(0, 8)
                    setCodigo(valor)
                    setError('')
                  }}
                  placeholder="00000000"
                  maxLength={8}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    fontSize: '24px',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontWeight: 'bold',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={cargando || codigo.length !== 8}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: cargando || codigo.length !== 8 ? '#ccc' : '#1a237e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: cargando || codigo.length !== 8 ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}
              >
                {cargando ? '⏳ Verificando...' : '✅ Verificar código'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleReenviarCodigo}
                  disabled={cargando}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1a237e',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  📧 Reenviar código
                </button>
              </div>
            </form>
          )}

          {/* PASO 2: Nueva contraseña */}
          {!exito && paso === 2 && (
            <form onSubmit={handleRestablecerPassword}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '5px', 
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Nueva contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '5px'
                    }}
                  >
                    {mostrarPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: 'bold', 
                  marginBottom: '5px', 
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Confirmar contraseña
                </label>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
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

              {/* Requisitos de contraseña */}
                <div style={{ 
                marginBottom: '20px',
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px'
                }}>
                <p style={{ 
                    margin: 0, 
                    fontSize: '12px', 
                    color: '#666',
                    lineHeight: '1.6'
                }}>
                    🔒 La contraseña debe tener mínimo 8 caracteres e incluir:
                </p>
                <ul style={{ 
                    margin: '8px 0 0 0', 
                    paddingLeft: '20px',
                    fontSize: '12px', 
                    color: '#888'
                }}>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos una letra minúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un símbolo (!$%&/#, etc.)</li>
                </ul>
                </div>

              <button
                type="submit"
                disabled={cargando}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: cargando ? '#ccc' : '#1a237e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: 'bold'
                }}
              >
                {cargando ? '⏳ Restableciendo...' : '🔒 Restablecer Contraseña'}
              </button>
            </form>
          )}

          {/* Botón volver al login */}
          <button
            onClick={() => navigate('/usuarios/inicio-sesion')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '15px'
            }}
          >
            ← Volver a Iniciar Sesión
          </button>
        </div>
      </main>

      <FooterInicio />
    </div>
  )
}

export default RestablecerPasswordPage