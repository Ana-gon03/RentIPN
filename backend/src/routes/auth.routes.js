const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Usuario, Arrendatario, Arrendador, Carrera, CP, Direccion, Administrador } = require('../models/associations');
// sequelize se obtiene desde el modelo Usuario para poder usar transacciones
const sequelize = Usuario.sequelize;
const { Op } = require('sequelize');
const { enviarCodigoVerificacion, reenviarCodigoVerificacion } = require('../config/email');
const upload = require('../middlewares/upload');
const { extraerQRDePDF, validarConstancia, validarCURPDocumento } = require('../services/pdfco.service');

// Validar si ya existe un campo (username, correo, curp, boleta)
router.post('/validar-campo', async (req, res) => {
  const { campo, valor } = req.body;
  
  try {
    let existe = false;
    
    if (campo === 'username') {
      const usuario = await Usuario.findOne({ where: { usuarioNom: valor } });
      existe = !!usuario;
    } else if (campo === 'correo') {
      const usuario = await Usuario.findOne({ where: { usuarioCorreo: valor } });
      existe = !!usuario;
    } else if (campo === 'curp') {
      const usuario = await Usuario.findOne({ where: { usuarioCurp: valor } });
      existe = !!usuario;
    } else if (campo === 'boleta') {
      const arrendatario = await Arrendatario.findOne({ where: { arrendatarioBoleta: valor } });
      existe = !!arrendatario;
    } else if (campo === 'rfc') {
      const arrendador = await Arrendador.findOne({ where: { arrendadorRFC: valor } });
      existe = !!arrendador;
    }
    
    res.json({ existe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar estudiante CON o SIN constancia
router.post('/registro-estudiante', upload.single('constancia'), async (req, res) => {
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
    password,
    postergarVerificacion
  } = req.body;
  
  const constanciaFile = req.file;
  const postergar = postergarVerificacion === 'true';
  
  try {
    // Verificar si ya existe username, correo o curp
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [
          { usuarioNom: username },
          { usuarioCorreo: correo },
          { usuarioCurp: curp }
        ]
      }
    });
    
    if (usuarioExistente) {
      if (usuarioExistente.usuarioNom === username) {
        return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
      }
      if (usuarioExistente.usuarioCorreo === correo) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
      if (usuarioExistente.usuarioCurp === curp) {
        return res.status(400).json({ error: 'El CURP ya está registrado' });
      }
    }
    
    // Verificar si la boleta ya existe
    const boletaExistente = await Arrendatario.findOne({
      where: { arrendatarioBoleta: boleta }
    });
    
    if (boletaExistente) {
      return res.status(400).json({ error: 'La boleta ya está registrada' });
    }
    
    let verificado = false;
    let fechaVerificacion = null;
    let erroresValidacion = [];
    
    // Si subió constancia y no postergó, validar
    if (constanciaFile && !postergar) {
      const qrData = await extraerQRDePDF(constanciaFile.buffer, 'constancia');
      
      if (!qrData) {
        return res.status(400).json({ error: 'No se pudo leer el QR de la constancia. Intenta con otro archivo.' });
      }
      
      erroresValidacion = validarConstancia({
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        curp,
        boleta
      }, qrData);
      
      if (erroresValidacion.length > 0) {
        return res.status(400).json({ 
          error: 'Los datos del documento no coinciden con el formulario',
          detalles: erroresValidacion 
        });
      }
      
      verificado = true;
      fechaVerificacion = new Date();
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear usuario
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
      usuarioCorreoVerificado: 0,
      usuarioCodigoFecha: new Date(),
    });
    
    // Crear arrendatario
    const nuevoArrendatario = await Arrendatario.create({
      arrendatarioBoleta: boleta,
      arrendatarioVerificado: verificado ? 1 : 0,
      arrendatarioFechaVerificación: fechaVerificacion,
      arrendatarioUser: username,
      usuario_idUsuario: nuevoUsuario.idUsuario,
      carrera_idCarrera: carreraId,
    });
    
    // Enviar correo de verificación
    await enviarCodigoVerificacion(correo, nuevoUsuario.usuarioCodigo, nombres);
    
    // Calcular fecha de expiración (2 meses después del registro)
    const fechaExpiracion = new Date();
    fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 2);
    
    res.status(201).json({
      message: verificado 
        ? 'Estudiante registrado y verificado exitosamente' 
        : 'Estudiante registrado. Debes verificar tu identidad en los próximos 2 meses',
      usuarioId: nuevoUsuario.idUsuario,
      arrendatarioId: nuevoArrendatario.idArrendatario,
      requiereVerificacion: !verificado,
      fechaExpiracion: fechaExpiracion
    });
    
  } catch (error) {
    console.error('Error en registro estudiante:', error);
    res.status(500).json({ error: 'Error al registrar el estudiante' });
  }
});

// Registrar arrendador (OBLIGATORIO subir CURP)
router.post('/registro-arrendador', upload.single('documentoCURP'), async (req, res) => {
  const {
    nombres, apellidoPaterno, apellidoMaterno, correo, telefono, curp,
    fechaNacimiento, rfc, calle, numExt, numInt, cp, colonia, municipio, estado, password,
  } = req.body;

  const curpFile = req.file;

  // ── Paso 1: validaciones previas SIN tocar la BD ─────────────────────────
  if (!curpFile) {
    return res.status(400).json({ error: 'Es obligatorio subir el documento CURP (PDF)' });
  }

  try {
    const usuarioExistente = await Usuario.findOne({
      where: { [Op.or]: [{ usuarioCorreo: correo }, { usuarioCurp: curp }] }
    });
    if (usuarioExistente) {
      if (usuarioExistente.usuarioCorreo === correo)
        return res.status(400).json({ error: 'El correo ya está registrado' });
      if (usuarioExistente.usuarioCurp === curp)
        return res.status(400).json({ error: 'El CURP ya está registrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al verificar los datos' });
  }

  // Validar CURP con PDF.co ANTES de crear nada en la BD
  try {
    const qrData = await extraerQRDePDF(curpFile.buffer, 'curp');
    console.log('📄 Datos extraídos del QR:', qrData);
    console.log('📋 Datos del formulario:', { curp, fechaNacimiento });

    const erroresValidacion = validarCURPDocumento({ curp, fechaNacimiento }, qrData);
    console.log('❌ Errores de validación:', erroresValidacion);

    if (erroresValidacion.length > 0) {
      return res.status(400).json({
        error: 'El documento CURP no coincide con los datos ingresados',
        detalles: erroresValidacion
      });
    }
  } catch (error) {
    console.error('Error al validar documento CURP:', error);
    return res.status(400).json({ error: 'No se pudo procesar el documento CURP. Verifica que sea un PDF válido.' });
  }

  // ── Paso 2: todo válido — escribir en la BD con transacción ──────────────
  // Si cualquier INSERT falla, el rollback deshace todo y no quedan registros huérfanos
  const t = await sequelize.transaction();

  try {
    let cpRecord = await CP.findOne({ where: { d_codigo: cp }, transaction: t });
    if (!cpRecord) {
      cpRecord = await CP.create({
        d_codigo: cp, d_asenta: colonia, D_mnpio: municipio,
        d_estado: estado, cpAceptadoSistema: 1
      }, { transaction: t });
    }

    const nuevaDireccion = await Direccion.create({
      direccionCalle: calle, direccionNumExt: numExt,
      direccionNumInt: numInt || null, CP_idCP: cpRecord.idCP
    }, { transaction: t });

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
      usuarioFechaUIS: null,
      usuarioCodigo: Math.floor(10000000 + Math.random() * 90000000).toString(),
      usuarioCorreoVerificado: 0,
      usuarioCodigoFecha: new Date(),
    }, { transaction: t });

    const nuevoArrendador = await Arrendador.create({
      arrendadorRFC: rfc,
      usuario_idUsuario: nuevoUsuario.idUsuario,
      direccion_idDireccion: nuevaDireccion.idDireccion
    }, { transaction: t });

    // Commit antes de enviar el correo para no bloquear la transacción
    await t.commit();
    await enviarCodigoVerificacion(correo, nuevoUsuario.usuarioCodigo, nombres);

    res.status(201).json({
      message: 'Arrendador registrado exitosamente',
      usuarioId: nuevoUsuario.idUsuario,
      arrendadorId: nuevoArrendador.idArrendador,
      rol: 'arrendador'
    });

  } catch (error) {
    await t.rollback();
    console.error('Error en registro arrendador:', error);
    res.status(500).json({ error: 'Error al registrar el arrendador. Intenta de nuevo.' });
  }
});

// Reenviar código de verificación
router.post('/reenviar-codigo', async (req, res) => {
  const { correo } = req.body;
  
  try {
    const usuario = await Usuario.findOne({ where: { usuarioCorreo: correo } });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (usuario.usuarioCorreoVerificado === 1) {
      return res.status(400).json({ error: 'El correo ya está verificado' });
    }
    
    // Generar nuevo código
    const nuevoCodigo = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    await usuario.update({
      usuarioCodigo: nuevoCodigo,
      usuarioCodigoFecha: new Date()
    });
    
    await reenviarCodigoVerificacion(correo, nuevoCodigo, usuario.usuarioNom);
    
    res.json({ message: 'Código reenviado exitosamente' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reenviar el código' });
  }
});

// Verificar código
router.post('/verificar-codigo', async (req, res) => {
  const { correo, codigo } = req.body;
  
  try {
    const usuario = await Usuario.findOne({ where: { usuarioCorreo: correo } });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (usuario.usuarioCorreoVerificado === 1) {
      return res.status(400).json({ error: 'El correo ya está verificado' });
    }
    
    const fechaCodigo = new Date(usuario.usuarioCodigoFecha);
    const ahora = new Date();
    const horasTranscurridas = (ahora - fechaCodigo) / (1000 * 60 * 60);
    
    if (usuario.usuarioCodigo !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }
    
    if (horasTranscurridas > 24) {
      return res.status(400).json({ error: 'El código ha expirado' });
    }
    
    await usuario.update({
      usuarioCorreoVerificado: 1,
      usuarioCodigo: null,
      usuarioCodigoFecha: null
    });
    
    res.json({ message: 'Correo verificado exitosamente' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar el código' });
  }
});

// Actualizar correo
router.post('/actualizar-correo', async (req, res) => {
  const { correoAnterior, nuevoCorreo } = req.body;
  
  try {
    const existeCorreo = await Usuario.findOne({ where: { usuarioCorreo: nuevoCorreo } });
    
    if (existeCorreo) {
      return res.status(400).json({ error: 'El nuevo correo ya está registrado' });
    }
    
    const usuario = await Usuario.findOne({ where: { usuarioCorreo: correoAnterior } });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const nuevoCodigo = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    await usuario.update({
      usuarioCorreo: nuevoCorreo,
      usuarioCodigo: nuevoCodigo,
      usuarioCodigoFecha: new Date(),
      usuarioCorreoVerificado: 0
    });
    
    res.json({ message: 'Correo actualizado. Se ha enviado un nuevo código' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el correo' });
  }
});

// ============ LOGIN ADMINISTRADOR ============
router.post('/login-admin', async (req, res) => {
  const { adminUser, adminContra } = req.body;
  
  console.log('📥 Intento de login admin:', { adminUser });
  
  try {
    // Importar modelo Administrador (asegúrate de que esté importado al inicio)
    const { Administrador } = require('../models/associations');
    
    const admin = await Administrador.findOne({
      where: { adminUser: adminUser }
    });
    
    console.log('🔍 Administrador encontrado:', admin ? 'Sí' : 'No');
    
    if (!admin) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    // Comparar contraseña (sin encriptar por ahora)
    if (admin.adminContra !== adminContra) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    // Actualizar fecha de último inicio de sesión
    await admin.update({
      adminFechaInicioSesion: new Date()
    });
    
    console.log('✅ Login exitoso para:', adminUser);
    
    res.json({
      message: 'Login exitoso',
      adminId: admin.idAdmin,
      adminUser: admin.adminUser
    });
    
  } catch (error) {
    console.error('❌ Error en login admin:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
});

module.exports = router;