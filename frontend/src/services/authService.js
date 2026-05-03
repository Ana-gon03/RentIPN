import api from './api';

// Validar campo (correo, teléfono, CURP, RFC)
export const validarCampo = async (campo, valor) => {
  const response = await api.post('/auth/validar-campo', { campo, valor });
  return response.data;
};

// Registro de estudiante
export const registrarEstudiante = async (datos) => {
  const response = await api.post('/auth/registro-estudiante', datos);
  return response.data;
};

// Registro de arrendador
export const registrarArrendador = async (datos) => {
  const response = await api.post('/auth/registro-arrendador', datos);
  return response.data;
};

// Reenviar código de verificación
export const reenviarCodigo = async (correo) => {
  const response = await api.post('/auth/reenviar-codigo', { correo });
  return response.data;
};

// Verificar código
export const verificarCodigo = async (correo, codigo) => {
  const response = await api.post('/auth/verificar-codigo', { correo, codigo });
  return response.data;
};

// Actualizar correo (si se equivocó)
export const actualizarCorreo = async (correoAnterior, nuevoCorreo) => {
  const response = await api.post('/auth/actualizar-correo', { correoAnterior, nuevoCorreo });
  return response.data;
};

// Login de administrador
export const loginAdmin = async (adminUser, adminContra) => {
  const response = await api.post('/auth/login-admin', { adminUser, adminContra });
  return response.data;
};