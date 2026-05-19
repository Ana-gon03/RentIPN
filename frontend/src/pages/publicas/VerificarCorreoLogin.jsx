import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavbarSimple from '../../components/common/NavbarSimple'
import FooterInicio from '../../components/common/FooterInicio'
import { verificarCodigoLogin, reenviarCodigo } from '../../services/authService'
import '../../styles/VerificarCorreo.css'

const VerificarCorreoLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { correo, userId, rol, arrendadorId, arrendatarioId, fechaRegistro, arrendatarioVerificado } = location.state || {}

  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  const [tiempoReenvio, setTiempoReenvio] = useState(60)

  useEffect(() => {
    if (!correo) navigate('/usuarios/inicio-sesion')
  }, [correo, navigate])

  useEffect(() => {
    if (tiempoReenvio <= 0) return
    const timer = setTimeout(() => setTiempoReenvio(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [tiempoReenvio])

  if (!correo) return null

  const handleVerificar = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (codigo.length !== 8) {
      setError('El código debe tener 8 dígitos')
      return
    }

    setCargando(true)
    try {
      await verificarCodigoLogin(correo, codigo)

      localStorage.setItem('correoVerificado', '1')
      setExito(true)
      setMensaje('¡Correo verificado! Redirigiendo...')

      setTimeout(() => {
        if (rol === 'arrendador') {
          navigate('/arrendador/mis-arrendamientos')
        } else if (arrendatarioVerificado) {
          navigate('/arrendatario/buscar-vivienda')
        } else {
          navigate('/verificar-expiracion', { state: { userId } })
        }
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Código incorrecto o expirado')
    } finally {
      setCargando(false)
    }
  }

  const handleReenviar = async () => {
    setCargando(true)
    setError('')
    setMensaje('')
    try {
      await reenviarCodigo(correo)
      setMensaje('Código reenviado. Revisa tu correo.')
      setTiempoReenvio(60)
      setCodigo('')
    } catch (err) {
      setError('Error al reenviar el código. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="verificar-page">
      <NavbarSimple />

      <div className="verificar-container">
        <div className="verificar-card">
          <div className="verificar-header">
            <div className="verificar-icon">{exito ? '✅' : '📧'}</div>
            <h2>{exito ? '¡Verificado!' : 'Verifica tu correo'}</h2>
            <p>
              {exito
                ? 'Redirigiendo a tu cuenta...'
                : `Ingresa el código que enviamos a ${correo}`}
            </p>
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

            {!exito && (
              <form onSubmit={handleVerificar}>
                <div className="verificar-code-group">
                  <label className="verificar-code-label">Código de verificación (8 dígitos)</label>
                  <input
                    type="text"
                    className="verificar-code-input"
                    value={codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))
                      setError('')
                    }}
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
                  onClick={handleReenviar}
                  disabled={cargando || tiempoReenvio > 0}
                >
                  {tiempoReenvio > 0
                    ? `Reenviar código en ${tiempoReenvio}s`
                    : 'Reenviar código'}
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

export default VerificarCorreoLogin
