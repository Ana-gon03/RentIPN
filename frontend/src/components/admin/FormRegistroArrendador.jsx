import React, { useState } from 'react'
import { buscarCP } from '../../services/cpService'
import { validarCampo } from '../../services/authService'
import { createArrendador } from '../../services/adminService'

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

const FormRegistroArrendador = ({ onClose, onSuccess }) => {
  const [enviando, setEnviando] = useState(false)
  const [sugerenciasCP, setSugerenciasCP] = useState([])
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [buscandoCP, setBuscandoCP] = useState(false)
  const [errors, setErrors] = useState({})
  const [validando, setValidando] = useState({})

  const [formData, setFormData] = useState({
    nombres: '', apellidoPaterno: '', apellidoMaterno: '',
    correo: '', telefono: '', curp: '', fechaNacimiento: '',
    rfc: '', cp: '', calle: '', numExt: '', numInt: '',
    colonia: '', municipio: '', estado: '',
    password: '', confirmPassword: '',
  })

  const validarCampoUnico = async (campo, valor) => {
    if (!valor || valor.length < 3) return true
    setValidando(prev => ({ ...prev, [campo]: true }))
    try {
      const result = await validarCampo(campo, valor)
      if (result.existe) {
        const msgs = { correo: 'El correo ya está registrado', curp: 'El CURP ya está registrado', rfc: 'El RFC ya está registrado' }
        setErrors(prev => ({ ...prev, [campo]: msgs[campo] }))
        return false
      } else {
        setErrors(prev => ({ ...prev, [campo]: null }))
        return true
      }
    } catch { return true }
    finally { setValidando(prev => ({ ...prev, [campo]: false })) }
  }

  const handleBlur = async (e) => {
    const { name, value } = e.target
    if (['correo', 'curp', 'rfc'].includes(name)) await validarCampoUnico(name, value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let v = value
    // Solo letras para nombres
    if (['nombres', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
      v = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')
    }
    // Solo números para teléfono
    if (name === 'telefono') v = value.replace(/[^0-9]/g, '').slice(0, 10)
    // CURP uppercase
    if (name === 'curp') v = value.toUpperCase().slice(0, 18)
    // RFC uppercase
    if (name === 'rfc') v = value.toUpperCase().slice(0, 13)

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

  const validarPassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.nombres) errs.nombres = 'Obligatorio'
    if (!formData.apellidoPaterno) errs.apellidoPaterno = 'Obligatorio'
    if (!formData.correo) errs.correo = 'Obligatorio'
    if (!formData.telefono || formData.telefono.length !== 10) errs.telefono = 'Debe tener 10 dígitos'
    if (!formData.curp || formData.curp.length !== 18) errs.curp = 'Debe tener 18 caracteres'
    if (!formData.fechaNacimiento) errs.fechaNacimiento = 'Obligatorio'
    if (!formData.rfc || formData.rfc.length < 12) errs.rfc = 'RFC inválido (12-13 caracteres)'
    if (!formData.cp || formData.cp.length !== 5) errs.cp = 'Debe tener 5 dígitos'
    if (!formData.calle) errs.calle = 'Obligatorio'
    if (!formData.numExt) errs.numExt = 'Obligatorio'
    if (!formData.password) errs.password = 'Obligatorio'
    else if (!validarPassword(formData.password)) errs.password = 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo'
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // Validar duplicados
    const checks = await Promise.all([
      validarCampoUnico('correo', formData.correo),
      validarCampoUnico('curp', formData.curp),
      validarCampoUnico('rfc', formData.rfc),
    ])
    if (checks.includes(false)) return

    setEnviando(true)
    try {
      await createArrendador({
        nombres: formData.nombres, apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno, correo: formData.correo,
        telefono: formData.telefono, curp: formData.curp,
        fechaNacimiento: formData.fechaNacimiento, rfc: formData.rfc,
        calle: formData.calle, numExt: formData.numExt, numInt: formData.numInt,
        cp: formData.cp, colonia: formData.colonia, municipio: formData.municipio,
        estado: formData.estado, password: formData.password,
      })
      onSuccess()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar')
    } finally { setEnviando(false) }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Registrar Arrendador</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}>×</button>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.25rem', maxHeight: '65vh', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} noValidate>

          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos Personales</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombres *</label>
              <input style={inputStyle} name="nombres" value={formData.nombres} onChange={handleChange} maxLength={80} />
              {errors.nombres && <p style={errorStyle}>{errors.nombres}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Ap. Paterno *</label>
              <input style={inputStyle} name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} maxLength={60} />
              {errors.apellidoPaterno && <p style={errorStyle}>{errors.apellidoPaterno}</p>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ap. Materno</label>
            <input style={inputStyle} name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} maxLength={60} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Correo *</label>
              <input style={inputStyle} type="email" name="correo" value={formData.correo} onChange={handleChange} onBlur={handleBlur} maxLength={100} />
              {validando.correo && <p style={{ ...errorStyle, color: '#6b7280' }}>Validando...</p>}
              {errors.correo && <p style={errorStyle}>{errors.correo}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Teléfono * (10 dígitos)</label>
              <input style={inputStyle} type="tel" name="telefono" value={formData.telefono} onChange={handleChange} maxLength={10} />
              {errors.telefono && <p style={errorStyle}>{errors.telefono}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>CURP * (18 car.)</label>
              <input style={inputStyle} name="curp" value={formData.curp} onChange={handleChange} onBlur={handleBlur} maxLength={18} />
              {validando.curp && <p style={{ ...errorStyle, color: '#6b7280' }}>Validando...</p>}
              {errors.curp && <p style={errorStyle}>{errors.curp}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>RFC * (12-13 car.)</label>
              <input style={inputStyle} name="rfc" value={formData.rfc} onChange={handleChange} onBlur={handleBlur} maxLength={13} />
              {errors.rfc && <p style={errorStyle}>{errors.rfc}</p>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Fecha de Nacimiento *</label>
            <input style={{ ...inputStyle, width: 'auto' }} type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
            {errors.fechaNacimiento && <p style={errorStyle}>{errors.fechaNacimiento}</p>}
          </div>

          <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domicilio</p>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px', gap: '0 0.75rem' }}>
            <div style={{ ...fieldStyle, position: 'relative' }}>
              <label style={labelStyle}>C.P. *</label>
              <input style={inputStyle} name="cp" value={formData.cp} onChange={handleCPChange} maxLength={5} />
              {buscandoCP && <p style={{ ...errorStyle, color: '#6b7280' }}>Buscando...</p>}
              {errors.cp && <p style={errorStyle}>{errors.cp}</p>}
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
              <label style={labelStyle}>Calle *</label>
              <input style={inputStyle} name="calle" value={formData.calle} onChange={handleChange} maxLength={100} />
              {errors.calle && <p style={errorStyle}>{errors.calle}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>No. Ext *</label>
              <input style={inputStyle} name="numExt" value={formData.numExt} onChange={handleChange} maxLength={10} />
              {errors.numExt && <p style={errorStyle}>{errors.numExt}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>No. Int</label>
              <input style={inputStyle} name="numInt" value={formData.numInt} onChange={handleChange} maxLength={10} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 0.75rem' }}>
            {[['Colonia', 'colonia'], ['Municipio', 'municipio'], ['Estado', 'estado']].map(([lbl, key]) => (
              <div key={key} style={fieldStyle}>
                <label style={labelStyle}>{lbl}</label>
                <input style={{ ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280' }} value={formData[key]} disabled />
              </div>
            ))}
          </div>

          <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Contraseña *</label>
              <input style={inputStyle} type="password" name="password" value={formData.password} onChange={handleChange} maxLength={64} />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Confirmar *</label>
              <input style={inputStyle} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} maxLength={64} />
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '-0.3rem 0 0.75rem' }}>Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo (@$!%*?&)</p>

        </form>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb' }}>
        <button type="button" onClick={onClose} style={{ padding: '0.45rem 1rem', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer', color: '#374151' }}>
          Cancelar
        </button>
        <button onClick={handleSubmit} disabled={enviando} style={{ padding: '0.45rem 1rem', backgroundColor: enviando ? '#86efac' : '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
          {enviando ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </div>
  )
}

export default FormRegistroArrendador