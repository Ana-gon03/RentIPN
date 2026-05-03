import React, { useState, useEffect } from 'react'
import { updatePropiedad } from '../../services/adminService'

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

const FormPropiedad = ({ propiedad, onClose, onSuccess }) => {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    propiedadTitulo: '', propiedadDescripcion: '', propiedadTipo: '',
    propiedadLugares: '', propiedadPrecio: '', propiedadEstatus: 'Disponible'
  })

  useEffect(() => {
    if (propiedad) {
      setFormData({
        propiedadTitulo: propiedad.propiedadTitulo || '',
        propiedadDescripcion: propiedad.propiedadDescripcion || '',
        propiedadTipo: propiedad.propiedadTipo || '',
        propiedadLugares: propiedad.propiedadLugares || '',
        propiedadPrecio: propiedad.propiedadPrecio || '',
        propiedadEstatus: propiedad.propiedadEstatus || 'Disponible'
      })
    }
  }, [propiedad])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.propiedadTitulo) errs.propiedadTitulo = 'Obligatorio'
    if (!formData.propiedadDescripcion) errs.propiedadDescripcion = 'Obligatorio'
    if (!formData.propiedadTipo) errs.propiedadTipo = 'Selecciona un tipo'
    if (!formData.propiedadLugares || parseInt(formData.propiedadLugares) < 1) errs.propiedadLugares = 'Debe ser al menos 1'
    if (!formData.propiedadPrecio || parseFloat(formData.propiedadPrecio) <= 0) errs.propiedadPrecio = 'Debe ser mayor a 0'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true); setError('')
    try {
      await updatePropiedad(propiedad.idPropiedad, {
        propiedadTitulo: formData.propiedadTitulo,
        propiedadDescripcion: formData.propiedadDescripcion,
        propiedadTipo: formData.propiedadTipo,
        propiedadLugares: parseInt(formData.propiedadLugares),
        propiedadPrecio: parseFloat(formData.propiedadPrecio),
        propiedadEstatus: formData.propiedadEstatus
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Editar Propiedad</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: '1rem 1.25rem', maxHeight: '65vh', overflowY: 'auto' }}>
        {error && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', margin: '0 0 0.75rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={fieldStyle}>
            <label style={labelStyle}>Título *</label>
            <input style={inputStyle} name="propiedadTitulo" value={formData.propiedadTitulo} onChange={handleChange} maxLength={100} />
            {errors.propiedadTitulo && <p style={errorStyle}>{errors.propiedadTitulo}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Descripción *</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} name="propiedadDescripcion" value={formData.propiedadDescripcion} onChange={handleChange} maxLength={500} rows={3} />
            {errors.propiedadDescripcion && <p style={errorStyle}>{errors.propiedadDescripcion}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo *</label>
              <select style={inputStyle} name="propiedadTipo" value={formData.propiedadTipo} onChange={handleChange}>
                <option value="">Selecciona</option>
                {['Casa', 'Departamento', 'Habitación', 'Loft', 'Estudio'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.propiedadTipo && <p style={errorStyle}>{errors.propiedadTipo}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Estatus *</label>
              <select style={inputStyle} name="propiedadEstatus" value={formData.propiedadEstatus} onChange={handleChange}>
                <option value="Disponible">Disponible</option>
                <option value="Sin Disponibilidad">Sin Disponibilidad</option>
                <option value="Desactivada">Desactivada</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Lugares *</label>
              <input style={inputStyle} type="number" name="propiedadLugares" value={formData.propiedadLugares} onChange={handleChange} min={1} max={50} />
              {errors.propiedadLugares && <p style={errorStyle}>{errors.propiedadLugares}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Precio mensual (MXN) *</label>
              <input style={inputStyle} type="number" name="propiedadPrecio" value={formData.propiedadPrecio} onChange={handleChange} min={0} step="0.01" />
              {errors.propiedadPrecio && <p style={errorStyle}>{errors.propiedadPrecio}</p>}
            </div>
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

export default FormPropiedad