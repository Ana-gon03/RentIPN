import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import SubirDocumento from '../../components/ui/SubirDocumento'
import { API_URL } from '../../config'

const RenovarIdentidad = () => {
  const navigate = useNavigate()
  const [constanciaFile, setConstanciaFile] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [erroresDetalle, setErroresDetalle] = useState([])

  const handleEnviar = async () => {
    if (!constanciaFile) {
      setError('Debes seleccionar tu constancia en PDF')
      return
    }

    const userId = localStorage.getItem('userId')
    if (!userId) {
      navigate('/usuarios/inicio-sesion')
      return
    }

    try {
      setEnviando(true)
      setError(null)
      setErroresDetalle([])

      const fd = new FormData()
      fd.append('userId', userId)
      fd.append('constancia', constanciaFile)

      const response = await fetch(`${API_URL}/auth/renovar-identidad`, {
        method: 'POST',
        body: fd
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al renovar')
        if (data.detalles) setErroresDetalle(data.detalles)
        return
      }

      // Actualizar localStorage
      localStorage.setItem('arrendatarioVerificado', 'true')
      localStorage.setItem('arrendatarioFechaVerificacion', new Date().toISOString())

      navigate('/arrendatario/verificacion-exitosa', {
        state: { esRenovacion: true }
      })

    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <NavbarArrendatario />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 20px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '2px solid #e65100',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>

            {/* Header naranja */}
            <div style={{ backgroundColor: '#e65100', padding: '25px 30px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>🔄</p>
              <h1 style={{ color: 'white', fontSize: '20px', margin: '0 0 5px 0', fontWeight: 'bold' }}>
                Renovar verificación
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', margin: 0 }}>
                Tu verificación expiró. Sube tu constancia vigente para renovarla.
              </p>
            </div>

            <div style={{ padding: '30px' }}>

              {/* Aviso de expiración */}
              <div style={{
                backgroundColor: '#fff3e0',
                border: '1px solid #ffb74d',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#e65100', lineHeight: '1.5' }}>
                  ⚠️ <strong>Tu verificación expiró</strong>. Por seguridad, las verificaciones duran 6 meses. 
                  Sube tu constancia más reciente para renovarla y seguir viendo los datos de contacto de los arrendadores.
                </p>
              </div>

              {/* Instrucciones */}
              <div style={{
                backgroundColor: '#e8eaf6',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '25px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: '#1a237e' }}>
                  📋 Requisitos del documento:
                </p>
                {[
                  'Debe ser tu constancia de estudios vigente del IPN',
                  'Formato PDF únicamente',
                  'El código QR debe ser legible y estar vigente',
                  'Los datos deben coincidir exactamente con tu registro'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                    <span style={{ color: '#28a745', flexShrink: 0, fontSize: '13px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#555' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Subir documento */}
              <SubirDocumento
                tipo="constancia"
                onFileSelect={(file) => { setConstanciaFile(file); setError(null); setErroresDetalle([]) }}
                file={constanciaFile}
                setFile={setConstanciaFile}
                required={false}
                label="Constancia de Estudios (PDF)"
              />

              {/* Errores */}
              {error && (
                <div style={{
                  backgroundColor: '#ffebee',
                  border: '1px solid #ef9a9a',
                  borderRadius: '6px',
                  padding: '12px 15px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#c62828', fontWeight: 'bold' }}>
                    ❌ {error}
                  </p>
                  {erroresDetalle.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {erroresDetalle.map((e, i) => (
                        <li key={i} style={{ fontSize: '12px', color: '#c62828' }}>{e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Botones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleEnviar}
                  disabled={enviando || !constanciaFile}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: enviando || !constanciaFile ? '#ccc' : '#e65100',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: enviando || !constanciaFile ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    fontWeight: 'bold'
                  }}
                >
                  {enviando ? '⏳ Verificando documento...' : '🔄 Renovar verificación'}
                </button>
                <button
                  onClick={() => navigate('/arrendatario/buscar-vivienda')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'white',
                    color: '#555',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Volver
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <FooterInicio />
    </div>
  )
}

export default RenovarIdentidad