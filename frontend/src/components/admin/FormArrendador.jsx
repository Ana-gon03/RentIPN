import React, { useState, useEffect } from 'react'
import { buscarCP } from '../../services/cpService'
import { updateArrendador } from '../../services/adminService'

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

const FormArrendador = ({ arrendador, onClose, onSuccess }) => {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [sugerenciasCP, setSugerenciasCP] = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [buscandoCP, setBuscandoCP] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    usuarioApePat: '', usuarioApeMat: '', usuarioNom: '',
    usuarioCorreo: '', usuarioTel: '', usuarioCurp: '',
    usuarioFechaNac: '', arrendadorRFC: '',
    direccionCalle: '', direccionNumExt: '', direccionNumInt: '',
    cp: '', colonia: '', municipio: '', estado: ''
  })

  const isVerified = arrendador?.arrendadorFechaVerificacion !== null

  useEffect(() => {
    if (arrendador) {
      setFormData({
        usuarioApePat: arrendador.usuario?.usuarioApePat || '',
        usuarioApeMat: arrendador.usuario?.usuarioApeMat || '',
        usuarioNom: arrendador.usuario?.usuarioNom || '',
        usuarioCorreo: arrendador.usuario?.usuarioCorreo || '',
        usuarioTel: arrendador.usuario?.usuarioTel || '',
        usuarioCurp: arrendador.usuario?.usuarioCurp || '',
        usuarioFechaNac: arrendador.usuario?.usuarioFechaNac || '',
        arrendadorRFC: arrendador.arrendadorRFC || '',
        direccionCalle: arrendador.direccion?.direccionCalle || '',
        direccionNumExt: arrendador.direccion?.direccionNumExt || '',
        direccionNumInt: arrendador.direccion?.direccionNumInt || '',
        cp: arrendador.direccion?.cp?.d_codigo || '',
        colonia: arrendador.direccion?.cp?.d_asenta || '',
        municipio: arrendador.direccion?.cp?.D_mnpio || '',
        estado: arrendador.direccion?.cp?.d_estado || ''
      })
    }
  }, [arrendador])

  const handleChange = (e) => {
    const { name, value } = e.target
    let v = value
    if (['usuarioNom', 'usuarioApePat', 'usuarioApeMat'].includes(name)) {
      v = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')
    }
    if (name === 'usuarioTel') v = value.replace(/[^0-9]/g, '').slice(0, 10)
    if (name === 'usuarioCurp') v = value.toUpperCase().slice(0, 18)
    if (name === 'arrendadorRFC') v = value.toUpperCase().slice(0, 13)
    setFormData(prev => ({ ...prev, [name]: v }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleCPChange = async (e) => {
    const cpNumeros = e.target.value.replace(/[^0-9]/g, '').slice(0, 5)
    setFormData(prev => ({ ...prev, cp: cpNumeros, colonia: '', municipio: '', estado: '' }))
    if (cpNumeros.length === 5) {
      setBuscandoCP(true)
      try {
        const resultados = await buscarCP(cpNumeros)
        if (resultados.length > 0) { setSugerenciasCP(resultados); setMostrarSugerencias(true) }
      } catch { } finally { setBuscandoCP(false) }
    } else { setSugerenciasCP([]); setMostrarSugerencias(false) }
  }

  const seleccionarDireccion = (d) => {
    setFormData(prev => ({ ...prev, cp: d.d_codigo, colonia: d.d_asenta, municipio: d.D_mnpio, estado: d.d_estado }))
    setMostrarSugerencias(false); setSugerenciasCP([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.usuarioNom) errs.usuarioNom = 'Obligatorio'
    if (!formData.usuarioApePat) errs.usuarioApePat = 'Obligatorio'
    if (formData.usuarioTel && formData.usuarioTel.length !== 10) errs.usuarioTel = 'Debe tener 10 dígitos'
    if (!isVerified && formData.usuarioCurp && formData.usuarioCurp.length !== 18) errs.usuarioCurp = 'Debe tener 18 caracteres'
    if (!isVerified && formData.arrendadorRFC && formData.arrendadorRFC.length < 12) errs.arrendadorRFC = 'RFC inválido (12-13 car.)'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSaving(true); setError('')
    const usuarioData = {
      usuarioNom: formData.usuarioNom, usuarioApePat: formData.usuarioApePat,
      usuarioApeMat: formData.usuarioApeMat, usuarioTel: formData.usuarioTel,
      usuarioFechaNac: formData.usuarioFechaNac,
      ...(!isVerified && { usuarioCurp: formData.usuarioCurp })
    }
    const arrendadorData = { arrendadorRFC: formData.arrendadorRFC }
    const direccionData = {
      calle: formData.direccionCalle, numExt: formData.direccionNumExt,
      numInt: formData.direccionNumInt, cp: formData.cp,
      colonia: formData.colonia, municipio: formData.municipio, estado: formData.estado
    }
    try {
      await updateArrendador(arrendador.idArrendador, usuarioData, arrendadorData, direccionData)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Editar Arrendador</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: '1rem 1.25rem', maxHeight: '65vh', overflowY: 'auto' }}>
        {error && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', margin: '0 0 0.75rem' }}>{error}</p>}
        {isVerified && (
          <p style={{ background: '#f0fdf4', color: '#166534', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', margin: '0 0 0.75rem' }}>
            ✓ Arrendador verificado — CURP, RFC y correo no se pueden editar.
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
              <label style={labelStyle}>RFC (12-13 car.)</label>
              <input style={isVerified ? disabledInput : inputStyle} name="arrendadorRFC" value={formData.arrendadorRFC} onChange={handleChange} disabled={isVerified} maxLength={13} />
              {errors.arrendadorRFC && <p style={errorStyle}>{errors.arrendadorRFC}</p>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Fecha de Nacimiento</label>
            <input style={{ ...inputStyle, width: 'auto' }} type="date" name="usuarioFechaNac" value={formData.usuarioFechaNac} onChange={handleChange} />
          </div>

          <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domicilio</p>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px', gap: '0 0.75rem' }}>
            <div style={{ ...fieldStyle, position: 'relative' }}>
              <label style={labelStyle}>C.P.</label>
              <input style={inputStyle} name="cp" value={formData.cp} onChange={handleCPChange} maxLength={5} />
              {buscandoCP && <p style={{ ...errorStyle, color: '#6b7280' }}>Buscando...</p>}
              {mostrarSugerencias && sugerenciasCP.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', maxHeight: '140px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {sugerenciasCP.map((s, i) => (
                    <div key={i} onClick={() => seleccionarDireccion(s)} style={{ padding: '0.5rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', borderBottom: '1px solid #f3f4f6' }}>
                      {s.d_asenta}, {s.D_mnpio}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Calle</label>
              <input style={inputStyle} name="direccionCalle" value={formData.direccionCalle} onChange={handleChange} maxLength={100} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>No. Ext</label>
              <input style={inputStyle} name="direccionNumExt" value={formData.direccionNumExt} onChange={handleChange} maxLength={10} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>No. Int</label>
              <input style={inputStyle} name="direccionNumInt" value={formData.direccionNumInt} onChange={handleChange} maxLength={10} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 0.75rem' }}>
            {[['Colonia', 'colonia'], ['Municipio', 'municipio'], ['Estado', 'estado']].map(([lbl, key]) => (
              <div key={key} style={fieldStyle}>
                <label style={labelStyle}>{lbl}</label>
                <input style={disabledInput} value={formData[key]} disabled />
              </div>
            ))}
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

export default FormArrendador