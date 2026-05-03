import React, { useState, useEffect } from 'react'
import { getUnidadesAcademicas, getCarrerasByUnidad } from '../../services/catalogosService'
import { updateArrendatario } from '../../services/adminService'

const inputStyle = {
  width: '100%',
  padding: '0.45rem 0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '0.25rem',
}

const fieldStyle = { marginBottom: '0.65rem' }
const errorStyle = { color: '#dc2626', fontSize: '0.75rem', marginTop: '2px' }
const disabledInput = { ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280' }

const FormEstudiante = ({ arrendatario, onClose, onSuccess }) => {
  const [unidades, setUnidades] = useState([])
  const [carreras, setCarreras] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const isVerified = arrendatario?.arrendatarioVerificado === 1

  const [formData, setFormData] = useState({
    usuarioNom: '', usuarioApePat: '', usuarioApeMat: '',
    usuarioCorreo: '', usuarioTel: '', usuarioCurp: '',
    usuarioFechaNac: '', arrendatarioBoleta: '',
    carrera_idCarrera: '', escuelaId: ''
  })

  useEffect(() => {
    if (arrendatario) {
      setFormData({
        usuarioNom: arrendatario.Usuario?.usuarioNom || '',
        usuarioApePat: arrendatario.Usuario?.usuarioApePat || '',
        usuarioApeMat: arrendatario.Usuario?.usuarioApeMat || '',
        usuarioCorreo: arrendatario.Usuario?.usuarioCorreo || '',
        usuarioTel: arrendatario.Usuario?.usuarioTel || '',
        usuarioCurp: arrendatario.Usuario?.usuarioCurp || '',
        usuarioFechaNac: arrendatario.Usuario?.usuarioFechaNac || '',
        arrendatarioBoleta: arrendatario.arrendatarioBoleta || '',
        carrera_idCarrera: arrendatario.carrera_idCarrera || '',
        escuelaId: arrendatario.Carrera?.idUnidadAcademica || ''
      })
      if (arrendatario.Carrera?.idUnidadAcademica) cargarCarreras(arrendatario.Carrera.idUnidadAcademica)
    }
  }, [arrendatario])

  useEffect(() => {
    const cargar = async () => {
      try { const data = await getUnidadesAcademicas(); setUnidades(data) } catch { }
    }
    cargar()
  }, [])

  const cargarCarreras = async (id) => {
    setLoading(true)
    try { const data = await getCarrerasByUnidad(id); setCarreras(data) } catch { }
    finally { setLoading(false) }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let v = value
    if (['usuarioNom', 'usuarioApePat', 'usuarioApeMat'].includes(name)) {
      v = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')
    }
    if (name === 'usuarioTel') v = value.replace(/[^0-9]/g, '').slice(0, 10)
    if (name === 'usuarioCurp') v = value.toUpperCase().slice(0, 18)
    if (name === 'arrendatarioBoleta') v = value.replace(/[^0-9]/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, [name]: v }))
    if (name === 'escuelaId') {
      setFormData(prev => ({ ...prev, escuelaId: v, carrera_idCarrera: '' }))
      cargarCarreras(v)
      return
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.usuarioNom) errs.usuarioNom = 'Obligatorio'
    if (!formData.usuarioApePat) errs.usuarioApePat = 'Obligatorio'
    if (formData.usuarioTel && formData.usuarioTel.length !== 10) errs.usuarioTel = 'Debe tener 10 dígitos'
    if (!isVerified && formData.usuarioCurp && formData.usuarioCurp.length !== 18) errs.usuarioCurp = 'Debe tener 18 caracteres'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true); setError('')
    const usuarioData = {
      usuarioNom: formData.usuarioNom, usuarioApePat: formData.usuarioApePat,
      usuarioApeMat: formData.usuarioApeMat, usuarioTel: formData.usuarioTel,
      usuarioFechaNac: formData.usuarioFechaNac,
      ...(!isVerified && { usuarioCurp: formData.usuarioCurp })
    }
    const arrendatarioData = {
      arrendatarioBoleta: formData.arrendatarioBoleta,
      carrera_idCarrera: formData.carrera_idCarrera
    }
    try {
      await updateArrendatario(arrendatario.idArrendatario, usuarioData, arrendatarioData)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
          {arrendatario ? 'Editar Estudiante' : 'Registrar Estudiante'}
        </h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: '1rem 1.25rem', maxHeight: '65vh', overflowY: 'auto' }}>
        {error && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', margin: '0 0 0.75rem' }}>{error}</p>}
        {isVerified && (
          <p style={{ background: '#f0fdf4', color: '#166534', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', margin: '0 0 0.75rem' }}>
            ✓ Estudiante verificado — CURP, boleta, correo y username no se pueden editar.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos Personales</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombres *</label>
              <input style={inputStyle} name="usuarioNom" value={formData.usuarioNom} onChange={handleChange} maxLength={80} />
              {errors.usuarioNom && <p style={errorStyle}>{errors.usuarioNom}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Ap. Paterno *</label>
              <input style={inputStyle} name="usuarioApePat" value={formData.usuarioApePat} onChange={handleChange} maxLength={60} />
              {errors.usuarioApePat && <p style={errorStyle}>{errors.usuarioApePat}</p>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ap. Materno</label>
            <input style={inputStyle} name="usuarioApeMat" value={formData.usuarioApeMat} onChange={handleChange} maxLength={60} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Correo</label>
              <input style={disabledInput} value={formData.usuarioCorreo} disabled />
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '2px 0 0' }}>No modificable</p>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Teléfono (10 dígitos)</label>
              <input style={inputStyle} type="tel" name="usuarioTel" value={formData.usuarioTel} onChange={handleChange} maxLength={10} />
              {errors.usuarioTel && <p style={errorStyle}>{errors.usuarioTel}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>CURP (18 car.)</label>
              <input style={isVerified ? disabledInput : inputStyle} name="usuarioCurp" value={formData.usuarioCurp} onChange={handleChange} disabled={isVerified} maxLength={18} />
              {errors.usuarioCurp && <p style={errorStyle}>{errors.usuarioCurp}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Fecha de Nacimiento</label>
              <input style={{ ...inputStyle, width: 'auto' }} type="date" name="usuarioFechaNac" value={formData.usuarioFechaNac} onChange={handleChange} />
            </div>
          </div>

          <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos Académicos</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Escuela</label>
              <select style={inputStyle} name="escuelaId" value={formData.escuelaId} onChange={handleChange}>
                <option value="">Selecciona</option>
                {unidades.map(u => <option key={u.idUnidadAcademica} value={u.idUnidadAcademica}>{u.unidadAcademicaNombre}</option>)}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Carrera</label>
              <select style={inputStyle} name="carrera_idCarrera" value={formData.carrera_idCarrera} onChange={handleChange} disabled={!formData.escuelaId || loading}>
                <option value="">{loading ? 'Cargando...' : 'Selecciona'}</option>
                {carreras.map(c => <option key={c.idCarrera} value={c.idCarrera}>{c.carreraNombre}</option>)}
              </select>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Boleta</label>
            <input style={isVerified ? disabledInput : inputStyle} name="arrendatarioBoleta" value={formData.arrendatarioBoleta} onChange={handleChange} disabled={isVerified} maxLength={10} />
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
        <button type="button" onClick={onClose} style={{ padding: '0.45rem 1rem', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', color: '#374151' }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={saving} style={{ padding: '0.45rem 1rem', backgroundColor: saving ? '#86efac' : '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

export default FormEstudiante