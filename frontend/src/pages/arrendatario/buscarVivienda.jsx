import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarPropiedades, obtenerServicios } from '../../services/propiedadService'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import '../../styles/Arrendatario.css'

const BuscarVivienda = () => {
  const navigate = useNavigate()
  
  const [propiedades, setPropiedades] = useState([])
  const [servicios, setServicios] = useState({ Basicos: [], Entretenimiento: [], Adicionales: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filtros, setFiltros] = useState({
    serviciosBasicos: [],
    serviciosEntretenimiento: [],
    serviciosAdicionales: [],
    precioMin: '',
    precioMax: '',
    ordenarPor: 'reciente',
    pagina: 1
  })
  
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalPropiedades, setTotalPropiedades] = useState(0)
  const [serviciosAbiertos, setServiciosAbiertos] = useState({ Basicos: false, Entretenimiento: false, Adicionales: false })

  useEffect(() => {
    cargarServicios()
  }, [])

  useEffect(() => {
    cargarPropiedades()
  }, [filtros])

  const cargarServicios = async () => {
    try {
      const response = await obtenerServicios()
      if (response.success) {
        setServicios(response.data)
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error)
    }
  }

  const cargarPropiedades = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        ...filtros,
        serviciosBasicos: filtros.serviciosBasicos.join(','),
        serviciosEntretenimiento: filtros.serviciosEntretenimiento.join(','),
        serviciosAdicionales: filtros.serviciosAdicionales.join(',')
      }
      
      const response = await buscarPropiedades(params)
      
      if (response.success) {
        setPropiedades(response.data.propiedades)
        setTotalPaginas(response.data.totalPaginas)
        setTotalPropiedades(response.data.total)
      }
    } catch (error) {
      setError('Error al cargar propiedades')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleServicioChange = (categoria, servicioId) => {
    setFiltros(prev => {
      const campo = `servicios${categoria}`
      const current = prev[campo] || []
      const updated = current.includes(servicioId)
        ? current.filter(id => id !== servicioId)
        : [...current, servicioId]
      
      return { ...prev, [campo]: updated, pagina: 1 }
    })
  }

  const handlePrecioChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: valor,
      pagina: 1
    }))
  }

  const handleOrdenChange = (orden) => {
    setFiltros(prev => ({
      ...prev,
      ordenarPor: orden,
      pagina: 1
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      serviciosBasicos: [],
      serviciosEntretenimiento: [],
      serviciosAdicionales: [],
      precioMin: '',
      precioMax: '',
      ordenarPor: 'reciente',
      pagina: 1
    })
  }

  const cambiarPagina = (nuevaPagina) => {
    setFiltros(prev => ({ ...prev, pagina: nuevaPagina }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filtrosActivos = filtros.serviciosBasicos.length > 0 || 
    filtros.serviciosEntretenimiento.length > 0 || 
    filtros.serviciosAdicionales.length > 0 ||
    filtros.precioMin || filtros.precioMax

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarArrendatario />

      <div style={{ flex: 1, display: 'flex', maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '30px', gap: '30px' }}>
        
        {/* ============ SIDEBAR DE FILTROS ============ */}
        <div style={{ width: '280px', minWidth: '280px', backgroundColor: '#fff', padding: '20px', borderRadius: '16px', height: 'fit-content', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#1a1633' }}>🔎 Filtros</h2>

          {/* ORDENAR POR */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#7a7899', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Ordenar por</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['reciente', 'Más reciente'],
                ['antiguo', 'Más antiguo'],
                ['precio_asc', 'Precio ascendente'],
                ['precio_desc', 'Precio descendente'],
                ['calificacion', 'Mejor calificación'],
              ].map(([val, label]) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4a4668' }}>
                  <input type="radio" name="orden" checked={filtros.ordenarPor === val} onChange={() => handleOrdenChange(val)} style={{ accentColor: '#534AB7' }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* PRECIO */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#7a7899', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Precio (MXN)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Mínimo" 
                value={filtros.precioMin} 
                onChange={(e) => handlePrecioChange('precioMin', e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <input 
                type="number" 
                placeholder="Máximo" 
                value={filtros.precioMax} 
                onChange={(e) => handlePrecioChange('precioMax', e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* SERVICIOS */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#7a7899', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Servicios</p>
            {[
              ['Basicos', 'Servicios Básicos', 'serviciosBasicos'],
              ['Entretenimiento', 'Entretenimiento', 'serviciosEntretenimiento'],
              ['Adicionales', 'Servicios Adicionales', 'serviciosAdicionales'],
            ].map(([cat, label, campo]) => (
              <div key={cat} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', marginBottom: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setServiciosAbiertos(prev => ({ ...prev, [cat]: !prev[cat] }))}
                  style={{ width: '100%', padding: '10px 12px', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '600', color: '#1a1633' }}
                >
                  <span>
                    {label}
                    {filtros[campo].length > 0 && (
                      <span style={{ background: '#534AB7', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '10px', marginLeft: '6px' }}>
                        {filtros[campo].length}
                      </span>
                    )}
                  </span>
                  <span>{serviciosAbiertos[cat] ? '▲' : '▼'}</span>
                </button>
                {serviciosAbiertos[cat] && (
                  <div style={{ padding: '10px 12px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #e5e7eb' }}>
                    {servicios[cat].length === 0 ? (
                      <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>No disponibles</p>
                    ) : (
                      servicios[cat].map(servicio => (
                        <label key={servicio.idServicio} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4a4668' }}>
                          <input type="checkbox" checked={filtros[campo].includes(servicio.idServicio)} onChange={() => handleServicioChange(cat, servicio.idServicio)} style={{ accentColor: '#534AB7' }} />
                          {servicio.servicioNombre}
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtrosActivos && (
            <button onClick={limpiarFiltros} style={{ width: '100%', padding: '10px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginTop: '15px' }}>
              Limpiar todos los filtros
            </button>
          )}
        </div>

        {/* ============ RESULTADOS ============ */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1633', margin: 0 }}>Buscar Vivienda</h1>
            <p style={{ color: '#7a7899', fontSize: '14px' }}>{totalPropiedades} {totalPropiedades === 1 ? 'vivienda encontrada' : 'viviendas encontradas'}</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: '#7a7899' }}>Cargando propiedades...</p>
            </div>
          ) : error ? (
            <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '15px', borderRadius: '12px' }}>
              {error}
            </div>
          ) : propiedades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</p>
              <p style={{ fontSize: '18px', color: '#1a1633' }}>No se encontraron viviendas</p>
              <p style={{ color: '#7a7899' }}>Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {propiedades.map(propiedad => (
                  <div 
                    key={propiedad.id} 
                    onClick={() => navigate(`/arrendatario/propiedad/${propiedad.id}`)}
                    style={{ display: 'flex', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Imagen */}
                    <div style={{ width: '260px', minWidth: '260px', height: '200px', backgroundColor: '#f3f4f6', position: 'relative' }}>
                      {propiedad.fotoPrincipal ? (
                        <img src={`http://localhost:5000${propiedad.fotoPrincipal}`} alt={propiedad.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏠</div>
                      )}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', backgroundColor: propiedad.estatus === 'Disponible' ? '#16A34A' : '#F59E0B', color: 'white' }}>
                          {propiedad.estatus}
                        </span>
                        {propiedad.totalResenas === 0 && (
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#06B6D4', color: 'white' }}>
                            ✨ Nuevo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '16px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1a1633' }}>{propiedad.titulo}</h3>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#534AB7' }}>${propiedad.precio.toLocaleString('es-MX')}</span>
                          <span style={{ fontSize: '12px', color: '#7a7899', display: 'block' }}>/mes</span>
                        </div>
                      </div>
                      
                      <p style={{ color: '#7a7899', margin: '0 0 8px 0', fontSize: '13px' }}>{propiedad.tipo}</p>
                      
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {propiedad.calificacionGeneral ? (
                          <>
                            <span style={{ color: '#F59E0B' }}>⭐</span>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{propiedad.calificacionGeneral}</span>
                            <span style={{ color: '#7a7899', fontSize: '12px' }}>({propiedad.totalResenas} {propiedad.totalResenas === 1 ? 'reseña' : 'reseñas'})</span>
                          </>
                        ) : (
                          <span style={{ color: '#7a7899', fontSize: '12px', fontStyle: 'italic' }}>Sin reseñas aún</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '15px', color: '#7a7899', fontSize: '12px', marginBottom: '10px' }}>
                        <span>👥 {propiedad.lugares} {propiedad.lugares === 1 ? 'lugar' : 'lugares'}</span>
                        <span>💵 por {propiedad.precioPor.toLowerCase()}</span>
                      </div>

                      {propiedad.servicios && propiedad.servicios.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                          {propiedad.servicios.slice(0, 4).map(serv => (
                            <span key={serv.idServicio} style={{ padding: '2px 10px', background: '#f3f4f6', borderRadius: '20px', fontSize: '11px', color: '#4b5563' }}>
                              {serv.servicioNombre}
                            </span>
                          ))}
                          {propiedad.servicios.length > 4 && (
                            <span style={{ fontSize: '11px', color: '#7a7899' }}>+{propiedad.servicios.length - 4} más</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="atr-pagination">
                  <button 
                    onClick={() => cambiarPagina(filtros.pagina - 1)} 
                    disabled={filtros.pagina === 1} 
                    className="atr-pagination-btn"
                  >
                     Anterior
                  </button>
                  {[...Array(totalPaginas)].map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => cambiarPagina(index + 1)} 
                      className={`atr-pagination-btn ${filtros.pagina === index + 1 ? 'active' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => cambiarPagina(filtros.pagina + 1)} 
                    disabled={filtros.pagina === totalPaginas} 
                    className="atr-pagination-btn"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FooterInicio />
    </div>
  )
}

export default BuscarVivienda