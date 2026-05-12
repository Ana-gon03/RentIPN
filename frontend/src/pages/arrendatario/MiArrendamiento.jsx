import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import '../../styles/Arrendatario.css'

const MiArrendamiento = () => {
  const navigate = useNavigate()
  const [arrendamiento, setArrendamiento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [esperandoArrendador, setEsperandoArrendador] = useState(false)

  useEffect(() => {
    cargarArrendamiento()
  }, [])

  const cargarArrendamiento = async () => {
    try {
      setLoading(true)
      
      const userId = localStorage.getItem('userId')
      const arrendatarioVerificado = localStorage.getItem('arrendatarioVerificado')
      
      if (arrendatarioVerificado === 'false' || arrendatarioVerificado === '0') {
        navigate('/arrendatario/verificacion-pendiente')
        return
      }
      
      const arrendatarioId = localStorage.getItem('arrendatarioId')
      
      if (!userId) {
        setError('No has iniciado sesión')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:5000/api/arrendamientos/mi-arrendamiento', {
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId,
          'x-arrendatario-id': arrendatarioId
        }
      })

      if (response.status === 404) {
        setArrendamiento(null)
        setLoading(false)
        return
      }

      if (!response.ok) throw new Error('Error al cargar')

      const data = await response.json()
      setArrendamiento(data)
      
      if (data.arrendamientoValEstudiante === 1) {
        setEsperandoArrendador(true)
      }
    } catch (error) {
      setError('No se pudo cargar tu arrendamiento')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizarClick = () => {
    setMostrarModal(true)
  }

  const handleConfirmarFinalizar = () => {
    setMostrarModal(false)
    navigate(`/arrendatario/encuesta-finalizacion/${arrendamiento.idArrendamiento}`)
  }

  const handleDescargarContrato = () => {
    window.open(`http://localhost:5000/api/arrendamientos/${arrendamiento.idArrendamiento}/pdf`, '_blank')
  }

  const propiedad = arrendamiento?.propiedad
  const arrendador = propiedad?.arrendador?.usuario
  const nombreArrendador = arrendador 
    ? `${arrendador.usuarioNom} ${arrendador.usuarioApePat} ${arrendador.usuarioApeMat || ''}`.trim()
    : 'No disponible'
  
  const primeraFoto = propiedad?.fotos?.[0]?.fotosURL || null

  if (loading) {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-main">
          <div className="atr-loading">
            <p>Cargando arrendamiento...</p>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  return (
    <div className="atr-page">
      <NavbarArrendatario />

      <div className="atr-main">
        <h1 className="atr-page-title">📋 Mi Arrendamiento</h1>

        {/* MENSAJE DE ESPERA */}
        {esperandoArrendador && (
          <div className="atr-alert atr-alert-warning">
            <div className="atr-alert-icon">⏳</div>
            <div className="atr-alert-body">
              <div className="atr-alert-title">Esperando confirmación del arrendador</div>
              <div className="atr-alert-desc">
                Ya has finalizado tu parte. El contrato seguirá disponible hasta que el arrendador confirme.
              </div>
            </div>
          </div>
        )}

        {/* SIN ARRENDAMIENTO */}
        {!loading && !error && !arrendamiento && (
          <div className="atr-empty">
            <div className="atr-empty-icon">🏠</div>
            <div className="atr-empty-title">No tienes un arrendamiento activo</div>
            <div className="atr-empty-sub">
              Cuando un arrendador te asigne una propiedad, aparecerá aquí.
            </div>
            <div className="atr-btn-group">
              <button 
                onClick={() => navigate('/arrendatario/buscar-vivienda')}
                className="atr-btn-primary"
              >
                🔍 Buscar Vivienda
              </button>
            </div>
          </div>
        )}

        {/* CON ARRENDAMIENTO ACTIVO */}
        {arrendamiento && (
          <>
            {/* Tarjeta de la propiedad */}
            <div className="atr-card">
              {/* Imagen */}
              <div className="atr-card-hero">
                {primeraFoto ? (
                  <img 
                    src={`http://localhost:5000${primeraFoto}`}
                    alt={propiedad?.propiedadTitulo}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="atr-card-hero-placeholder">🏠</div>
                )}
                <div className="atr-card-hero-badge atr-card-hero-badge-active">
                  ✅ Activo
                </div>
              </div>

              <div className="atr-card-body">
                {/* Título y precio */}
                <div className="atr-card-header">
                  <div>
                    <div className="atr-card-title">
                      {propiedad?.propiedadTitulo || 'Propiedad'}
                    </div>
                    <div className="atr-card-subtitle">
                      {propiedad?.propiedadTipo} · {propiedad?.direccion?.colonia}
                    </div>
                  </div>
                  <div className="atr-card-price">
                    ${arrendamiento.arrendamientoRenta?.toLocaleString('es-MX') || '0'}
                    <div className="atr-card-price-label">MXN / mes</div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="atr-card-desc">
                  {propiedad?.propiedadDescripcion || 'Sin descripción'}
                </div>

                {/* Botón descargar contrato */}
                <button 
                  onClick={handleDescargarContrato}
                  className="atr-btn-primary"
                  style={{ marginBottom: '1.25rem' }}
                >
                  📄 Descargar Contrato
                </button>

                <hr className="atr-divider" />

                {/* Información del arrendador */}
                <div className="atr-section-title">👤 Arrendador</div>
                
                <div className="atr-landlord-row">
                  <div className="atr-landlord-avatar">
                    {nombreArrendador.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="atr-landlord-name">{nombreArrendador}</div>
                  </div>
                </div>

                <div className="atr-contact-list">
                  <div className="atr-contact-item">
                    📧 Correo: {arrendador?.usuarioCorreo || 'No disponible'}
                  </div>
                  <div className="atr-contact-item">
                    📞 Teléfono: {arrendador?.usuarioTel || 'No disponible'}
                  </div>
                </div>
              </div>
            </div>

            {/* Botón finalizar arrendamiento */}
            {!esperandoArrendador && (
              <button 
                onClick={handleFinalizarClick}
                className="atr-btn-danger"
              >
                ⚠️ Finalizar Arrendamiento
              </button>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <div className="atr-alert atr-alert-error">
            <div className="atr-alert-icon">⚠️</div>
            <div className="atr-alert-body">
              <div className="atr-alert-title">Error</div>
              <div className="atr-alert-desc">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div className="atr-modal-overlay">
          <div className="atr-modal">
            <div className="atr-modal-icon">⚠️</div>
            <div className="atr-modal-title">¿Finalizar arrendamiento?</div>
            <div className="atr-modal-desc">
              Esta acción no se puede deshacer. Para finalizar deberás contestar una breve encuesta sobre tu experiencia.
            </div>
            <div className="atr-modal-warning">
              ¿Estás seguro de continuar?
            </div>
            <div className="atr-modal-actions">
              <button 
                onClick={() => setMostrarModal(false)}
                className="atr-btn-ghost"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarFinalizar}
                className="atr-btn-danger"
              >
                Sí, finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterInicio />
    </div>
  )
}

export default MiArrendamiento