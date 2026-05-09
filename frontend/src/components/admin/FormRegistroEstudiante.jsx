import React, { useState, useEffect } from 'react'
import { getUnidadesAcademicas, getCarrerasByUnidad } from '../../services/catalogosService'
import { validarCampo } from '../../services/authService'
import { createArrendatario } from '../../services/adminService'

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

const FormRegistroEstudiante = ({ onClose, onSuccess }) => {
  const [unidades, setUnidades] = useState([])
  const [carreras, setCarreras] = useState([])
  const [loading, setLoading] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errors, setErrors] = useState({})
  const [validando, setValidando] = useState({})

  const [formData, setFormData] = useState({
    username: '', nombres: '', apellidoPaterno: '', apellidoMaterno: '',
    correo: '', telefono: '', curp: '', fechaNacimiento: '',
    escuela: '', carreraId: '', boleta: '',
    password: '', confirmPassword: '',
  })

  useEffect(() => {
    const cargar = async () => {
      try { const data = await getUnidadesAcademicas(); setUnidades(data) } catch { }
    }
    cargar()
  }, [])

  useEffect(() => {
    const cargarCarreras = async () => {
      if (formData.escuela) {
        setLoading(true)
        try { const data = await getCarrerasByUnidad(formData.escuela); setCarreras(data) } catch { }
        finally { setLoading(false) }
      } else { setCarreras([]) }
    }
    cargarCarreras()
  }, [formData.escuela])

  const validarCampoUnico = async (campo, valor) => {
    if (!valor || valor.length < 3) return true
    setValidando(prev => ({ ...prev, [campo]: true }))
    try {
      const result = await validarCampo(campo, valor)
      if (result.existe) {
        const msgs = { username: 'El username ya está registrado', correo: 'El correo ya está registrado', curp: 'El CURP ya está registrado', boleta: 'La boleta ya está registrada' }
        setErrors(prev => ({ ...prev, [campo]: msgs[campo] }))
        return false
      } else { setErrors(prev => ({ ...prev, [campo]: null })); return true }
    } catch { return true }
    finally { setValidando(prev => ({ ...prev, [campo]: false })) }
  }

  const handleBlur = async (e) => {
    const { name, value } = e.target
    if (['username', 'correo', 'curp', 'boleta'].includes(name)) await validarCampoUnico(name, value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let v = value
    if (['nombres', 'apellidoPaterno', 'apellidoMaterno'].includes(name)) {
      v = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')
    }
    if (name === 'telefono') v = value.replace(/[^0-9]/g, '').slice(0, 10)
    if (name === 'curp') v = value.toUpperCase().slice(0, 18)
    if (name === 'boleta') v = value.replace(/[^0-9]/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, [name]: v }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validarPassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p)

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate())
    if (hoy < cumpleEsteAnio) edad--
    return edad
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!formData.username) errs.username = 'Obligatorio'
    if (!formData.nombres) errs.nombres = 'Obligatorio'
    if (!formData.apellidoPaterno) errs.apellidoPaterno = 'Obligatorio'
    if (!formData.apellidoMaterno) errs.apellidoMaterno = 'Obligatorio'
    if (!formData.correo) errs.correo = 'Obligatorio'
    if (!formData.telefono || formData.telefono.length !== 10) errs.telefono = 'Debe tener 10 dígitos'
    if (!formData.curp || formData.curp.length !== 18) errs.curp = 'Debe tener 18 caracteres'
    if (!formData.fechaNacimiento) errs.fechaNacimiento = 'Obligatorio'
    else if (calcularEdad(formData.fechaNacimiento) < 17) errs.fechaNacimiento = 'El estudiante debe tener al menos 17 años'
    if (!formData.escuela) errs.escuela = 'Selecciona una escuela'
    if (!formData.carreraId) errs.carreraId = 'Selecciona una carrera'
    if (!formData.boleta) errs.boleta = 'Obligatorio'
    if (!formData.password) errs.password = 'Obligatorio'
    else if (!validarPassword(formData.password)) errs.password = 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo'
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // Validar duplicados
    const checks = await Promise.all([
      validarCampoUnico('username', formData.username),
      validarCampoUnico('correo', formData.correo),
      validarCampoUnico('curp', formData.curp),
      validarCampoUnico('boleta', formData.boleta),
    ])
    if (checks.includes(false)) return

    setEnviando(true)
    try {
      await createArrendatario({
        username: formData.username, nombres: formData.nombres,
        apellidoPaterno: formData.apellidoPaterno, apellidoMaterno: formData.apellidoMaterno,
        correo: formData.correo, telefono: formData.telefono,
        curp: formData.curp, fechaNacimiento: formData.fechaNacimiento,
        carreraId: parseInt(formData.carreraId), boleta: formData.boleta,
        password: formData.password,
      })
      onSuccess()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar')
    } finally { setEnviando(false) }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Registrar Estudiante</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: '1rem 1.25rem', maxHeight: '65vh', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} noValidate>

          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos Personales</p>

          <div style={fieldStyle}>
            <label style={labelStyle}>Username *</label>
            <input style={inputStyle} name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} maxLength={30} />
            {validando.username && <p style={{ ...errorStyle, color: '#6b7280' }}>Validando...</p>}
            {errors.username && <p style={errorStyle}>{errors.username}</p>}
          </div>

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
            <label style={labelStyle}>Ap. Materno *</label>
            <input style={inputStyle} name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} maxLength={60} />
            {errors.apellidoMaterno && <p style={errorStyle}>{errors.apellidoMaterno}</p>}
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
              <label style={labelStyle}>Fecha de Nacimiento *</label>
              <input style={inputStyle} type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
              {errors.fechaNacimiento && <p style={errorStyle}>{errors.fechaNacimiento}</p>}
            </div>
          </div>

          <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos Académicos</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Escuela *</label>
              <select style={inputStyle} name="escuela" value={formData.escuela} onChange={handleChange}>
                <option value="">Selecciona</option>
                {unidades.map(u => <option key={u.idUnidadAcademica} value={u.idUnidadAcademica}>{u.unidadAcademicaNombre}</option>)}
              </select>
              {errors.escuela && <p style={errorStyle}>{errors.escuela}</p>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Carrera *</label>
              <select style={inputStyle} name="carreraId" value={formData.carreraId} onChange={handleChange} disabled={!formData.escuela || loading}>
                <option value="">{loading ? 'Cargando...' : 'Selecciona'}</option>
                {carreras.map(c => <option key={c.idCarrera} value={c.idCarrera}>{c.carreraNombre}</option>)}
              </select>
              {errors.carreraId && <p style={errorStyle}>{errors.carreraId}</p>}
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Boleta *</label>
            <input style={inputStyle} name="boleta" value={formData.boleta} onChange={handleChange} onBlur={handleBlur} maxLength={10} />
            {validando.boleta && <p style={{ ...errorStyle, color: '#6b7280' }}>Validando...</p>}
            {errors.boleta && <p style={errorStyle}>{errors.boleta}</p>}
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

export default FormRegistroEstudiante