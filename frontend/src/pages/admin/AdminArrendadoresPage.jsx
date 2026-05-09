import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../components/common/NavbarAdmin'
import FooterAdmin from '../../components/common/FooterAdmin'
import { getArrendadores, deleteArrendador } from '../../services/adminService'
import FormArrendador from '../../components/admin/FormArrendador'
import FormRegistroArrendador from '../../components/admin/FormRegistroArrendador'

const AdminArrendadoresPage = () => {
  const [arrendadores, setArrendadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedArrendador, setSelectedArrendador] = useState(null)
  const [modalType, setModalType] = useState('')
  const [error, setError] = useState('')

  const loadArrendadores = async () => {
    setLoading(true)
    try {
      const data = await getArrendadores(search)
      console.log('Primer arrendador:', JSON.stringify(data[0], null, 2))
      setArrendadores(data)
    } catch (error) {
      console.error('Error cargando arrendadores:', error)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadArrendadores() }, [search])

  const handleView = (a) => { setSelectedArrendador(a); setModalType('view'); setShowModal(true) }
  const handleEdit = (a) => { setSelectedArrendador(a); setModalType('edit'); setShowModal(true) }
  const handleDelete = (a) => {
    if (a.tienePropiedadesConRentas) { alert('❌ No se puede eliminar: tiene propiedades con rentas activas'); return }
    setSelectedArrendador(a); setModalType('delete'); setShowModal(true)
  }
  const confirmDelete = async () => {
    try { await deleteArrendador(selectedArrendador.idArrendador); setShowModal(false); loadArrendadores() }
    catch (error) { alert(error.response?.data?.error || 'Error al eliminar') }
  }

  // Ancho del modal según tipo
  const modalWidth = (modalType === 'edit' || modalType === 'create') ? '860px' : '480px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarAdmin />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Gestión de Arrendadores</h1>
          <button onClick={() => { setSelectedArrendador(null); setModalType('create'); setShowModal(true) }}>
            + Agregar Arrendador
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input type="text" placeholder="🔍 Buscar por RFC, correo o CURP..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
        </div>

        {loading ? <p>Cargando...</p> : error ? <p style={{ color: 'red' }}>{error}</p> :
          arrendadores.length === 0 ? <p>No hay arrendadores registrados</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre Completo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>RFC</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Correo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>CURP</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {arrendadores.map((a) => (
                  <tr key={a.idArrendador} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{a.idArrendador}</td>
                    <td style={{ padding: '0.75rem' }}>{a.usuario?.usuarioApePat} {a.usuario?.usuarioApeMat || ''} {a.usuario?.usuarioNom}</td>
                    <td style={{ padding: '0.75rem' }}>{a.arrendadorRFC || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.usuario?.usuarioCorreo || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{a.usuario?.usuarioCurp || '-'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button onClick={() => handleView(a)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>👁️ Ver</button>
                      <button onClick={() => handleEdit(a)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(a)} disabled={a.tienePropiedadesConRentas} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>🗑️ Eliminar</button>
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

            {modalType === 'view' && selectedArrendador && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Información del Arrendador</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
                  {[
                    ['ID', selectedArrendador.idArrendador],
                    ['Nombre', `${selectedArrendador.usuario?.usuarioApePat} ${selectedArrendador.usuario?.usuarioApeMat || ''} ${selectedArrendador.usuario?.usuarioNom}`],
                    ['RFC', selectedArrendador.arrendadorRFC],
                    ['Correo', selectedArrendador.usuario?.usuarioCorreo],
                    ['Teléfono', selectedArrendador.usuario?.usuarioTel],
                    ['CURP', selectedArrendador.usuario?.usuarioCurp],
                    ['Fecha Nacimiento', selectedArrendador.usuario?.usuarioFechaNac],
                    ['Domicilio', `${selectedArrendador.direccion?.direccionCalle} ${selectedArrendador.direccion?.direccionNumExt}, ${selectedArrendador.direccion?.cp?.d_asenta}, ${selectedArrendador.direccion?.cp?.D_mnpio}, ${selectedArrendador.direccion?.cp?.d_estado}`],
                  ].map(([k, v]) => (
                    <p key={k} style={{ margin: '0.4rem 0', fontSize: '0.875rem' }}><strong>{k}:</strong> {v || '-'}</p>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: '0.45rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Cerrar</button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedArrendador && (
              <FormArrendador arrendador={selectedArrendador} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); loadArrendadores() }} />
            )}

            {modalType === 'create' && (
              <FormRegistroArrendador onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); loadArrendadores() }} />
            )}

            {modalType === 'delete' && selectedArrendador && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#dc2626' }}>Eliminar Arrendador</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.875rem' }}>¿Eliminar a <strong>{selectedArrendador.usuario?.usuarioNom}</strong>? (RFC: {selectedArrendador.arrendadorRFC})</p>
                  <p style={{ color: '#dc2626', fontSize: '0.8rem' }}>⚠️ Esta acción también eliminará todas sus propiedades.</p>
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

export default AdminArrendadoresPage