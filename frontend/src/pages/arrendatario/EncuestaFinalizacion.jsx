import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavbarArrendatario from '../../components/common/NavbarArrendatario'
import FooterInicio from '../../components/common/FooterInicio'
import '../../styles/Arrendatario.css'

const EncuestaFinalizacion = () => {
  const { idArrendamiento } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [completado, setCompletado] = useState(false)
  
  const [serviciosPropiedad, setServiciosPropiedad] = useState({
    basicos: false,
    entretenimiento: false,
    adicionales: false
  })
  
  const [calServiciosBasicos, setCalServiciosBasicos] = useState(0)
  const [calEntretenimiento, setCalEntretenimiento] = useState(0)
  const [calAdicionales, setCalAdicionales] = useState(0)
  const [calGeneral, setCalGeneral] = useState(0)
  const [resena, setResena] = useState('')

  useEffect(() => {
    cargarArrendamiento()
  }, [])

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
    } catch (error) {
      setError('No se pudo cargar la información')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEnviarEncuesta = async () => {
    if (calGeneral === 0) {
      alert('La calificación general es obligatoria')
      return
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
        alert(result.message || 'Error al enviar la encuesta')
      }
    } catch (error) {
      alert('Error al enviar la encuesta')
      console.error('Error:', error)
    } finally {
      setEnviando(false)
    }
  }

  const renderEstrellas = (valor, onChange) => {
    return (
      <div className="atr-stars">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            onClick={() => onChange(num)}
            className={`atr-star ${num <= valor ? 'active' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-main">
          <div className="atr-loading">
            <p>Cargando...</p>
          </div>
        </div>
        <FooterInicio />
      </div>
    )
  }

  if (completado) {
    return (
      <div className="atr-page">
        <NavbarArrendatario />
        <div className="atr-verify-wrapper">
          <div className="atr-verify-card atr-verify-card-success">
            <div className="atr-verify-header atr-verify-header-success">
              <div className="atr-verify-header-icon">✅</div>
              <div className="atr-verify-header-title">¡Encuesta enviada con éxito!</div>
              <div className="atr-verify-header-sub">
                Tu arrendamiento ha sido finalizado
              </div>
            </div>
            <div className="atr-verify-body">
              <div className="atr-alert atr-alert-success">
                <div className="atr-alert-icon">🎉</div>
                <div className="atr-alert-body">
                  <div className="atr-alert-title">¡Gracias por tu opinión!</div>
                  <div className="atr-alert-desc">
                    Tu arrendamiento ha sido finalizado exitosamente.
                  </div>
                </div>
              </div>
              <div className="atr-btn-group">
                <button 
                  onClick={() => navigate('/arrendatario/mi-arrendamiento')}
                  className="atr-btn-primary"
                >
                  Volver a Mi Arrendamiento
                </button>
              </div>
            </div>
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
        <h1 className="atr-page-title" style={{ textAlign: 'center' }}>📝 Encuesta de Finalización</h1>
        <p style={{ textAlign: 'center', color: '#7a7899', fontSize: '14px', marginBottom: '30px' }}>
          Califica del 1 al 5 tu experiencia<br />
          <span style={{ fontSize: '12px' }}>(1 = Muy malo · 5 = Excelente)</span>
        </p>

        {/* CALIFICACIÓN GENERAL (OBLIGATORIA) */}
        <div className="atr-survey-card atr-survey-card-required">
          <div className="atr-survey-card-title">
            ⭐ ¿En general, qué calificación le darías a tu experiencia arrendando esta vivienda?
          </div>
          <div className="atr-survey-card-required-label">* Obligatorio</div>
          {renderEstrellas(calGeneral, setCalGeneral)}
          {calGeneral > 0 && (
            <div className="atr-star-label">
              {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calGeneral]}
            </div>
          )}
        </div>

        {/* SERVICIOS BÁSICOS (condicional) */}
        {serviciosPropiedad.basicos && (
          <div className="atr-survey-card">
            <div className="atr-survey-card-title">
              🔌 ¿Qué tal te parecieron los servicios básicos que te proporcionó la vivienda?
            </div>
            {renderEstrellas(calServiciosBasicos, setCalServiciosBasicos)}
            {calServiciosBasicos > 0 && (
              <div className="atr-star-label">
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calServiciosBasicos]}
              </div>
            )}
          </div>
        )}

        {/* ENTRETENIMIENTO (condicional) */}
        {serviciosPropiedad.entretenimiento && (
          <div className="atr-survey-card">
            <div className="atr-survey-card-title">
              🎮 ¿Qué tal te parecieron los servicios de entretenimiento?
            </div>
            {renderEstrellas(calEntretenimiento, setCalEntretenimiento)}
            {calEntretenimiento > 0 && (
              <div className="atr-star-label">
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calEntretenimiento]}
              </div>
            )}
          </div>
        )}

        {/* ADICIONALES (condicional) */}
        {serviciosPropiedad.adicionales && (
          <div className="atr-survey-card">
            <div className="atr-survey-card-title">
              ✨ ¿Qué tal te parecieron los servicios adicionales?
            </div>
            {renderEstrellas(calAdicionales, setCalAdicionales)}
            {calAdicionales > 0 && (
              <div className="atr-star-label">
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calAdicionales]}
              </div>
            )}
          </div>
        )}

        {/* RESEÑA ESCRITA */}
        <div className="atr-survey-card">
          <div className="atr-survey-card-title">
            💬 ¿Quieres dejar una reseña sobre tu experiencia?
          </div>
          <textarea
            value={resena}
            onChange={(e) => setResena(e.target.value)}
            placeholder="Cuéntanos tu experiencia viviendo aquí..."
            rows={4}
            className="atr-textarea"
          />
        </div>

        {/* BOTÓN ENVIAR */}
        <button 
          onClick={handleEnviarEncuesta}
          disabled={enviando}
          className="atr-btn-primary"
          style={{ marginBottom: '30px' }}
        >
          {enviando ? 'Enviando...' : '✅ Finalizar Encuesta'}
        </button>
      </div>

      <FooterInicio />
    </div>
  )
}

export default EncuestaFinalizacion