const CP = require('./cp.model');
const Direccion = require('./direccion.model');
const Usuario = require('./usuario.model');
const UnidadAcademica = require('./unidadAcademica.model');
const Carrera = require('./carrera.model');
const Arrendatario = require('./arrendatario.model');
const Arrendador = require('./arrendador.model');
const Propiedad = require('./propiedad.model');
const Fotos = require('./fotos.model');
const Arrendamiento = require('./arrendamiento.model');
const Resena = require('./resena.model');
const Servicio = require('./servicio.model');
const ServicioHasPropiedad = require('./servicioHasPropiedad.model');
const Administrador = require('./administrador.model');

// Relaciones de Direccion
Direccion.belongsTo(CP, { foreignKey: 'CP_idCP' });
CP.hasMany(Direccion, { foreignKey: 'CP_idCP' });

// Relaciones de Carrera
Carrera.belongsTo(UnidadAcademica, { foreignKey: 'idUnidadAcademica' });
UnidadAcademica.hasMany(Carrera, { foreignKey: 'idUnidadAcademica' });

// Relaciones de Arrendatario
Arrendatario.belongsTo(Usuario, { foreignKey: 'usuario_idUsuario' });
Usuario.hasOne(Arrendatario, { foreignKey: 'usuario_idUsuario' });
Arrendatario.belongsTo(Carrera, { foreignKey: 'carrera_idCarrera' });
Carrera.hasMany(Arrendatario, { foreignKey: 'carrera_idCarrera' });

// Relaciones de Arrendador
Arrendador.belongsTo(Usuario, { foreignKey: 'usuario_idUsuario' });
Usuario.hasOne(Arrendador, { foreignKey: 'usuario_idUsuario' });
Arrendador.belongsTo(Direccion, { foreignKey: 'direccion_idDireccion' });
Direccion.hasMany(Arrendador, { foreignKey: 'direccion_idDireccion' });

// Relaciones de Propiedad
Propiedad.belongsTo(Direccion, { foreignKey: 'direccion_idDireccion' });
Direccion.hasMany(Propiedad, { foreignKey: 'direccion_idDireccion' });
Propiedad.belongsTo(Arrendador, { foreignKey: 'arrendador_idArrendador' });
Arrendador.hasMany(Propiedad, { foreignKey: 'arrendador_idArrendador' });

// Relaciones de Fotos
Fotos.belongsTo(Propiedad, { foreignKey: 'propiedad_idPropiedad' });
Propiedad.hasMany(Fotos, { foreignKey: 'propiedad_idPropiedad' });

// Relaciones de Arrendamiento
Arrendamiento.belongsTo(Arrendatario, { foreignKey: 'arrendatario_idArrendatario' });
Arrendatario.hasMany(Arrendamiento, { foreignKey: 'arrendatario_idArrendatario' });
Arrendamiento.belongsTo(Propiedad, { foreignKey: 'propiedad_idPropiedad' });
Propiedad.hasMany(Arrendamiento, { foreignKey: 'propiedad_idPropiedad' });

// Relaciones de Resena
Resena.belongsTo(Propiedad, { foreignKey: 'propiedad_idPropiedad' });
Propiedad.hasMany(Resena, { foreignKey: 'propiedad_idPropiedad' });
Resena.belongsTo(Arrendatario, { foreignKey: 'arrendatario_idArrendatario' });
Arrendatario.hasMany(Resena, { foreignKey: 'arrendatario_idArrendatario' });

// Relaciones de ServicioHasPropiedad (muchos a muchos)
Servicio.belongsToMany(Propiedad, { through: ServicioHasPropiedad, foreignKey: 'servicio_idServicio', otherKey: 'propiedad_idPropiedad' });
Propiedad.belongsToMany(Servicio, { through: ServicioHasPropiedad, foreignKey: 'propiedad_idPropiedad', otherKey: 'servicio_idServicio' });

module.exports = {
  CP,
  Direccion,
  Usuario,
  UnidadAcademica,
  Carrera,
  Arrendatario,
  Arrendador,
  Propiedad,
  Fotos,
  Arrendamiento,
  Resena,
  Servicio,
  ServicioHasPropiedad,
  Administrador,
};