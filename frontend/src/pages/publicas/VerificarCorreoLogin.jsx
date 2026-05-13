import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavbarSimple from '../../components/common/NavbarRegistro'
import FooterInicio from '../../components/common/FooterInicio'
import { verificarCodigoLogin, reenviarCodigo, actualizarCorreo, validarCampo } from '../../services/authService'
import '../../styles/VerificarCorreo.css'

const VerificarCorreoLogin = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [userId, setUserId] = useState(null)
  const [rol, setRol] = useState(null)
  const [arrendadorId, setArrendadorId] = useState(null)
  const [arrendatarioId, setArrendatarioId] = useState(null)
  const [fechaRegistro, setFechaRegistro] = useState(null)
  const [arrendatarioVerificadoInicial, setArrendatarioVerificadoInicial] = useState(null)

  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [tiempoReenvio, setTiempoReenvio] = useState(60)

  const [modoEdicion, setModoEdicion] = useState(false)
  const [nuevoCorreo, setNuevoCorreo] = useState('')

  useEffect(() => {
    const state = location.state
    if (!state?.correo) {
      navigate('/usuarios/inicio-sesion')
      return
    }
    setCorreo(state.correo)
    setNuevoCorreo(state.correo)
    setUserId(state.userId)
    setRol(state.rol)
    setArrendadorId(state.arrendadorId || null)
    setArrendatarioId(state.arrendatarioId || null)
    setFechaRegistro(state.fechaRegistro || null)
    setArrendatarioVerificadoInicial(state.arrendatarioVerificado ?? null)
  }, [location, navigate])

  useEffect(() => {
    if (tiempoReenvio <= 0) return
    const timer = setTimeout(() => setTiempoReenvio(tiempoReenvio - 1), 1000)
    return () => clearTimeout(timer)
  }, [tiempoReenvio])

  const handleVerificar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    setMensaje('')
    try {
      const data = await verificarCodigoLogin(correo, codigo)
      setMensaje('¡Correo verificado! Redirigiendo...')
      setTimeout(() => {
        if (rol === 'arrendador') {
          localStorage.setItem('correoVerificado', '1')
          localStorage.setItem('userId', userId)
          localStorage.setItem('rol', rol)
          localStorage.setItem('arrendadorId', arrendadorId)
          navigate('/arrendador/mis-arrendamientos')
          return
        }
        if (rol === 'arrendatario') {
          const verificadoIdentidad = data.arrendatarioVerificado === 1 || arrendatarioVerificadoInicial === 1
          if (verificadoIdentidad) {
            navigate('/arrendatario/buscar-vivienda')
            return
          }
          navigate('/verificar-expiracion', { state: { userId } })
        }
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al verificar el código')
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
      setError(err.response?.data?.error || 'Error al reenviar el código')
    } finally {
      setCargando(false)
    }
  }

  const handleActualizarCorreo = async (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (!nuevoCorreo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoCorreo)) {
      setError('Ingresa un correo electrónico válido')
      return
    }

    setCargando(true)
    try {
      const resultado = await validarCampo('correo', nuevoCorreo)
      if (resultado.existe) {
        setError('Este correo ya está registrado por otra cuenta')
        setCargando(false)
        return
      }
      await actualizarCorreo(correo, nuevoCorreo)
      setCorreo(nuevoCorreo)
      setModoEdicion(false)
      setTiempoReenvio(0)
      setCodigo('')
      setMensaje('Correo actualizado. Se envió un nuevo código.')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el correo')
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
            <div className="verificar-icon">🔐</div>
            <h2>Verifica tu correo</h2>
            <p>Ingresa el código que enviamos para continuar</p>
          </div>
          
          <div className="verificar-body">
            <div className="verificar-info">
              <label>Correo registrado</label>
              <div className="verificar-email">{correo}</div>
              {!modoEdicion ? (
                <button
                  type="button"
                  className="verificar-update-btn"
                  onClick={() => { setModoEdicion(true); setError(''); setMensaje('') }}
                >
                  ¿Correo incorrecto? Actualizar →
                </button>
              ) : (
                <form onSubmit={handleActualizarCorreo} className="verificar-update-form">
                  <input
                    type="email"
                    className="verificar-input"
                    value={nuevoCorreo}
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                    placeholder="Ingresa tu correo correcto"
                    required
                  />
                  <div className="verificar-button-group">
                    <button type="submit" className="verificar-btn-primary-small" disabled={cargando}>
                      {cargando ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <button
                      type="button"
                      className="verificar-btn-secondary-small"
                      onClick={() => { setModoEdicion(false); setNuevoCorreo(correo); setError('') }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <form onSubmit={handleVerificar}>
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

              <button
                type="submit"
                className="verificar-btn verificar-btn-primary"
                disabled={cargando || codigo.length !== 8}
              >
                {cargando ? 'Verificando...' : 'Verificar Código'}
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

            <div className="verificar-hint">
              Revisa tu bandeja de entrada y spam. El código expira en 24 horas.
            </div>
          </div>
        </div>
      </div>
      
      <FooterInicio />
    </div>
  )
}

export default VerificarCorreoLogin