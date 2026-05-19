import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarPropiedades, obtenerServicios } from '../../services/propiedadService'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import { BASE_URL } from '../../config'
import '../../styles/Arrendatario.css'

const BuscarVivienda = () => {
  const navigate = useNavigate()
  const [propiedades, setPropiedades] = useState([])
  const [servicios, setServicios] = useState({ Basicos: [], Entretenimiento: [], Adicionales: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalPropiedades, setTotalPropiedades] = useState(0)
  const [precioMinGlobal, setPrecioMinGlobal] = useState(0)
  const [precioMaxGlobal, setPrecioMaxGlobal] = useState(10000)
  const [serviciosAbiertos, setServiciosAbiertos] = useState({ Basicos: false, Entretenimiento: false, Adicionales: false })
  const [mensajeRelajado, setMensajeRelajado] = useState(null)
  const busquedaTimer = useRef(null)

  const [filtros, setFiltros] = useState({
    busqueda: '',
    ordenarPor: 'reciente',
    precioMin: '',
    precioMax: '',
    tipo: '',
    precioPor: '',
    lugaresMin: 1,
    serviciosBasicos: [],
    serviciosEntretenimiento: [],
    serviciosAdicionales: [],
    pagina: 1
  })

  useEffect(() => { cargarServicios() }, [])
  useEffect(() => { cargarPropiedades() }, [filtros])

  const cargarServicios = async () => {
    try {
      const response = await obtenerServicios()
      if (response.success) setServicios(response.data)
    } catch (e) { console.error(e) }
  }

  const cargarPropiedades = async () => {
    try {
      setLoading(true)
      setError(null)
      setMensajeRelajado(null)

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
        setPrecioMinGlobal(response.data.precioMinGlobal || 0)
        setPrecioMaxGlobal(response.data.precioMaxGlobal || 10000)

        if (response.data.filtrosRelajados && response.data.mensajeRelajado) {
          setMensajeRelajado(response.data.mensajeRelajado)
        }
      }
    } catch (e) {
      setError('Error al cargar propiedades')
    } finally {
      setLoading(false)
    }
  }

  const setFiltro = (campo, valor) => setFiltros(prev => ({ ...prev, [campo]: valor, pagina: 1 }))

  const handleBusqueda = (valor) => {
    if (busquedaTimer.current) clearTimeout(busquedaTimer.current)
    busquedaTimer.current = setTimeout(() => setFiltro('busqueda', valor), 400)
  }

  const handleOrden = (valor) => setFiltro('ordenarPor', valor)

  const handleServicioChange = (categoria, servicioId) => {
    const campo = `servicios${categoria}`
    setFiltros(prev => {
      const current = prev[campo] || []
      const updated = current.includes(servicioId)
        ? current.filter(id => id !== servicioId)
        : [...current, servicioId]
      return { ...prev, [campo]: updated, pagina: 1 }
    })
  }

  const handlePrecioChange = (tipo, valor) => {
    setFiltros(prev => ({ ...prev, [tipo]: valor, pagina: 1 }))
  }

  const handleOrdenChange = (orden) => {
    setFiltros(prev => ({ ...prev, ordenarPor: orden, pagina: 1 }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '', ordenarPor: 'reciente', precioMin: '', precioMax: '',
      tipo: '', precioPor: '', lugaresMin: 1,
      serviciosBasicos: [], serviciosEntretenimiento: [], serviciosAdicionales: [], pagina: 1
    })
    setMensajeRelajado(null)
  }

  const cambiarPagina = (p) => {
    setFiltros(prev => ({ ...prev, pagina: p }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hayFiltrosActivos = filtros.busqueda || filtros.tipo || filtros.precioPor ||
    filtros.precioMin || filtros.precioMax || filtros.lugaresMin > 1 ||
    filtros.serviciosBasicos.length > 0 || filtros.serviciosEntretenimiento.length > 0 ||
    filtros.serviciosAdicionales.length > 0

  const btnOrden = (val) => ({
    padding: '7px 14px',
    fontSize: '13px',
    border: '1px solid',
    borderColor: filtros.ordenarPor === val ? '#1a237e' : '#ddd',
    backgroundColor: filtros.ordenarPor === val ? '#1a237e' : 'white',
    color: filtros.ordenarPor === val ? 'white' : '#555',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: filtros.ordenarPor === val ? 'bold' : 'normal',
    transition: 'all 0.15s'
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarArrendatario />

      <div className="atr-search-layout">

        {/* ============ SIDEBAR DE FILTROS ============ */}
        <div className="atr-search-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '18px', margin: 0, color: '#1a1633' }}>🔎 Filtros</h2>
            {hayFiltrosActivos && (
              <button onClick={limpiarFiltros} style={{ fontSize: '12px', color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                Limpiar todo
              </button>
            )}
          </div>

          {/* ORDENAR — Fecha */}
          <p style={labelSeccion}>Fecha</p>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            <button style={btnOrden('reciente')} onClick={() => handleOrden('reciente')}>Más reciente</button>
            <button style={btnOrden('antiguo')} onClick={() => handleOrden('antiguo')}>Más antiguo</button>
          </div>

          {/* ORDENAR — Precio */}
          <p style={labelSeccion}>Precio</p>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            <button style={btnOrden('precio_asc')} onClick={() => handleOrden('precio_asc')}>↑ Menor</button>
            <button style={btnOrden('precio_desc')} onClick={() => handleOrden('precio_desc')}>↓ Mayor</button>
          </div>

          {/* ORDENAR — Valoración */}
          <p style={labelSeccion}>Valoración</p>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
            <button style={btnOrden('calificacion')} onClick={() => handleOrden('calificacion')}>⭐ Mejores</button>
            <button style={btnOrden('calificacion_asc')} onClick={() => handleOrden('calificacion_asc')}>👎 Peores</button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* RANGO DE PRECIO */}
          <p style={labelSeccion}>Rango de precio (MXN)</p>
          <p style={{ fontSize: '11px', color: '#999', marginBottom: '10px' }}>
            Rango: ${precioMinGlobal.toLocaleString('es-MX')} - ${precioMaxGlobal.toLocaleString('es-MX')}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>Mínimo</label>
              <input
                type="number"
                placeholder={`$${precioMinGlobal.toLocaleString('es-MX')}`}
                value={filtros.precioMin}
                onChange={(e) => setFiltro('precioMin', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>Máximo</label>
              <input
                type="number"
                placeholder={`$${precioMaxGlobal.toLocaleString('es-MX')}`}
                value={filtros.precioMax}
                onChange={(e) => setFiltro('precioMax', e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* TIPO DE VIVIENDA */}
          <p style={labelSeccion}>Tipo de vivienda</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
            {['Departamento', 'Casa', 'Habitación', 'Loft', 'Estudio'].map(t => (
              <button
                key={t}
                onClick={() => setFiltro('tipo', filtros.tipo === t ? '' : t)}
                style={{
                  padding: '5px 10px', fontSize: '12px', border: '1px solid',
                  borderColor: filtros.tipo === t ? '#1a237e' : '#ddd',
                  backgroundColor: filtros.tipo === t ? '#1a237e' : 'white',
                  color: filtros.tipo === t ? 'white' : '#555',
                  borderRadius: '15px', cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* PRECIO POR */}
          <p style={labelSeccion}>Precio por</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {['Propiedad', 'Persona', 'Habitación'].map(pp => (
              <button
                key={pp}
                onClick={() => setFiltro('precioPor', filtros.precioPor === pp ? '' : pp)}
                style={{
                  padding: '5px 10px', fontSize: '12px', border: '1px solid',
                  borderColor: filtros.precioPor === pp ? '#1a237e' : '#ddd',
                  backgroundColor: filtros.precioPor === pp ? '#1a237e' : 'white',
                  color: filtros.precioPor === pp ? 'white' : '#555',
                  borderRadius: '15px', cursor: 'pointer'
                }}
              >
                {pp}
              </button>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* LUGARES DISPONIBLES */}
          <p style={labelSeccion}>Lugares disponibles (mínimo)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <button
              onClick={() => setFiltro('lugaresMin', Math.max(1, (filtros.lugaresMin || 1) - 1))}
              style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >−</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a237e', minWidth: '20px', textAlign: 'center' }}>
              {filtros.lugaresMin || 1}
            </span>
            <button
              onClick={() => setFiltro('lugaresMin', (filtros.lugaresMin || 1) + 1)}
              style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >+</button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

          {/* SERVICIOS */}
          <p style={labelSeccion}>Servicios</p>
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

        {/* ============ RESULTADOS ============ */}
        <div className="atr-search-results">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1633', margin: 0 }}>Buscar Vivienda</h1>
            <p style={{ color: '#7a7899', fontSize: '14px' }}>{totalPropiedades} {totalPropiedades === 1 ? 'vivienda encontrada' : 'viviendas encontradas'}</p>
          </div>

          {/* Mensaje de filtros relajados */}
          {mensajeRelajado && (
            <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>💡</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#856404', flex: 1 }}>{mensajeRelajado}</p>
            </div>
          )}

          {/* Buscador */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por título, descripción o código postal..."
              defaultValue={filtros.busqueda}
              onChange={(e) => handleBusqueda(e.target.value)}
              style={{ width: '100%', padding: '11px 12px 11px 38px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
            />
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
                    className="atr-property-card"
                  >
                    {/* Imagen */}
                    <div className="atr-property-img">
                      {propiedad.fotoPrincipal ? (
                        <img src={`${BASE_URL}${propiedad.fotoPrincipal}`} alt={propiedad.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                          <span style={{ fontSize: '12px', color: '#7a7899', display: 'block' }}>por {propiedad.precioPor?.toLowerCase() || 'mes'}</span>
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
                        <span>💵 por {propiedad.precioPor?.toLowerCase()}</span>
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

const labelSeccion = {
  fontSize: '12px', fontWeight: '700', color: '#555',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  marginBottom: '8px', marginTop: 0
}

export default BuscarVivienda
