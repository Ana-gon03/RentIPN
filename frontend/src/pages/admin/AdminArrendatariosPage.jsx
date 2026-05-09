import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../components/common/NavbarAdmin'
import FooterAdmin from '../../components/common/FooterAdmin'
import { getArrendatarios, deleteArrendatario } from '../../services/adminService'
import FormEstudiante from '../../components/admin/FormEstudiante'
import FormRegistroEstudiante from '../../components/admin/FormRegistroEstudiante'

const AdminArrendatariosPage = () => {
  const [arrendatarios, setArrendatarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedArrendatario, setSelectedArrendatario] = useState(null)
  const [modalType, setModalType] = useState('')
  const [error, setError] = useState('')

  const loadArrendatarios = async () => {
    setLoading(true)
    try {
      const data = await getArrendatarios(search)
      setArrendatarios(data.filter(a => a.idUsuario !== 10))
    } catch (error) {
      console.error('Error cargando arrendatarios:', error)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadArrendatarios() }, [search])

  const handleView = (a) => { setSelectedArrendatario(a); setModalType('view'); setShowModal(true) }
  const handleEdit = (a) => { setSelectedArrendatario(a); setModalType('edit'); setShowModal(true) }
  const handleDelete = (a) => {
    if (a.tieneRentasActivas) { alert('❌ No se puede eliminar: tiene rentas activas'); return }
    setSelectedArrendatario(a); setModalType('delete'); setShowModal(true)
  }
  const confirmDelete = async () => {
    try { await deleteArrendatario(selectedArrendatario.idArrendatario); setShowModal(false); loadArrendatarios() }
    catch (error) { alert(error.response?.data?.error || 'Error al eliminar') }
  }

  const modalWidth = (modalType === 'edit' || modalType === 'create') ? '860px' : '480px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarAdmin />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Gestión de Estudiantes (Arrendatarios)</h1>
          <button onClick={() => { setSelectedArrendatario(null); setModalType('create'); setShowModal(true) }}>
            + Agregar Estudiante
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input type="text" placeholder="🔍 Buscar por boleta, username, correo o CURP..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
        </div>

        {loading ? <p>Cargando...</p> : error ? <p style={{ color: 'red' }}>{error}</p> :
          arrendatarios.length === 0 ? <p>No hay estudiantes registrados</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre Completo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Boleta</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Correo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>CURP</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Verificado</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {arrendatarios.map((a) => (
                  <tr key={a.idArrendatario} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{a.idArrendatario}</td>
                    <td style={{ padding: '0.75rem' }}>{a.arrendatarioUser || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.usuario?.usuarioApePat} {a.usuario?.usuarioApeMat || ''} {a.usuario?.usuarioNom}</td>
                    <td style={{ padding: '0.75rem' }}>{a.arrendatarioBoleta || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.usuario?.usuarioCorreo || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.usuario?.usuarioCurp || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ backgroundColor: a.arrendatarioVerificado === 1 ? '#28a745' : '#ffc107', color: a.arrendatarioVerificado === 1 ? 'white' : '#333', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.8rem' }}>
                        {a.arrendatarioVerificado === 1 ? '✓ Verificado' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button onClick={() => handleView(a)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>👁️ Ver</button>
                      <button onClick={() => handleEdit(a)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(a)} disabled={a.tieneRentasActivas} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <FooterAdmin />

      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
        >
          <div style={{ backgroundColor: 'white', borderRadius: '10px', width: '100%', maxWidth: modalWidth, maxHeight: '95vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {modalType === 'view' && selectedArrendatario && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Información del Estudiante</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
                  {[
                    ['ID', selectedArrendatario.idArrendatario],
                    ['Username', selectedArrendatario.arrendatarioUser],
                    ['Nombre', `${selectedArrendatario.usuario?.usuarioApePat} ${selectedArrendatario.usuario?.usuarioApeMat || ''} ${selectedArrendatario.usuario?.usuarioNom}`],
                    ['Boleta', selectedArrendatario.arrendatarioBoleta],
                    ['Correo', selectedArrendatario.usuario?.usuarioCorreo],
                    ['Teléfono', selectedArrendatario.usuario?.usuarioTel],
                    ['CURP', selectedArrendatario.usuario?.usuarioCurp],
                    ['Fecha Nacimiento', selectedArrendatario.usuario?.usuarioFechaNac],
                    ['Escuela', selectedArrendatario.carrera?.unidadAcademica?.unidadAcademicaNombre],
                    ['Carrera', selectedArrendatario.carrera?.carreraNombre],
                    ['Verificado', selectedArrendatario.arrendatarioVerificado === 1 ? 'Sí' : 'No'],
                  ].map(([k, v]) => (
                    <p key={k} style={{ margin: '0.4rem 0', fontSize: '0.875rem' }}><strong>{k}:</strong> {v || '-'}</p>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: '0.45rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Cerrar</button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedArrendatario && (
              <FormEstudiante arrendatario={selectedArrendatario} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); loadArrendatarios() }} />
            )}

            {modalType === 'create' && (
              <FormRegistroEstudiante onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); loadArrendatarios() }} />
            )}

            {modalType === 'delete' && selectedArrendatario && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#dc2626' }}>Eliminar Estudiante</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.875rem' }}>¿Eliminar a <strong>{selectedArrendatario.usuario?.usuarioNom}</strong>? (Boleta: {selectedArrendatario.arrendatarioBoleta})</p>
                  <p style={{ color: '#dc2626', fontSize: '0.8rem' }}>⚠️ Esta acción no se puede deshacer. Las reseñas serán redirigidas al usuario por defecto.</p>
                </div>
                <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: '0.45rem 1rem', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Cancelar</button>
                  <button onClick={confirmDelete} style={{ padding: '0.45rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}>Sí, eliminar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminArrendatariosPage