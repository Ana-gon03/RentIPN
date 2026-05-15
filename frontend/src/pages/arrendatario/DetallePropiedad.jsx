import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerDetallePropiedad } from '../../services/propiedadService'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'

const RESENAS_POR_PAGINA = 5

const DetallePropiedad = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [propiedad, setPropiedad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fotoActiva, setFotoActiva] = useState(0)
  const [filtroSentimiento, setFiltroSentimiento] = useState('todas')
  const [paginaActual, setPaginaActual] = useState(1)
  const [estaVerificado, setEstaVerificado] = useState(false)
  const [esRenovacion, setEsRenovacion] = useState(false)

  useEffect(() => {
    cargarPropiedad()
    verificarEstadoVerificacion()
  }, [id])

  useEffect(() => {
    setPaginaActual(1)
  }, [filtroSentimiento])

  const verificarEstadoVerificacion = async () => {
      const fechaVerificacion = localStorage.getItem('arrendatarioFechaVerificacion')
      
      // Si tiene fecha de verificación guardada, verificar vigencia
      if (fechaVerificacion && fechaVerificacion !== 'null' && fechaVerificacion !== 'undefined') {
        const ahora = new Date()
        const fechaVer = new Date(fechaVerificacion)
        const mesesTranscurridos = (ahora - fechaVer) / (1000 * 60 * 60 * 24 * 30)
        
        if (mesesTranscurridos >= 6) {
          // Expirado - necesita renovación
          setEstaVerificado(false)
          setEsRenovacion(true)
          // NO cambiar arrendatarioVerificado a false en localStorage
          // para que MiArrendamiento no se confunda
          return
        } else {
          // Vigente
          setEstaVerificado(true)
          setEsRenovacion(false)
          localStorage.setItem('arrendatarioVerificado', 'true')
          return
        }
      }
      
      // Si no tiene fecha en localStorage, consultar al backend
      try {
        const userId = localStorage.getItem('userId')
        const response = await fetch('http://localhost:5000/api/auth/estado-verificacion', {
          headers: { 'x-user-id': userId }
        })
        const data = await response.json()
        
        if (data.success) {
          if (data.fechaVerificacion) {
            localStorage.setItem('arrendatarioFechaVerificacion', data.fechaVerificacion)
            
            const ahora = new Date()
            const fechaVer = new Date(data.fechaVerificacion)
            const mesesTranscurridos = (ahora - fechaVer) / (1000 * 60 * 60 * 24 * 30)
            
            if (mesesTranscurridos >= 6) {
              setEstaVerificado(false)
              setEsRenovacion(true)
            } else {
              setEstaVerificado(true)
              setEsRenovacion(false)
              localStorage.setItem('arrendatarioVerificado', 'true')
            }
          } else {
            // Nunca verificado
            setEstaVerificado(false)
            setEsRenovacion(false)
            localStorage.setItem('arrendatarioVerificado', 'false')
          }
        }
      } catch (error) {
        console.error('Error al obtener estado:', error)
        setEstaVerificado(false)
        setEsRenovacion(false)
      }
    }

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

  // Separar servicios por categoría
  const serviciosBasicos = propiedad?.servicios?.filter(s => s.servicioCategoria === 'Basico') || []
  const serviciosEntretenimiento = propiedad?.servicios?.filter(s => s.servicioCategoria === 'Entretenimiento') || []
  const serviciosAdicionales = propiedad?.servicios?.filter(s => s.servicioCategoria === 'Adicional') || []

  // Filtrar y paginar reseñas
  const obtenerResenasFiltradas = () => {
    if (!propiedad?.resenas) return []
    
    let resenasFiltradas = propiedad.resenas
    
    if (filtroSentimiento !== 'todas') {
      resenasFiltradas = propiedad.resenas.filter(r => 
        r.sentimiento?.toLowerCase() === filtroSentimiento
      )
    }
    
    return resenasFiltradas
  }

  const resenasFiltradas = obtenerResenasFiltradas()
  const totalPaginas = Math.ceil(resenasFiltradas.length / RESENAS_POR_PAGINA)
  const inicio = (paginaActual - 1) * RESENAS_POR_PAGINA
  const resenasPaginadas = resenasFiltradas.slice(inicio, inicio + RESENAS_POR_PAGINA)

  // Contadores de sentimiento
  const contarSentimientos = (sentimiento) => {
    if (!propiedad?.resenas) return 0
    return propiedad.resenas.filter(r => r.sentimiento?.toLowerCase() === sentimiento).length
  }

  const totalPositivas = contarSentimientos('positivo')
  const totalNeutras = contarSentimientos('neutral')
  const totalNegativas = contarSentimientos('negativo')

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavbarArrendatario />
        <div style={{ flex: 1, textAlign: 'center', padding: '60px' }}>
          <p style={{ color: '#666' }}>Cargando propiedad...</p>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (error || !propiedad) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavbarArrendatario />
        <div style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ color: 'red', padding: '20px', backgroundColor: '#ffe6e6', borderRadius: '5px', marginBottom: '20px' }}>
            {error || 'Propiedad no encontrada'}
          </div>
          <button onClick={() => navigate('/arrendatario/buscar-vivienda')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            ← Volver a resultados
          </button>
        </div>
        <FooterInicio />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarArrendatario />

      <div style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '20px', width: '100%' }}>
        {/* Botón volver */}
        <button 
          onClick={() => navigate('/arrendatario/buscar-vivienda')}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          ← Volver a resultados
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
          {/* Columna principal */}
          <div>
            {/* Galería de fotos */}
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden',
              marginBottom: '20px',
              backgroundColor: 'white'
            }}>
              {propiedad.fotos && propiedad.fotos.length > 0 ? (
                <>
                  <div style={{ height: '400px', backgroundColor: '#f0f0f0' }}>
                    <img
                      src={`http://localhost:5000${propiedad.fotos[fotoActiva].fotosURL}`}
                      alt={`Foto ${fotoActiva + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:60px">🏠</span>'; }}
                    />
                  </div>
                  {propiedad.fotos.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', padding: '10px', overflow: 'auto' }}>
                      {propiedad.fotos.map((foto, index) => (
                        <img
                          key={foto.idFotos}
                          src={`http://localhost:5000${foto.fotosURL}`}
                          alt={`Miniatura ${index + 1}`}
                          onClick={() => setFotoActiva(index)}
                          style={{
                            width: '80px',
                            height: '60px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: index === fotoActiva ? '3px solid #1a237e' : '3px solid transparent',
                            opacity: index === fotoActiva ? 1 : 0.6
                          }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ 
                  height: '400px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f0f0f0',
                  fontSize: '60px'
                }}>
                  🏠
                </div>
              )}
            </div>

            {/* Información principal */}
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '25px',
              marginBottom: '20px',
              backgroundColor: 'white'
            }}>
              <h1 style={{ marginTop: 0, fontSize: '24px' }}>{propiedad.titulo}</h1>
              
              <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <span style={{ 
                  padding: '5px 12px', 
                  backgroundColor: '#1a237e', 
                  color: 'white', 
                  borderRadius: '3px',
                  fontSize: '13px'
                }}>
                  {propiedad.tipo}
                </span>
                <span style={{ 
                  padding: '5px 12px', 
                  backgroundColor: propiedad.estatus === 'Disponible' ? '#28a745' : 
                                  propiedad.estatus === 'Sin Disponibilidad' ? '#ffc107' : '#dc3545',
                  color: 'white', 
                  borderRadius: '3px',
                  fontSize: '13px'
                }}>
                  {propiedad.estatus}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h2 style={{ color: '#1a237e', margin: 0, fontSize: '28px' }}>
                    ${propiedad.precio.toLocaleString('es-MX')}
                    <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal' }}>/mes</span>
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                    👥 {propiedad.lugares} lugares disponibles
                  </p>
                  <p style={{ color: '#666', margin: 0, fontSize: '13px' }}>
                    📅 Publicado el {formatFecha(propiedad.fechaRegistro)}
                  </p>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Descripción</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>{propiedad.descripcion}</p>

              <hr style={{ margin: '20px 0' }} />

              <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>📍 Dirección</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                {propiedad.direccion.calle} #{propiedad.direccion.numExt}
                {propiedad.direccion.numInt && ` Int. ${propiedad.direccion.numInt}`}<br />
                Col. {propiedad.direccion.colonia}<br />
                {propiedad.direccion.municipio}, {propiedad.direccion.estado}<br />
                C.P. {propiedad.direccion.cp}
              </p>

              <hr style={{ margin: '20px 0' }} />

              {/* SERVICIOS SEPARADOS POR CATEGORÍA */}
              <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Servicios incluidos</h3>
              
              {serviciosBasicos.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#1a237e', marginBottom: '8px' }}>🔌 Servicios Básicos</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {serviciosBasicos.map(servicio => (
                      <span key={servicio.idServicio} style={{
                        padding: '8px 15px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '5px',
                        fontSize: '13px',
                        color: '#1a237e'
                      }}>
                        {servicio.servicioNombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {serviciosEntretenimiento.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '8px' }}>🎮 Entretenimiento</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {serviciosEntretenimiento.map(servicio => (
                      <span key={servicio.idServicio} style={{
                        padding: '8px 15px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '5px',
                        fontSize: '13px',
                        color: '#2e7d32'
                      }}>
                        {servicio.servicioNombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {serviciosAdicionales.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', color: '#00838f', marginBottom: '8px' }}>✨ Servicios Adicionales</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {serviciosAdicionales.map(servicio => (
                      <span key={servicio.idServicio} style={{
                        padding: '8px 15px',
                        backgroundColor: '#e0f7fa',
                        borderRadius: '5px',
                        fontSize: '13px',
                        color: '#00838f'
                      }}>
                        {servicio.servicioNombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {propiedad.servicios.length === 0 && (
                <p style={{ color: '#999', fontStyle: 'italic' }}>No hay servicios registrados</p>
              )}
            </div>

            {/* Sección de Reseñas */}
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '25px',
              backgroundColor: 'white'
            }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Reseñas y Calificaciones</h2>
              
              {propiedad.calificaciones.totalResenas > 0 ? (
                <>
                  {/* Calificación general */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e' }}>
                        {propiedad.calificaciones.promedioCalGen || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>⭐ General</div>
                    </div>

                    {serviciosBasicos.length > 0 && (
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e' }}>
                          {propiedad.calificaciones.promedioCalSerBasic === null
                            ? <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 'bold' }}>✨ Nuevo</span>
                            : propiedad.calificaciones.promedioCalSerBasic > 0
                              ? propiedad.calificaciones.promedioCalSerBasic
                              : 'N/A'
                          }
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>🔌 Serv. Básicos</div>
                      </div>
                    )}

                    {serviciosEntretenimiento.length > 0 && (
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e' }}>
                          {propiedad.calificaciones.promedioCalSerComEnt === null
                            ? <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 'bold' }}>✨ Nuevo</span>
                            : propiedad.calificaciones.promedioCalSerComEnt > 0
                              ? propiedad.calificaciones.promedioCalSerComEnt
                              : 'N/A'
                          }
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>🎮 Entretenimiento</div>
                      </div>
                    )}

                    {serviciosAdicionales.length > 0 && (
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a237e' }}>
                          {propiedad.calificaciones.promedioCalSerAdicio === null
                            ? <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 'bold' }}>✨ Nuevo</span>
                            : propiedad.calificaciones.promedioCalSerAdicio > 0
                              ? propiedad.calificaciones.promedioCalSerAdicio
                              : 'N/A'
                          }
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>✨ Adicionales</div>
                      </div>
                    )}
                  </div>

                  <hr style={{ marginBottom: '20px' }} />

                  {/* Filtros de sentimiento */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => setFiltroSentimiento('todas')}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid',
                        borderColor: filtroSentimiento === 'todas' ? '#1a237e' : '#ddd',
                        backgroundColor: filtroSentimiento === 'todas' ? '#1a237e' : 'white',
                        color: filtroSentimiento === 'todas' ? 'white' : '#555',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: filtroSentimiento === 'todas' ? 'bold' : 'normal',
                        transition: 'all 0.15s'
                      }}
                    >
                      📋 Todas ({propiedad.resenas.length})
                    </button>
                    <button
                      onClick={() => setFiltroSentimiento('positivo')}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid',
                        borderColor: filtroSentimiento === 'positivo' ? '#2e7d32' : '#ddd',
                        backgroundColor: filtroSentimiento === 'positivo' ? '#e8f5e9' : 'white',
                        color: filtroSentimiento === 'positivo' ? '#2e7d32' : '#555',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: filtroSentimiento === 'positivo' ? 'bold' : 'normal',
                        transition: 'all 0.15s'
                      }}
                    >
                      😊 Positivas ({totalPositivas})
                    </button>
                    <button
                      onClick={() => setFiltroSentimiento('neutral')}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid',
                        borderColor: filtroSentimiento === 'neutral' ? '#e65100' : '#ddd',
                        backgroundColor: filtroSentimiento === 'neutral' ? '#fff3e0' : 'white',
                        color: filtroSentimiento === 'neutral' ? '#e65100' : '#555',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: filtroSentimiento === 'neutral' ? 'bold' : 'normal',
                        transition: 'all 0.15s'
                      }}
                    >
                      😐 Neutras ({totalNeutras})
                    </button>
                    <button
                      onClick={() => setFiltroSentimiento('negativo')}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid',
                        borderColor: filtroSentimiento === 'negativo' ? '#c62828' : '#ddd',
                        backgroundColor: filtroSentimiento === 'negativo' ? '#ffebee' : 'white',
                        color: filtroSentimiento === 'negativo' ? '#c62828' : '#555',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: filtroSentimiento === 'negativo' ? 'bold' : 'normal',
                        transition: 'all 0.15s'
                      }}
                    >
                      😞 Negativas ({totalNegativas})
                    </button>
                  </div>
                </>
              ) : null}

              {/* Lista de reseñas */}
              {propiedad.resenas && propiedad.resenas.length > 0 ? (
                <div>
                  {resenasPaginadas.length > 0 ? (
                    <>
                      {resenasPaginadas.map(resena => (
                        <div
                          key={resena.id}
                          style={{
                            padding: '14px',
                            borderBottom: '1px solid #eee',
                            marginBottom: '8px'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            <strong style={{ fontSize: '14px' }}>
                              {resena.autor?.nombre || 'Anónimo'}
                            </strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                backgroundColor: 
                                  resena.sentimiento?.toLowerCase() === 'positivo' ? '#e8f5e9' :
                                  resena.sentimiento?.toLowerCase() === 'negativo' ? '#ffebee' : '#fff3e0',
                                color:
                                  resena.sentimiento?.toLowerCase() === 'positivo' ? '#2e7d32' :
                                  resena.sentimiento?.toLowerCase() === 'negativo' ? '#c62828' : '#e65100'
                              }}>
                                {resena.sentimiento?.toLowerCase() === 'positivo' ? '😊 Positivo' :
                                 resena.sentimiento?.toLowerCase() === 'negativo' ? '😞 Negativo' : '😐 Neutro'}
                              </span>
                              <span style={{ color: '#999', fontSize: '12px' }}>
                                {formatFecha(resena.fecha)}
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '15px', 
                            marginBottom: '8px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ color: '#ffc107', fontSize: '14px' }}>
                              ⭐ {resena.calGen}
                            </span>
                            {resena.duracionRenta && (
                              <span style={{ 
                                color: '#666', 
                                fontSize: '12px',
                                backgroundColor: '#f5f5f5',
                                padding: '3px 8px',
                                borderRadius: '10px'
                              }}>
                                🕒 Tiempo de renta: {resena.duracionRenta} {resena.duracionRenta === 1 ? 'mes' : 'meses'}
                              </span>
                            )}
                          </div>
                          
                          <p style={{
                            margin: 0,
                            color: '#555',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {resena.descripcion}
                          </p>
                        </div>
                      ))}

                      {/* Paginación */}
                      {totalPaginas > 1 && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '20px'
                        }}>
                          <button
                            onClick={() => setPaginaActual(paginaActual - 1)}
                            disabled={paginaActual === 1}
                            style={{
                              padding: '6px 12px',
                              border: '1px solid #ddd',
                              backgroundColor: 'white',
                              borderRadius: '5px',
                              cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                              fontSize: '13px',
                              opacity: paginaActual === 1 ? 0.5 : 1
                            }}
                          >
                            ← Anterior
                          </button>
                          
                          {[...Array(totalPaginas)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPaginaActual(i + 1)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid',
                                borderColor: paginaActual === i + 1 ? '#1a237e' : '#ddd',
                                backgroundColor: paginaActual === i + 1 ? '#1a237e' : 'white',
                                color: paginaActual === i + 1 ? 'white' : '#555',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: paginaActual === i + 1 ? 'bold' : 'normal'
                              }}
                            >
                              {i + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setPaginaActual(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                            style={{
                              padding: '6px 12px',
                              border: '1px solid #ddd',
                              backgroundColor: 'white',
                              borderRadius: '5px',
                              cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                              fontSize: '13px',
                              opacity: paginaActual === totalPaginas ? 0.5 : 1
                            }}
                          >
                            Siguiente →
                          </button>
                        </div>
                      )}

                      {/* Info de resultados */}
                      <p style={{
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '12px',
                        marginTop: '10px'
                      }}>
                        Mostrando {inicio + 1}-{Math.min(inicio + RESENAS_POR_PAGINA, resenasFiltradas.length)} de {resenasFiltradas.length} reseñas
                        {filtroSentimiento !== 'todas' && ` (filtradas por "${filtroSentimiento}")`}
                      </p>
                    </>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#999', padding: '30px', fontSize: '14px' }}>
                      No hay reseñas {filtroSentimiento !== 'todas' ? `de tipo "${filtroSentimiento}"` : ''} para mostrar
                    </p>
                  )}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '30px', fontSize: '14px' }}>
                  No hay reseñas para mostrar
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Arrendador */}
          <div style={{ position: 'sticky', top: '20px', alignSelf: 'start' }}>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px',
              backgroundColor: 'white'
            }}>
              <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px' }}>Arrendador</h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #eee'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#1a237e',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginRight: '15px'
                }}>
                  {propiedad.arrendador.nombre.charAt(0)}
                </div>
                <div>
                  <strong style={{ fontSize: '15px' }}>{propiedad.arrendador.nombre}</strong>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', marginBottom: '15px', color: '#555' }}>📞 Contacto</h4>
              {estaVerificado ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>Correo electrónico:</div>
                    <div style={{ fontSize: '14px', wordBreak: 'break-all' }}>{propiedad.arrendador.correo}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>Teléfono:</div>
                    <div style={{ fontSize: '14px' }}>{propiedad.arrendador.telefono || 'No disponible'}</div>
                  </div>
                </>
              ) : (
                <div style={{ position: 'relative' }}>

                  {/* Datos distorsionados con blur */}
                  <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>Correo electrónico:</div>
                      <div style={{ fontSize: '14px' }}>arrendador@correo.com</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>Teléfono:</div>
                      <div style={{ fontSize: '14px' }}>55 1234 5678</div>
                    </div>
                  </div>

                  {/* Overlay con mensaje */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: '6px',
                    padding: '10px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '20px', marginBottom: '6px' }}>🔒</span>
                    <p style={{ fontSize: '11px', color: '#333', margin: '0 0 10px 0', lineHeight: '1.4', fontWeight: '600' }}>
                      {esRenovacion 
                        ? 'Tu verificación expiró hace más de 6 meses. Renueva para ver los datos de contacto.'
                        : 'Verifica tu identidad para ver los datos de contacto'
                      }
                    </p>
                    <button
                      onClick={() => {
                        if (esRenovacion) {
                          navigate('/arrendatario/renovar-identidad')
                        } else {
                          navigate('/arrendatario/verificar-identidad')
                        }
                      }}
                      style={{
                        padding: '7px 12px',
                        backgroundColor: esRenovacion ? '#e65100' : '#1a237e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    >
                      {esRenovacion ? '🔄 Renovar ahora' : '📤 Verificar ahora'}
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterInicio />
    </div>
  )
}

export default DetallePropiedad