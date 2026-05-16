import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'

const GROSERIAS = [
  'pendejo', 'pendeja', 'puta', 'puto', 'chinga', 'chingada', 'chingado',
  'mierda', 'cabron', 'cabrona', 'pinche', 'culero', 'culera', 'idiota',
  'estupido', 'estupida', 'mamadas', 'verga', 'culo', 'hdp', 'hijo de puta',
  'perra', 'perro', 'joto', 'wey', 'buey', 'chido', 'chingar'
]

const EncuestaFinalizacion = () => {
  const { idArrendamiento } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [completado, setCompletado] = useState(false)

  // Datos del arrendamiento
  const [serviciosPropiedad, setServiciosPropiedad] = useState({
    basicos: false,
    entretenimiento: false,
    adicionales: false
  })
  const [listaServicios, setListaServicios] = useState([])

  // Calificaciones
  const [calServiciosBasicos, setCalServiciosBasicos] = useState(0)
  const [calEntretenimiento, setCalEntretenimiento] = useState(0)
  const [calAdicionales, setCalAdicionales] = useState(0)
  const [calGeneral, setCalGeneral] = useState(0)
  const [resena, setResena] = useState('')

  // Estado para el modal
  const [modal, setModal] = useState({ isOpen: false, message: '' })

  useEffect(() => {
    cargarArrendamiento()
  }, [])

  const mostrarModal = (message) => {
    setModal({ isOpen: true, message })
  }

  const cerrarModal = () => {
    setModal({ isOpen: false, message: '' })
  }

  const cargarArrendamiento = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('burroomies_token')
      const response = await fetch(`http://localhost:5000/api/arrendamientos/${idArrendamiento}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Error al cargar')

      const data = await response.json()

      const servicios = data.propiedad?.servicios || []
      setServiciosPropiedad({
        basicos: servicios.some(s => s.servicioCategoria === 'Basico'),
        entretenimiento: servicios.some(s => s.servicioCategoria === 'Entretenimiento'),
        adicionales: servicios.some(s => s.servicioCategoria === 'Adicional')
      })
      setListaServicios(servicios)

    } catch (error) {
      setError('No se pudo cargar la información')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnviarEncuesta = async () => {
    if (calGeneral === 0) {
      mostrarModal('La calificación general es obligatoria')
      return
    }

    // Filtro de groserías
    if (resena.trim()) {
      const resenaLower = resena.toLowerCase()
      if (GROSERIAS.some(g => resenaLower.includes(g))) {
        mostrarModal('Tu reseña contiene palabras inapropiadas. Por favor, expresa tu experiencia con respeto.')
        return
      }
    }

    try {
      setEnviando(true)
      const token = localStorage.getItem('token') || localStorage.getItem('burroomies_token')

      const datos = {
        resenaCalGen: calGeneral,
        resenaDescrip: resena || 'Sin comentarios',
        resenaDuracionRenta: null
      }

      if (serviciosPropiedad.basicos) {
        datos.resenaCalSerBasic = calServiciosBasicos || null
      }
      if (serviciosPropiedad.entretenimiento) {
        datos.resenaCalSerComEnt = calEntretenimiento || null
      }
      if (serviciosPropiedad.adicionales) {
        datos.resenaCalSerAdicio = calAdicionales || null
      }

      const response = await fetch(`http://localhost:5000/api/arrendamientos/${idArrendamiento}/finalizar-estudiante`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      })

      const result = await response.json()

      if (response.ok) {
        setCompletado(true)
      } else {
        mostrarModal(result.message || 'Error al enviar la encuesta')
      }
    } catch (error) {
      mostrarModal('Error al enviar la encuesta')
      console.error('Error:', error)
    } finally {
      setEnviando(false)
    }
  }

  // Función para filtrar servicios por categoría
  const filtrarServicios = (categoria) => {
    return listaServicios.filter(s => s.servicioCategoria === categoria)
  }

  const renderEstrellas = (valor, onChange) => {
    return (
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '5px' }}>
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            onClick={() => onChange(num)}
            style={{
              fontSize: '35px',
              cursor: 'pointer',
              color: num <= valor ? '#ffc107' : '#e0e0e0',
              transition: 'transform 0.1s',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const renderServiciosList = (categoria) => {
    const serviciosFiltrados = filtrarServicios(categoria)
    if (serviciosFiltrados.length === 0) return null

    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e8eaf6',
        borderRadius: '6px',
        padding: '14px',
        marginTop: '15px'
      }}>
        <p style={{ fontSize: '13px', color: '#555', marginBottom: '10px', fontWeight: '600' }}>
          Servicios {categoria.toLowerCase()} que ofrecía esta propiedad:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {serviciosFiltrados.map(s => (
            <span key={s.idServicio} style={{
              backgroundColor: '#e8eaf6',
              color: '#1a237e',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {s.servicioNombre || s.servicioCategoria}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavbarArrendatario />
        <div style={{ flex: 1, textAlign: 'center', padding: '60px' }}>
          <p>Cargando...</p>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (completado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavbarArrendatario />
        <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '60px', marginBottom: '20px' }}>✅</p>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>¡Encuesta enviada con éxito!</h2>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
            Tu arrendamiento ha sido finalizado. Gracias por tu opinión.
          </p>
          <button
            onClick={() => navigate('/arrendatario/mi-arrendamiento')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Volver a Mi Arrendamiento
          </button>
        </div>
        <FooterInicio />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarArrendatario />

      {/* Modal personalizado */}
      {modal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{
              fontSize: '40px',
              marginBottom: '15px'
            }}>
              ⚠️
            </p>
            <p style={{
              fontSize: '16px',
              color: '#333',
              marginBottom: '25px',
              lineHeight: '1.5'
            }}>
              {modal.message}
            </p>
            <button
              onClick={cerrarModal}
              style={{
                padding: '10px 25px',
                backgroundColor: '#1a237e',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, maxWidth: '700px', margin: '0 auto', padding: '20px', width: '100%' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '5px', textAlign: 'center' }}>📝 Encuesta de Finalización</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px' }}>
          Califica del 1 al 5 tu experiencia<br />
          <span style={{ fontSize: '12px', color: '#999' }}>
            (1 = Muy malo · 5 = Excelente)
          </span>
        </p>

        {/* CALIFICACIÓN GENERAL (OBLIGATORIA) */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #1a237e',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '15px', color: '#333' }}>
            ⭐ ¿En general, qué calificación le darías a tu experiencia arrendando esta vivienda?
          </h3>
          <p style={{ textAlign: 'center', color: '#dc3545', fontSize: '12px', marginBottom: '15px' }}>
            * Obligatorio
          </p>
          {renderEstrellas(calGeneral, setCalGeneral)}
          {calGeneral > 0 && (
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#1a237e', fontWeight: 'bold', marginTop: '10px' }}>
              {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calGeneral]}
            </p>
          )}
        </div>

        {/* SERVICIOS BÁSICOS (condicional) */}
        {serviciosPropiedad.basicos && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '25px',
            marginBottom: '20px'
          }}>
            <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '15px', color: '#333' }}>
              🔌 ¿Qué tal te parecieron los servicios básicos que te proporcionó la vivienda?
            </h3>
            {renderEstrellas(calServiciosBasicos, setCalServiciosBasicos)}
            {calServiciosBasicos > 0 && (
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#1a237e', fontWeight: 'bold', marginTop: '10px' }}>
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calServiciosBasicos]}
              </p>
            )}
            {renderServiciosList('Basico')}
          </div>
        )}

        {/* ENTRETENIMIENTO (condicional) */}
        {serviciosPropiedad.entretenimiento && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '25px',
            marginBottom: '20px'
          }}>
            <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '15px', color: '#333' }}>
              🎮 ¿Qué tal te parecieron los servicios de entretenimiento?
            </h3>
            {renderEstrellas(calEntretenimiento, setCalEntretenimiento)}
            {calEntretenimiento > 0 && (
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#1a237e', fontWeight: 'bold', marginTop: '10px' }}>
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calEntretenimiento]}
              </p>
            )}
            {renderServiciosList('Entretenimiento')}
          </div>
        )}

        {/* ADICIONALES (condicional) */}
        {serviciosPropiedad.adicionales && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '25px',
            marginBottom: '20px'
          }}>
            <h3 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '15px', color: '#333' }}>
              ✨ ¿Qué tal te parecieron los servicios adicionales?
            </h3>
            {renderEstrellas(calAdicionales, setCalAdicionales)}
            {calAdicionales > 0 && (
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#1a237e', fontWeight: 'bold', marginTop: '10px' }}>
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calAdicionales]}
              </p>
            )}
            {renderServiciosList('Adicional')}
          </div>
        )}

        {/* RESEÑA ESCRITA */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>
            💬 ¿Quieres dejar una reseña sobre tu experiencia?
          </h3>

          <textarea
            value={resena}
            onChange={(e) => setResena(e.target.value)}
            placeholder="Cuéntanos tu experiencia viviendo aquí..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* BOTÓN ENVIAR */}
        <button
          onClick={handleEnviarEncuesta}
          disabled={enviando}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: enviando ? '#ccc' : '#1a237e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: enviando ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '30px'
          }}
        >
          {enviando ? 'Enviando...' : '✅ Finalizar Encuesta'}
        </button>
      </div>

      <FooterInicio />
    </div>
  )
}

export default EncuestaFinalizacion