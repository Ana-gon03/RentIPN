import api from './api';

// Obtener arrendamientos del arrendador
export const getArrendamientosArrendador = async (idArrendador) => {
  const response = await api.get(`/arrendamientos/arrendador/${idArrendador}`);
  return response.data;
};

// Obtener un arrendamiento por ID
export const getArrendamiento = async (id) => {
  const response = await api.get(`/arrendamientos/${id}`);
  return response.data;
};

// Crear arrendamiento
export const crearArrendamiento = async (datos) => {
  const response = await api.post('/arrendamientos', datos);
  return response.data;
};

// Actualizar arrendamiento
export const actualizarArrendamiento = async (id, datos) => {
  const response = await api.put(`/arrendamientos/${id}`, datos);
  return response.data;
};

// Finalizar arrendamiento
export const finalizarArrendamiento = async (id) => {
  const response = await api.put(`/arrendamientos/${id}/finalizar`);
  return response.data;
};

// Buscar arrendatario
export const buscarArrendatario = async (termino) => {
  const response = await api.get(`/usuarios/buscar-arrendatario?q=${termino}`);
  return response.data;
};

// Ver/descargar PDF del contrato
export const descargarContratoPDF = async (id) => {
  // Abrir ventana ANTES del await: iOS Safari solo permite window.open() en gesto de usuario directo
  const ventana = window.open('', '_blank');

  try {
    const response = await api.get(`/arrendamientos/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

    if (ventana && !ventana.closed) {
      ventana.location.replace(url);
    } else {
      // Fallback si el popup fue bloqueado (escritorio con bloqueador)
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contrato.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch (err) {
    if (ventana && !ventana.closed) ventana.close();
    throw err;
  }
};