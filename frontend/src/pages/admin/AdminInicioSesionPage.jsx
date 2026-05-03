import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginAdmin } from '../../services/authService'
import NavbarRegistro from '../../components/common/NavbarRegistro'

const AdminInicioSesionPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    adminUser: '',
    adminContra: ''
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const response = await loginAdmin(formData.adminUser, formData.adminContra)
      localStorage.setItem('adminUser', response.adminUser)
      localStorage.setItem('adminId', response.adminId)
      navigate('/admin/arrendatarios')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#1a3a4a' }}>
      <NavbarRegistro />

      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: '#1a3a4a' }}>👑 Admin Burroomies</h1>
            <p style={{ color: '#666' }}>Inicia sesión como administrador</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Usuario:
              </label>
              <input
                type="text"
                name="adminUser"
                value={formData.adminUser}
                onChange={handleChange}
                placeholder="Ej: admin_root"
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Contraseña:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  name="adminContra"
                  value={formData.adminContra}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                  style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#6b7280' }}
                >
                  {mostrarPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '5px', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a3a4a', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', opacity: cargando ? 0.7 : 1 }}
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: '#1a3a4a', textDecoration: 'none' }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#333', color: 'white', textAlign: 'center', padding: '1rem', marginTop: 'auto' }}>
        Burroomies
      </footer>
    </div>
  )
}

export default AdminInicioSesionPage