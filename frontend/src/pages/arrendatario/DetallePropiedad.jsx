import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerDetallePropiedad } from '../../services/propiedadService'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import '../../styles/Arrendatario.css'

const DetallePropiedad = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [propiedad, setPropiedad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fotoActiva, setFotoActiva] = useState(0)

  useEffect(() => {
    cargarPropiedad()
  }, [id])

  const cargarPropiedad = async () => {
    try {
      setLoading(true)
      const response = await obtenerDetallePropiedad(id)
      if (response.success) {
        setPropiedad(response.data)
      }
    } catch (error) {
      setError('Error al cargar la propiedad')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const serviciosBasicos = propiedad?.servicios?.filter(s => s.servicioCategoria === 'Basico') || []
  const serviciosEntretenimiento = propiedad?.servicios?.filter(s => s.servicioCategoria === 'Entretenimiento') || []
  const serviciosAdicionales = propiedad?.servicios?.filter(s => s.servicioCategoria === 'Adicional') || []

  if (loading) {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-main">
          <div className="atr-loading">
            <p>Cargando propiedad...</p>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (error || !propiedad) {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-main">
          <div className="atr-alert atr-alert-error">
            <div className="atr-alert-icon">⚠️</div>
            <div className="atr-alert-body">
              <div className="atr-alert-title">Error</div>
              <div className="atr-alert-desc">{error || 'Propiedad no encontrada'}</div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/arrendatario/buscar-vivienda')}
            className="atr-btn-ghost"
            style={{ width: 'auto' }}
          >
            ← Volver a resultados
          </button>
        </div>
        <FooterInicio />
      </div>
    )
  }

  return (
    <div className="atr-page">
      <NavbarArrendatario />

      <div className="atr-detail-container">
        {/* Botón volver */}
        <button 
          onClick={() => navigate('/arrendatario/buscar-vivienda')}
          className="atr-btn-back"
        >
          ← Volver a resultados
        </button>

        <div className="atr-detail-grid">
          {/* Columna principal */}
          <div className="atr-detail-main">
            {/* Galería de fotos */}
            <div className="atr-detail-gallery">
              {propiedad.fotos && propiedad.fotos.length > 0 ? (
                <>
                  <div className="atr-gallery-main">
                    <img
                      src={`http://localhost:5000${propiedad.fotos[fotoActiva].fotosURL}`}
                      alt={`Foto ${fotoActiva + 1}`}
                    />
                  </div>
                  {propiedad.fotos.length > 1 && (
                    <div className="atr-gallery-thumbs">
                      {propiedad.fotos.map((foto, index) => (
                        <img
                          key={foto.idFotos}
                          src={`http://localhost:5000${foto.fotosURL}`}
                          alt={`Miniatura ${index + 1}`}
                          onClick={() => setFotoActiva(index)}
                          className={`atr-gallery-thumb ${index === fotoActiva ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="atr-gallery-placeholder">🏠</div>
              )}
            </div>

            {/* Información principal */}
            <div className="atr-detail-card">
              <h1 className="atr-detail-title">{propiedad.titulo}</h1>
              
              <div className="atr-detail-badges">
                <span className="atr-badge atr-badge-primary">{propiedad.tipo}</span>
                <span className={`atr-badge atr-badge-${propiedad.estatus === 'Disponible' ? 'success' : 'warning'}`}>
                  {propiedad.estatus}
                </span>
              </div>

              <div className="atr-detail-price-row">
                <div>
                  <div className="atr-detail-price">
                    ${propiedad.precio.toLocaleString('es-MX')}
                  </div>
                  <div className="atr-detail-price-period">
                    por {propiedad.precioPor.toLowerCase()}
                  </div>
                </div>
                <div className="atr-detail-meta">
                  <div>👥 {propiedad.lugares} lugares disponibles</div>
                  <div>📅 Publicado el {formatFecha(propiedad.fechaRegistro)}</div>
                </div>
              </div>

              <div className="atr-detail-section">
                <h3>Descripción</h3>
                <p>{propiedad.descripcion}</p>
              </div>

              <hr className="atr-divider" />

              <div className="atr-detail-section">
                <h3>📍 Dirección</h3>
                <p>
                  {propiedad.direccion.calle} #{propiedad.direccion.numExt}
                  {propiedad.direccion.numInt && ` Int. ${propiedad.direccion.numInt}`}<br />
                  Col. {propiedad.direccion.colonia}<br />
                  {propiedad.direccion.municipio}, {propiedad.direccion.estado}<br />
                  C.P. {propiedad.direccion.cp}
                </p>
              </div>

              <hr className="atr-divider" />

              <div className="atr-detail-section">
                <h3>Servicios incluidos</h3>
                
                {serviciosBasicos.length > 0 && (
                  <div className="atr-service-category">
                    <h4>🔌 Servicios Básicos</h4>
                    <div className="atr-service-tags">
                      {serviciosBasicos.map(servicio => (
                        <span key={servicio.idServicio} className="atr-service-tag basic">{servicio.servicioNombre}</span>
                      ))}
                    </div>
                  </div>
                )}

                {serviciosEntretenimiento.length > 0 && (
                  <div className="atr-service-category">
                    <h4>🎮 Entretenimiento</h4>
                    <div className="atr-service-tags">
                      {serviciosEntretenimiento.map(servicio => (
                        <span key={servicio.idServicio} className="atr-service-tag entertainment">{servicio.servicioNombre}</span>
                      ))}
                    </div>
                  </div>
                )}

                {serviciosAdicionales.length > 0 && (
                  <div className="atr-service-category">
                    <h4>✨ Servicios Adicionales</h4>
                    <div className="atr-service-tags">
                      {serviciosAdicionales.map(servicio => (
                        <span key={servicio.idServicio} className="atr-service-tag additional">{servicio.servicioNombre}</span>
                      ))}
                    </div>
                  </div>
                )}

                {propiedad.servicios.length === 0 && (
                  <p className="atr-text-muted">No hay servicios registrados</p>
                )}
              </div>
            </div>

            {/* Sección de Reseñas */}
            <div className="atr-reviews-card">
              <h2>Reseñas y Calificaciones</h2>
              
              {propiedad.calificaciones.totalResenas > 0 && (
                <>
                  <div className="atr-reviews-stats">
                    <div className="atr-review-stat">
                      <div className="atr-review-stat-value">{propiedad.calificaciones.promedioCalGen || 'N/A'}</div>
                      <div className="atr-review-stat-label">⭐ General</div>
                    </div>
                    <div className="atr-review-stat">
                      <div className="atr-review-stat-value">{propiedad.calificaciones.promedioCalSerBasic || 'N/A'}</div>
                      <div className="atr-review-stat-label">🔌 Serv. Básicos</div>
                    </div>
                    <div className="atr-review-stat">
                      <div className="atr-review-stat-value">{propiedad.calificaciones.promedioCalSerComEnt || 'N/A'}</div>
                      <div className="atr-review-stat-label">🎮 Entretenimiento</div>
                    </div>
                    <div className="atr-review-stat">
                      <div className="atr-review-stat-value">{propiedad.calificaciones.promedioCalSerAdicio || 'N/A'}</div>
                      <div className="atr-review-stat-label">✨ Adicionales</div>
                    </div>
                  </div>
                  <hr className="atr-divider" />
                </>
              )}

              {propiedad.resenas && propiedad.resenas.length > 0 ? (
                <div className="atr-reviews-list">
                  {propiedad.resenas.map(resena => (
                    <div key={resena.id} className="atr-review-item">
                      <div className="atr-review-header">
                        <strong>{resena.autor.nombre || 'Anónimo'}</strong>
                        <span>
                          {formatFecha(resena.fecha)}
                          {resena.duracionRenta && ` · ${resena.duracionRenta} meses`}
                        </span>
                      </div>
                      <p className="atr-review-text">{resena.descripcion}</p>
                      <div className="atr-review-stars">
                        {'⭐'.repeat(Math.round(resena.calGen))}
                      </div>
                      {resena.sentimiento && (
                        <span className="atr-review-sentiment">{resena.sentimiento}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="atr-reviews-empty">No hay reseñas para mostrar</p>
              )}
            </div>
          </div>

          {/* Sidebar - Arrendador */}
          <div className="atr-detail-sidebar">
            <div className="atr-landlord-card">
              <h3>Arrendador</h3>
              
              <div className="atr-landlord-info">
                <div className="atr-landlord-avatar-lg">
                  {propiedad.arrendador.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="atr-landlord-name-lg">{propiedad.arrendador.nombre}</div>
              </div>

              <div className="atr-contact-info">
                <h4>📞 Contacto</h4>
                <div className="atr-contact-item">
                  <div className="atr-contact-label">Correo electrónico:</div>
                  <div className="atr-contact-value">{propiedad.arrendador.correo}</div>
                </div>
                <div className="atr-contact-item">
                  <div className="atr-contact-label">Teléfono:</div>
                  <div className="atr-contact-value">{propiedad.arrendador.telefono || 'No disponible'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterInicio />
    </div>
  )
}

export default DetallePropiedad