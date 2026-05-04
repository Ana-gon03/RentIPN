const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Usuario, Arrendatario, Arrendador, Propiedad, Arrendamiento, Resena, Direccion, CP, Carrera, UnidadAcademica } = require('../models/associations');

// ============ ARRENDATARIOS (ESTUDIANTES) ============

// ID del arrendatario por defecto (usuario del sistema, nunca se muestra ni elimina)
const ARRENDATARIO_DEFAULT_ID = 10;

// Obtener todos los arrendatarios con búsqueda
router.get('/arrendatarios', async (req, res) => {
  try {
    const { search } = req.query;

    // Siempre excluir al arrendatario por defecto del sistema
    let whereCondition = {
      idArrendatario: { [Op.ne]: ARRENDATARIO_DEFAULT_ID }
    };
    
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { arrendatarioBoleta: { [Op.like]: `%${search}%` } },
          { arrendatarioUser: { [Op.like]: `%${search}%` } },
          { '$Usuario.usuarioCorreo$': { [Op.like]: `%${search}%` } },
          { '$Usuario.usuarioCurp$': { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const arrendatarios = await Arrendatario.findAll({
      where: whereCondition,
      include: [
        { 
          model: Usuario, 
          as: 'Usuario',
          attributes: ['idUsuario', 'usuarioNom', 'usuarioApePat', 'usuarioApeMat', 'usuarioCorreo', 'usuarioTel', 'usuarioCurp', 'usuarioFechaNac', 'usuarioFechaRegis']
        },
        {
          model: Carrera,
          as: 'Carrera',
          include: [{ model: UnidadAcademica, as: 'UnidadAcademica' }]
        }
      ],
      order: [['idArrendatario', 'DESC']]
    });
    
    const arrendatariosConRentas = await Promise.all(arrendatarios.map(async (a) => {
      const rentasActivas = await Arrendamiento.count({
        where: {
          arrendatario_idArrendatario: a.idArrendatario,
          arrendamientoValArrendador: 1,
          arrendamientoValEstudiante: 1
        }
      });
      return {
        ...a.toJSON(),
        tieneRentasActivas: rentasActivas > 0
      };
    }));
    
    res.json(arrendatariosConRentas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener un arrendatario por ID
router.get('/arrendatarios/:id', async (req, res) => {
  try {
    const arrendatario = await Arrendatario.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'Usuario' },
        { model: Carrera, as: 'Carrera', include: [{ model: UnidadAcademica, as: 'UnidadAcademica' }] }
      ]
    });
    
    if (!arrendatario) {
      return res.status(404).json({ error: 'Arrendatario no encontrado' });
    }
    
    res.json(arrendatario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar arrendatario
router.put('/arrendatarios/:id', async (req, res) => {
  try {
    const { usuarioData, arrendatarioData } = req.body;
    const arrendatario = await Arrendatario.findByPk(req.params.id);
    
    if (!arrendatario) {
      return res.status(404).json({ error: 'Arrendatario no encontrado' });
    }
    
    // Campos que NUNCA se pueden editar (independiente de verificación)
    delete usuarioData.usuarioCorreo;

    // Campos bloqueados SOLO si está verificado
    if (arrendatario.arrendatarioVerificado === 1) {
      delete usuarioData.usuarioCurp;
      delete arrendatarioData.arrendatarioBoleta;
    }
    
    await Usuario.update(usuarioData, {
      where: { idUsuario: arrendatario.usuario_idUsuario }
    });
    
    await Arrendatario.update(arrendatarioData, {
      where: { idArrendatario: req.params.id }
    });
    
    res.json({ message: 'Arrendatario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar arrendatario
router.delete('/arrendatarios/:id', async (req, res) => {
  try {
    const arrendatario = await Arrendatario.findByPk(req.params.id);
    
    if (!arrendatario) {
      return res.status(404).json({ error: 'Arrendatario no encontrado' });
    }

    // 🔒 Protección: el arrendatario por defecto del sistema nunca puede eliminarse
    if (arrendatario.idArrendatario === ARRENDATARIO_DEFAULT_ID) {
      return res.status(403).json({ error: 'Este usuario del sistema no puede ser eliminado' });
    }
    
    const rentasActivas = await Arrendamiento.count({
      where: {
        arrendatario_idArrendatario: req.params.id,
        arrendamientoValArrendador: 1,
        arrendamientoValEstudiante: 1
      }
    });
    
    if (rentasActivas > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el estudiante porque tiene rentas activas' });
    }
    
    // 1. Redirigir reseñas al usuario por defecto (se conservan para integridad del historial)
    await Resena.update(
      { arrendatario_idArrendatario: ARRENDATARIO_DEFAULT_ID },
      { where: { arrendatario_idArrendatario: req.params.id } }
    );

    // 2. Eliminar arrendamientos no activos del arrendatario
    await Arrendamiento.destroy({
      where: {
        arrendatario_idArrendatario: req.params.id,
        [Op.not]: [{ arrendamientoValArrendador: 1, arrendamientoValEstudiante: 1 }]
      }
    });

    // 3. Guardar el idUsuario antes de destruir el arrendatario
    const idUsuarioArrendatario = arrendatario.usuario_idUsuario;

    // 4. Eliminar arrendatario
    await arrendatario.destroy();

    // 5. Eliminar el usuario asociado (no se puede confiar solo en CASCADE de la FK)
    await Usuario.destroy({ where: { idUsuario: idUsuarioArrendatario } });

    res.json({ message: 'Arrendatario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CREAR ARRENDATARIO (DESDE ADMIN) ============
router.post('/arrendatarios', async (req, res) => {
  const {
    username,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    correo,
    telefono,
    curp,
    fechaNacimiento,
    carreraId,
    boleta,
    password
  } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { usuarioNom: username },
          { usuarioCorreo: correo },
          { usuarioCurp: curp }
        ]
      }
    });

    if (existeUsuario) {
      if (existeUsuario.usuarioNom === username) {
        return res.status(400).json({ error: 'El username ya está registrado' });
      }
      if (existeUsuario.usuarioCorreo === correo) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
      if (existeUsuario.usuarioCurp === curp) {
        return res.status(400).json({ error: 'El CURP ya está registrado' });
      }
    }

    const existeBoleta = await Arrendatario.findOne({
      where: { arrendatarioBoleta: boleta }
    });

    if (existeBoleta) {
      return res.status(400).json({ error: 'La boleta ya está registrada' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      usuarioNom: username,
      usuarioApePat: apellidoPaterno,
      usuarioApeMat: apellidoMaterno || null,
      usuarioCorreo: correo,
      usuarioTel: telefono,
      usuarioCurp: curp,
      usuarioContra: hashedPassword,
      usuarioFechaNac: fechaNacimiento,
      usuarioFechaRegis: new Date(),
      usuarioFechaUIS: new Date(),
      usuarioCodigo: Math.floor(10000000 + Math.random() * 90000000).toString(),
      usuarioCorreoVerificado: 1,
      usuarioCodigoFecha: new Date(),
    });

    const nuevoArrendatario = await Arrendatario.create({
      arrendatarioBoleta: boleta,
      arrendatarioVerificado: 0,
      arrendatarioFechaVerificación: null,
      arrendatarioUser: username,
      usuario_idUsuario: nuevoUsuario.idUsuario,
      carrera_idCarrera: carreraId,
    });

    res.status(201).json({
      message: 'Estudiante creado exitosamente',
      arrendatario: nuevoArrendatario
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ARRENDADORES ============

// Obtener todos los arrendadores
router.get('/arrendadores', async (req, res) => {
  try {
    const { search } = req.query;
    let whereCondition = {};
    
    if (search) {
      whereCondition = {
        [Op.or]: [
          { arrendadorRFC: { [Op.like]: `%${search}%` } },
          { '$Usuario.usuarioCorreo$': { [Op.like]: `%${search}%` } },
          { '$Usuario.usuarioCurp$': { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const arrendadores = await Arrendador.findAll({
      where: whereCondition,
      include: [
        { 
          model: Usuario, 
          as: 'Usuario',
          attributes: ['idUsuario', 'usuarioNom', 'usuarioApePat', 'usuarioApeMat', 'usuarioCorreo', 'usuarioTel', 'usuarioCurp', 'usuarioFechaNac', 'usuarioFechaRegis']
        },
        {
          model: Direccion,
          as: 'Direccion',
          include: [{ model: CP, as: 'CP' }]
        }
      ],
      order: [['idArrendador', 'DESC']]
    });
    
    const arrendadoresConInfo = await Promise.all(arrendadores.map(async (a) => {
      const propiedades = await Propiedad.findAll({
        where: { arrendador_idArrendador: a.idArrendador },
        include: [{
          model: Arrendamiento,
          as: 'Arrendamientos',
          where: { arrendamientoValArrendador: 1, arrendamientoValEstudiante: 1 },
          required: false
        }]
      });
      
      const tienePropiedadesConRentas = propiedades.some(p => p.Arrendamientos && p.Arrendamientos.length > 0);
      
      return {
        ...a.toJSON(),
        tienePropiedadesConRentas
      };
    }));
    
    res.json(arrendadoresConInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener un arrendador por ID
router.get('/arrendadores/:id', async (req, res) => {
  try {
    const arrendador = await Arrendador.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'Usuario' },
        { model: Direccion, as: 'Direccion', include: [{ model: CP, as: 'CP' }] }
      ]
    });
    
    if (!arrendador) {
      return res.status(404).json({ error: 'Arrendador no encontrado' });
    }
    
    res.json(arrendador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar arrendador
router.put('/arrendadores/:id', async (req, res) => {
  try {
    const { usuarioData, arrendadorData, direccionData } = req.body;
    const arrendador = await Arrendador.findByPk(req.params.id);
    
    if (!arrendador) {
      return res.status(404).json({ error: 'Arrendador no encontrado' });
    }
    
    const isVerified = arrendador.arrendadorFechaVerificacion !== null;
    
    if (isVerified) {
      delete usuarioData.usuarioCurp;
      delete usuarioData.usuarioCorreo;
      delete arrendadorData.arrendadorRFC;
    } else {
      delete usuarioData.usuarioCorreo;
    }
    
    await Usuario.update(usuarioData, {
      where: { idUsuario: arrendador.usuario_idUsuario }
    });
    
    await Arrendador.update(arrendadorData, {
      where: { idArrendador: req.params.id }
    });
    
    if (direccionData) {
      let cpRecord = await CP.findOne({ where: { d_codigo: direccionData.cp } });
      if (!cpRecord) {
        cpRecord = await CP.create({
          d_codigo: direccionData.cp,
          d_asenta: direccionData.colonia,
          D_mnpio: direccionData.municipio,
          d_estado: direccionData.estado,
          cpAceptadoSistema: 1
        });
      }
      
      await Direccion.update({
        direccionCalle: direccionData.calle,
        direccionNumExt: direccionData.numExt,
        direccionNumInt: direccionData.numInt || null,
        CP_idCP: cpRecord.idCP
      }, {
        where: { idDireccion: arrendador.direccion_idDireccion }
      });
    }
    
    res.json({ message: 'Arrendador actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar arrendador
router.delete('/arrendadores/:id', async (req, res) => {
  try {
    const arrendador = await Arrendador.findByPk(req.params.id);
    
    if (!arrendador) {
      return res.status(404).json({ error: 'Arrendador no encontrado' });
    }
    
    const propiedades = await Propiedad.findAll({
      where: { arrendador_idArrendador: req.params.id },
      include: [{
        model: Arrendamiento,
        as: 'Arrendamientos',
        where: { arrendamientoValArrendador: 1, arrendamientoValEstudiante: 1 },
        required: false
      }]
    });
    
    const tieneRentasActivas = propiedades.some(p => p.Arrendamientos && p.Arrendamientos.length > 0);
    
    if (tieneRentasActivas) {
      return res.status(400).json({ error: 'No se puede eliminar el arrendador porque tiene propiedades con rentas activas' });
    }
    
    const propiedadesIds = propiedades.map(p => p.idPropiedad);

    if (propiedadesIds.length > 0) {
      // 1. Eliminar reseñas de las propiedades
      await Resena.destroy({ where: { propiedad_idPropiedad: propiedadesIds } });

      // 2. Eliminar arrendamientos no activos de las propiedades
      await Arrendamiento.destroy({
        where: {
          propiedad_idPropiedad: propiedadesIds,
          [Op.not]: [{ arrendamientoValArrendador: 1, arrendamientoValEstudiante: 1 }]
        }
      });

      // 3. servicio_has_propiedad y fotos tienen ON DELETE CASCADE en el schema,
      //    se eliminan automáticamente al destruir la propiedad.
      // 4. Eliminar propiedades
      await Propiedad.destroy({ where: { arrendador_idArrendador: req.params.id } });
    }

    // 5. Guardar ids antes de destruir
    const idUsuarioArrendador = arrendador.usuario_idUsuario;
    const idDireccionArrendador = arrendador.direccion_idDireccion;

    // 6. Eliminar arrendador
    await arrendador.destroy();

    // 7. Eliminar el usuario asociado (no se puede confiar solo en CASCADE de la FK)
    await Usuario.destroy({ where: { idUsuario: idUsuarioArrendador } });

    // 8. Eliminar dirección
    if (idDireccionArrendador) {
      await Direccion.destroy({ where: { idDireccion: idDireccionArrendador } });
    }

    res.json({ message: 'Arrendador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CREAR ARRENDADOR (DESDE ADMIN) ============
router.post('/arrendadores', async (req, res) => {
  const {
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    correo,
    telefono,
    curp,
    fechaNacimiento,
    rfc,
    calle,
    numExt,
    numInt,
    cp,
    colonia,
    municipio,
    estado,
    password
  } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { usuarioCorreo: correo },
          { usuarioCurp: curp }
        ]
      }
    });

    if (existeUsuario) {
      if (existeUsuario.usuarioCorreo === correo) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
      if (existeUsuario.usuarioCurp === curp) {
        return res.status(400).json({ error: 'El CURP ya está registrado' });
      }
    }

    const existeRfc = await Arrendador.findOne({
      where: { arrendadorRFC: rfc }
    });

    if (existeRfc) {
      return res.status(400).json({ error: 'El RFC ya está registrado' });
    }

    let cpRecord = await CP.findOne({ where: { d_codigo: cp } });
    if (!cpRecord) {
      cpRecord = await CP.create({
        d_codigo: cp,
        d_asenta: colonia,
        D_mnpio: municipio,
        d_estado: estado,
        cpAceptadoSistema: 1
      });
    }

    const nuevaDireccion = await Direccion.create({
      direccionCalle: calle,
      direccionNumExt: numExt,
      direccionNumInt: numInt || null,
      CP_idCP: cpRecord.idCP
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usernameAuto = correo.split('@')[0] + Math.floor(Math.random() * 1000);

    const nuevoUsuario = await Usuario.create({
      usuarioNom: usernameAuto,
      usuarioApePat: apellidoPaterno,
      usuarioApeMat: apellidoMaterno || null,
      usuarioCorreo: correo,
      usuarioTel: telefono,
      usuarioCurp: curp,
      usuarioContra: hashedPassword,
      usuarioFechaNac: fechaNacimiento,
      usuarioFechaRegis: new Date(),
      usuarioFechaUIS: new Date(),
      usuarioCodigo: Math.floor(10000000 + Math.random() * 90000000).toString(),
      usuarioCorreoVerificado: 1,
      usuarioCodigoFecha: new Date(),
    });

    const nuevoArrendador = await Arrendador.create({
      arrendadorRFC: rfc,
      usuario_idUsuario: nuevoUsuario.idUsuario,
      direccion_idDireccion: nuevaDireccion.idDireccion
    });

    res.status(201).json({
      message: 'Arrendador creado exitosamente',
      arrendador: nuevoArrendador
    });

  } catch (error) {
    console.error('Error en creación de arrendador:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ PROPIEDADES ============

// Obtener todas las propiedades
router.get('/propiedades', async (req, res) => {
  try {
    const { search } = req.query;
    let whereCondition = {};
    
    if (search) {
      whereCondition = {
        [Op.or]: [
          { propiedadTitulo: { [Op.like]: `%${search}%` } },
          { propiedadDescripcion: { [Op.like]: `%${search}%` } },
          { '$Direccion.direccionCalle$': { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const propiedades = await Propiedad.findAll({
      where: whereCondition,
      include: [
        { model: Direccion, as: 'Direccion', include: [{ model: CP, as: 'CP' }] },
        { model: Arrendador, as: 'Arrendador', include: [{ model: Usuario, as: 'Usuario' }] }
      ],
      order: [['idPropiedad', 'DESC']]
    });
    
    const propiedadesConInfo = await Promise.all(propiedades.map(async (p) => {
      const rentasActivas = await Arrendamiento.count({
        where: {
          propiedad_idPropiedad: p.idPropiedad,
          arrendamientoValArrendador: 1,
          arrendamientoValEstudiante: 1
        }
      });
      
      const reseñas = await Resena.count({
        where: { propiedad_idPropiedad: p.idPropiedad }
      });
      
      return {
        ...p.toJSON(),
        rentasActivas,
        reseñas
      };
    }));
    
    res.json(propiedadesConInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener una propiedad por ID
router.get('/propiedades/:id', async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id, {
      include: [
        { model: Direccion, as: 'Direccion', include: [{ model: CP, as: 'CP' }] },
        { model: Arrendador, as: 'Arrendador', include: [{ model: Usuario, as: 'Usuario' }] }
      ]
    });
    
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    res.json(propiedad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar propiedad
router.put('/propiedades/:id', async (req, res) => {
  try {
    const propiedadData = req.body;
    const propiedad = await Propiedad.findByPk(req.params.id);
    
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    await Propiedad.update(propiedadData, {
      where: { idPropiedad: req.params.id }
    });
    
    res.json({ message: 'Propiedad actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar propiedad
router.delete('/propiedades/:id', async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id);
    
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    const rentasActivas = await Arrendamiento.count({
      where: {
        propiedad_idPropiedad: req.params.id,
        arrendamientoValArrendador: 1,
        arrendamientoValEstudiante: 1
      }
    });
    
    if (rentasActivas > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la propiedad porque tiene rentas activas' });
    }
    
    // 1. Eliminar reseñas de la propiedad
    await Resena.destroy({ where: { propiedad_idPropiedad: req.params.id } });

    // 2. Eliminar arrendamientos no activos
    await Arrendamiento.destroy({
      where: {
        propiedad_idPropiedad: req.params.id,
        [Op.not]: [{ arrendamientoValArrendador: 1, arrendamientoValEstudiante: 1 }]
      }
    });

    // 3. Eliminar propiedad (fotos y servicio_has_propiedad tienen CASCADE)
    await Propiedad.destroy({ where: { idPropiedad: req.params.id } });

    res.json({ message: 'Propiedad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;