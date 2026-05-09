import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../components/common/NavbarAdmin'
import FooterAdmin from '../../components/common/FooterAdmin'
import { getPropiedades, deletePropiedad } from '../../services/adminService'
import FormPropiedad from '../../components/admin/FormPropiedad'

const AdminPropiedadesPage = () => {
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPropiedad, setSelectedPropiedad] = useState(null)
  const [modalType, setModalType] = useState('')
  const [error, setError] = useState('')

  const loadPropiedades = async () => {
    setLoading(true)
    try {
      const data = await getPropiedades(search)
      setPropiedades(data)
    } catch (error) {
      console.error('Error cargando propiedades:', error)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPropiedades() }, [search])

  const handleView = (p) => { setSelectedPropiedad(p); setModalType('view'); setShowModal(true) }
  const handleEdit = (p) => { setSelectedPropiedad(p); setModalType('edit'); setShowModal(true) }
  const handleDelete = (p) => {
    if (p.rentasActivas > 0) { alert(`❌ No se puede eliminar: tiene ${p.rentasActivas} renta(s) activa(s)`); return }
    setSelectedPropiedad(p); setModalType('delete'); setShowModal(true)
  }
  const confirmDelete = async () => {
    try { await deletePropiedad(selectedPropiedad.idPropiedad); setShowModal(false); loadPropiedades() }
    catch (error) { alert(error.response?.data?.error || 'Error al eliminar') }
  }

  const modalWidth = modalType === 'edit' ? '600px' : '480px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarAdmin />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Gestión de Propiedades</h1>
          <small style={{ color: '#666' }}>No se pueden agregar propiedades desde aquí</small>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input type="text" placeholder="🔍 Buscar por título, descripción o calle..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
        </div>

        {loading ? <p>Cargando...</p> : error ? <p style={{ color: 'red' }}>{error}</p> :
          propiedades.length === 0 ? <p>No hay propiedades registradas</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Título</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>arrendador</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Precio</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tipo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Rentas Activas</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Reseñas</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map((p) => (
                  <tr key={p.idPropiedad} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{p.idPropiedad}</td>
                    <td style={{ padding: '0.75rem' }}>{p.propiedadTitulo}</td>
                    <td style={{ padding: '0.75rem' }}>{p.arrendador?.usuario?.usuarioApePat} {p.arrendador?.usuario?.usuarioNom}</td>
                    <td style={{ padding: '0.75rem' }}>${p.propiedadPrecio}</td>
                    <td style={{ padding: '0.75rem' }}>{p.propiedadTipo}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span style={{ backgroundColor: p.rentasActivas > 0 ? '#dc3545' : '#28a745', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.8rem' }}>{p.rentasActivas}</span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.reseñas}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button onClick={() => handleView(p)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>👁️ Ver</button>
                      <button onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>✏️ Editar</button>
                      <button onClick={() => handleDelete(p)} disabled={p.rentasActivas > 0} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>🗑️ Eliminar</button>
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

            {modalType === 'view' && selectedPropiedad && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Información de la Propiedad</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
                  {[
                    ['ID', selectedPropiedad.idPropiedad],
                    ['Título', selectedPropiedad.propiedadTitulo],
                    ['Descripción', selectedPropiedad.propiedadDescripcion],
                    ['Tipo', selectedPropiedad.propiedadTipo],
                    ['Lugares', selectedPropiedad.propiedadLugares],
                    ['Precio', `$${selectedPropiedad.propiedadPrecio}`],
                    ['Estatus', selectedPropiedad.propiedadEstatus],
                    ['Dirección', `${selectedPropiedad.direccion?.direccionCalle} ${selectedPropiedad.direccion?.direccionNumExt}, ${selectedPropiedad.direccion?.cp?.d_asenta}, ${selectedPropiedad.direccion?.cp?.D_mnpio}, ${selectedPropiedad.direccion?.cp?.d_estado}`],
                    ['arrendador', `${selectedPropiedad.arrendador?.usuario?.usuarioApePat} ${selectedPropiedad.arrendador?.usuario?.usuarioNom}`],
                    ['Rentas activas', selectedPropiedad.rentasActivas],
                    ['Reseñas', selectedPropiedad.reseñas],
                  ].map(([k, v]) => (
                    <p key={k} style={{ margin: '0.4rem 0', fontSize: '0.875rem' }}><strong>{k}:</strong> {v ?? '-'}</p>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: '0.45rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>Cerrar</button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedPropiedad && (
              <FormPropiedad propiedad={selectedPropiedad} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); loadPropiedades() }} />
            )}

            {modalType === 'delete' && selectedPropiedad && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#dc2626' }}>Eliminar Propiedad</h2>
                  <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>×</button>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.875rem' }}>¿Eliminar la propiedad <strong>{selectedPropiedad.propiedadTitulo}</strong>?</p>
                  <p style={{ color: '#dc2626', fontSize: '0.8rem' }}>⚠️ Esta acción no se puede deshacer.</p>
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

export default AdminPropiedadesPage