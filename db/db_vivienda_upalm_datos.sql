-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dbBurroomies
-- ------------------------------------------------------
-- Server version	8.0.44

USE dbBurroomies;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- -----------------------------------------------------
-- 1. DATOS DE CATÁLOGOS
-- -----------------------------------------------------

-- Insertar unidades académicas de nivel superior del IPN
INSERT INTO `unidad_academica` (`unidadAcademicaNombre`, `unidadAcademicaClave`) VALUES
('Escuela Superior de Cómputo', 'ESCOM'),
('Escuela Superior de Ingeniería Mecánica y Eléctrica', 'ESIME'),
('Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas', 'UPIICSA'),
('Unidad Profesional Interdisciplinaria de Biotecnología', 'UPIBI'),
('Escuela Superior de Turismo', 'EST'),
('Escuela Superior de Comercio y Administración', 'ESCA'),
('Escuela Superior de Economía', 'ESE'),
('Escuela Superior de Ingeniería Química e Industrias Extractivas', 'ESIQIE'),
('Escuela Superior de Medicina', 'ESM'),
('Escuela Superior de Enfermería y Obstetricia', 'ESEO'),
('Escuela Superior de Física y Matemáticas', 'ESFM');

INSERT INTO `carrera` (`carreraNombre`, `carreraClave`, `idUnidadAcademica`) VALUES
('Ingeniería en Sistemas Computacionales', 'ISC', 1),
('Ingeniería en Inteligencia Artificial', 'IIA', 1),
('Licenciatura en Ciencia de Datos', 'LCD', 1),
('Ingeniería en Comunicaciones y Electrónica', 'ICE', 2),
('Ingeniería en Control y Automatización', 'ICA', 2),
('Ingeniería en Computación', 'ICO', 2),
('Ingeniería Eléctrica', 'IE', 2),
('Ingeniería Mecánica', 'IM', 2),
('Ingeniería Robótica Industrial', 'IRI', 2),
('Ingeniería en Transporte', 'IT', 3),
('Ingeniería en Informática', 'II', 3),
('Ingeniería Industrial', 'IInd', 3),
('Licenciatura en Administración Industrial', 'LAI', 3),
('Licenciatura en Contaduría Pública', 'LCP', 3),
('Ingeniería Biotecnológica', 'IBT', 4),
('Ingeniería en Sistemas Biológicos', 'ISB', 4),
('Ingeniería en Alimentos', 'IA', 4),
('Ingeniería Biomédica', 'IBM', 4),
('Licenciatura en Turismo', 'LT', 5),
('Licenciatura en Administración Turística', 'LAT', 5),
('Licenciatura en Administración', 'LA', 6),
('Licenciatura en Contaduría y Finanzas Públicas', 'LCFP', 6),
('Licenciatura en Negocios Internacionales', 'LNI', 6),
('Licenciatura en Informática Administrativa', 'LIA', 6),
('Licenciatura en Administración y Desarrollo Empresarial', 'LADE', 6),
('Licenciatura en Relaciones Comerciales', 'LRC', 6),
('Licenciatura en Economía', 'LE', 7),
('Ingeniería Química', 'IQ', 8),
('Ingeniería Química Industrial', 'IQI', 8),
('Ingeniería en Metalurgia y Materiales', 'IMM', 8),
('Ingeniería Química Petrolera', 'IQP', 8),
('Médico Cirujano y Partero', 'MCP', 9),
('Licenciatura en Enfermería', 'LEF', 10),
('Licenciatura en Enfermería y Obstetricia', 'LEO', 10),
('Ingeniería en Física Aplicada', 'IFA', 11),
('Ingeniería en Matemáticas Aplicadas', 'IMA', 11),
('Licenciatura en Física y Matemáticas', 'LFM', 11);


-- Insertar servicios disponibles (estilo Airbnb)
INSERT INTO `servicio` (`servicioNombre`, `servicioCategoria`) VALUES
('Agua potable', 'Basico'),
('Electricidad', 'Basico'),
('Gas natural', 'Basico'),
('Wi-Fi', 'Basico'),
('Calefacción', 'Basico'),
('Aire acondicionado', 'Basico'),
('Cocina individual', 'Basico'),
('Cocina compartida', 'Basico'),
('Refrigerador', 'Basico'),
('Microondas', 'Basico'),
('Cafetera', 'Basico'),
('Utensilios de cocina', 'Basico'),
('Vajilla y cubiertos', 'Basico'),
('Televisión', 'Entretenimiento'),
('Televisión por cable', 'Entretenimiento'),
('Servicios de streaming', 'Entretenimiento'),
('Estacionamiento', 'Adicional'),
('Lavadora', 'Adicional'),
('Secadora', 'Adicional'),
('Lavandería en el edificio', 'Adicional'),
('Escritorio o espacio de trabajo', 'Adicional'),
('Balcón', 'Adicional'),
('Patio', 'Adicional'),
('Terraza', 'Adicional'),
('Jardín o áreas verdes', 'Adicional'),
('Gimnasio', 'Adicional'),
('Lavavajillas', 'Adicional'),
('Lavandería cercana', 'Adicional'),
('Se permiten mascotas', 'Adicional'),
('Acceso para silla de ruedas', 'Adicional'),
('Ascensor', 'Adicional'),
('Servicio de limpieza incluido', 'Adicional'),
('Cámaras de seguridad', 'Adicional'),
('Alarma contra incendios', 'Adicional'),
('Alarma anti-robo', 'Adicional'),
('Vigilancia 24/7', 'Adicional'),
('Control de acceso', 'Adicional');

-- -----------------------------------------------------
-- 2. DATOS DE LAS DEMAS TABLAS
-- -----------------------------------------------------

-- =====================================================
-- SCRIPT DE INSERCIÓN DE DATOS CORREGIDO
-- SOLO INSERTs (asumiendo que los catálogos ya existen)
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- 1. TABLA direccion (20 direcciones)
-- -----------------------------------------------------
INSERT INTO `direccion` (`idDireccion`, `direccionCalle`, `direccionNumExt`, `direccionNumInt`, `CP_idCP`) VALUES
(1, 'Av. Instituto Politécnico Nacional', '1234', NULL, 1),
(2, 'Calle de las Ciencias', '45', '101', 2),
(3, 'Av. Ingeniería', '789', 'B', 3),
(4, 'Calle Programadores', '12', NULL, 4),
(5, 'Av. Desarrollo', '56', '2A', 5),
(6, 'Calle Innovación', '90', NULL, 6),
(7, 'Av. Tecnología', '234', '302', 7),
(8, 'Calle Robótica', '67', 'C', 8),
(9, 'Av. Inteligencia Artificial', '891', NULL, 9),
(10, 'Calle Datos', '34', '405', 10),
(11, 'Av. Algoritmos', '678', NULL, 11),
(12, 'Calle Estructuras', '23', '7B', 12),
(13, 'Av. Sistemas', '456', NULL, 13),
(14, 'Calle Redes', '89', '12', 14),
(15, 'Av. Seguridad', '567', NULL, 15),
(16, 'Calle Bases de Datos', '345', '8A', 16),
(17, 'Av. Computación', '901', NULL, 17),
(18, 'Calle Electrónica', '678', '15', 18),
(19, 'Av. Telecomunicaciones', '234', NULL, 19),
(20, 'Calle Software', '789', '3C', 20);

-- -----------------------------------------------------
-- 2. TABLA usuario (40 usuarios: 1-20 arrendatarios, 21-40 arrendadores)
-- CONTRASEÑAS (texto plano para que bcrypt.compare funcione):
-- Arrendatarios 1-20: juan123, maria456, carlos789, ana321, diego654, vale987, santi555, renata777, luis333, camila111, andres222, isabella333, ale444, fer555, ricardo666, dani777, javi888, pau999, oscar000, regina111
-- Arrendadores 21-40: roberto123, laura456, miguel789, patricia321, fernando654, carmen987, jorge555, martha777, alberto333, guadalupe111, antonio222, teresa888, francisco444, sofia666, raul999
-- -----------------------------------------------------
-- -----------------------------------------------------
-- TABLA usuario CORREGIDA (CURP de 18 caracteres)
-- -----------------------------------------------------
INSERT INTO `usuario` (`idUsuario`, `usuarioNom`, `usuarioApePat`, `usuarioApeMat`, `usuarioCorreo`, `usuarioTel`, `usuarioCurp`, `usuarioContra`, `usuarioFechaNac`, `usuarioFechaRegis`, `usuarioFechaUIS`, `usuarioCodigo`, `usuarioCorreoVerificado`, `usuarioCodigoFecha`) VALUES
-- ===== ARRENDATARIOS (idUsuario 1 al 20) =====
(1, 'Juan Carlos', 'Hernández', 'López', 'juan.hernandez@gmail.com', '5512345678', 'HELJ950101HDFRRN01', 'juan123', '1995-01-01', '2024-01-15 10:00:00', '2025-01-15 15:30:00', 'ABC12345', 1, '2024-01-15 10:05:00'),
(2, 'María Fernanda', 'García', 'Martínez', 'maria.garcia@hotmail.com', '5523456789', 'GAMM980222MDFRRN02', 'maria456', '1998-02-22', '2024-02-20 09:15:00', '2025-02-20 11:20:00', 'DEF67890', 1, '2024-02-20 09:20:00'),
(3, 'Carlos Alberto', 'Rodríguez', 'Sánchez', 'carlos.rodriguez@gmail.com', '5534567890', 'ROSC931103HDFRRN03', 'carlos789', '1993-03-11', '2024-03-10 14:30:00', '2025-03-10 16:45:00', 'GHI12345', 1, '2024-03-10 14:35:00'),
(4, 'Ana Sofía', 'López', 'Díaz', 'ana.lopez@outlook.com', '5545678901', 'LODA000404MDFRRN04', 'ana321', '2000-04-04', '2024-04-05 11:00:00', '2025-04-05 13:15:00', 'JKL67890', 1, '2024-04-05 11:05:00'),
(5, 'Diego Alejandro', 'Martínez', 'Ramírez', 'diego.martinez@gmail.com', '5556789012', 'MARD960505HDFRRN05', 'diego654', '1996-05-05', '2024-05-01 16:20:00', '2025-05-01 18:30:00', 'MNO12345', 1, '2024-05-01 16:25:00'),
(6, 'Valentina', 'Sánchez', 'Torres', 'valentina.sanchez@hotmail.com', '5567890123', 'SATV990606MDFRRN06', 'vale987', '1999-06-06', '2024-06-10 12:45:00', '2025-06-10 14:50:00', 'PQR67890', 1, '2024-06-10 12:50:00'),
(7, 'Santiago', 'Pérez', 'Cruz', 'santiago.perez@gmail.com', '5578901234', 'PECS940707HDFRRN07', 'santi555', '1994-07-07', '2024-07-15 09:30:00', '2025-07-15 11:40:00', 'STU12345', 1, '2024-07-15 09:35:00'),
(8, 'Renata', 'Flores', 'Morales', 'renata.flores@outlook.com', '5589012345', 'FOMR970808MDFRRN08', 'renata777', '1997-08-08', '2024-08-20 13:15:00', '2025-08-20 15:25:00', 'VWX67890', 1, '2024-08-20 13:20:00'),
(9, 'Luis Miguel', 'Torres', 'Vega', 'luis.torres@gmail.com', '5590123456', 'TOVL920909HDFRRN09', 'luis333', '1992-09-09', '2024-09-01 10:00:00', '2025-09-01 12:10:00', 'YZA12345', 1, '2024-09-01 10:05:00'),
(10, 'Camila', 'Rojas', 'Mendoza', 'camila.rojas@hotmail.com', '5501234567', 'ROMC011010MDFRRN10', 'camila111', '2001-10-10', '2024-10-10 15:30:00', '2025-10-10 17:40:00', 'BCD67890', 1, '2024-10-10 15:35:00'),
(11, 'Andrés', 'Gómez', 'Silva', 'andres.gomez@gmail.com', '5511111111', 'GOSA971111HDFRRN11', 'andres222', '1997-11-11', '2024-11-11 08:45:00', '2025-11-11 10:55:00', 'EFG12345', 1, '2024-11-11 08:50:00'),
(12, 'Isabella', 'Orozco', 'Pineda', 'isabella.orozco@outlook.com', '5522222222', 'ORPI981212MDFRRN12', 'isabella333', '1998-12-12', '2024-12-12 17:00:00', '2025-12-12 19:10:00', 'HIJ67890', 1, '2024-12-12 17:05:00'),
(13, 'Alejandro', 'Ramírez', 'Díaz', 'alejandro.ramirez@hotmail.com', '5533333333', 'RADA940101HDFRRN13', 'ale444', '1994-01-01', '2025-01-15 11:30:00', '2025-01-15 13:40:00', 'KLM12345', 1, '2025-01-15 11:35:00'),
(14, 'Fernanda', 'Delgado', 'Castro', 'fernanda.delgado@gmail.com', '5544444444', 'DECF960202MDFRRN14', 'fer555', '1996-02-02', '2025-02-20 14:15:00', '2025-02-20 16:25:00', 'NOP67890', 1, '2025-02-20 14:20:00'),
(15, 'Ricardo', 'Mendoza', 'Reyes', 'ricardo.mendoza@outlook.com', '5555555555', 'MERI930303HDFRRN15', 'ricardo666', '1993-03-03', '2025-03-10 09:00:00', '2025-03-10 11:10:00', 'QRS12345', 1, '2025-03-10 09:05:00'),
(16, 'Daniela', 'Cruz', 'Aguilar', 'daniela.cruz@gmail.com', '5566666666', 'CUAD000404MDFRRN16', 'dani777', '2000-04-04', '2025-04-05 12:30:00', '2025-04-05 14:40:00', 'TUV67890', 1, '2025-04-05 12:35:00'),
(17, 'Javier', 'Núñez', 'Soto', 'javier.nunez@hotmail.com', '5577777777', 'NUSJ950505HDFRRN17', 'javi888', '1995-05-05', '2025-05-01 16:45:00', '2025-05-01 18:55:00', 'WXA12345', 1, '2025-05-01 16:50:00'),
(18, 'Paulina', 'Vargas', 'León', 'paulina.vargas@gmail.com', '5588888888', 'VALP980606MDFRRN18', 'pau999', '1998-06-06', '2025-06-10 10:15:00', '2025-06-10 12:25:00', 'BCD12345', 1, '2025-06-10 10:20:00'),
(19, 'Oscar', 'Guerrero', 'Serrano', 'oscar.guerrero@outlook.com', '5599999999', 'GUSO920707HDFRRN19', 'oscar000', '1992-07-07', '2025-07-15 15:00:00', '2025-07-15 17:10:00', 'EFG12345', 1, '2025-07-15 15:05:00'),
(20, 'Regina', 'Molina', 'Ríos', 'regina.molina@gmail.com', '5500000000', 'MORR011010MDFRRN20', 'regina111', '2001-10-10', '2025-10-10 13:30:00', '2025-10-10 15:40:00', 'HIJ12345', 1, '2025-10-10 13:35:00'),

-- ===== ARRENDADORES (idUsuario 21 al 40) con CURP de 18 caracteres =====
(21, 'Roberto', 'Mendoza', 'Flores', 'roberto.mendoza@gmail.com', '5612345678', 'MEFR950101HDFRN21', 'roberto123', '1975-01-15', '2024-01-20 10:00:00', '2024-01-20 10:00:00', 'VER001', 1, '2024-01-20 10:05:00'),
(22, 'Laura', 'Sánchez', 'García', 'laura.sanchez@gmail.com', '5623456789', 'SAGL780202MDFRN22', 'laura456', '1978-02-20', '2024-01-25 11:00:00', '2024-01-25 11:00:00', 'VER002', 1, '2024-01-25 11:05:00'),
(23, 'Miguel Ángel', 'Torres', 'López', 'miguel.torres@hotmail.com', '5634567890', 'TOLM800303HDFRN23', 'miguel789', '1980-03-25', '2024-02-01 09:30:00', '2024-02-01 09:30:00', 'VER003', 1, '2024-02-01 09:35:00'),
(24, 'Patricia', 'Ramírez', 'Martínez', 'patricia.ramirez@outlook.com', '5645678901', 'RAMP750404MDFRN24', 'patricia321', '1975-04-10', '2024-02-10 14:00:00', '2024-02-10 14:00:00', 'VER004', 1, '2024-02-10 14:05:00'),
(25, 'Fernando', 'Díaz', 'Hernández', 'fernando.diaz@gmail.com', '5656789012', 'DIHF820505HDFRN25', 'fernando654', '1982-05-15', '2024-02-20 12:00:00', '2024-02-20 12:00:00', 'VER005', 1, '2024-02-20 12:05:00'),
(26, 'Carmen', 'Cruz', 'Reyes', 'carmen.cruz@hotmail.com', '5667890123', 'CRRC770606MDFRN26', 'carmen987', '1977-06-30', '2024-03-01 10:30:00', '2024-03-01 10:30:00', 'VER006', 1, '2024-03-01 10:35:00'),
(27, 'Jorge', 'Vega', 'Ortiz', 'jorge.vega@gmail.com', '5678901234', 'VEOJ790707HDFRN27', 'jorge555', '1979-07-12', '2024-03-10 15:00:00', '2024-03-10 15:00:00', 'VER007', 1, '2024-03-10 15:05:00'),
(28, 'Martha', 'Ríos', 'Silva', 'martha.rios@outlook.com', '5689012345', 'RISM810808MDFRN28', 'martha777', '1981-08-22', '2024-03-20 09:00:00', '2024-03-20 09:00:00', 'VER008', 1, '2024-03-20 09:05:00'),
(29, 'Alberto', 'Silva', 'Morales', 'alberto.silva@gmail.com', '5690123456', 'SIMA760909HDFRN29', 'alberto333', '1976-09-05', '2024-04-01 13:30:00', '2024-04-01 13:30:00', 'VER009', 1, '2024-04-01 13:35:00'),
(30, 'Guadalupe', 'Rojas', 'Castro', 'guadalupe.rojas@hotmail.com', '5501234568', 'ROCG741010MDFRN30', 'guadalupe111', '1974-10-18', '2024-04-10 11:00:00', '2024-04-10 11:00:00', 'VER010', 1, '2024-04-10 11:05:00'),
(31, 'Antonio', 'Molina', 'Aguilar', 'antonio.molina@gmail.com', '5512345670', 'MOAA771111HDFRN31', 'antonio222', '1977-11-28', '2024-04-20 16:00:00', '2024-04-20 16:00:00', 'VER011', 1, '2024-04-20 16:05:00'),
(32, 'Teresa', 'Ortiz', 'Gómez', 'teresa.ortiz@outlook.com', '5523456781', 'ORGT801212MDFRN32', 'teresa888', '1980-12-15', '2024-05-01 08:30:00', '2024-05-01 08:30:00', 'VER012', 1, '2024-05-01 08:35:00'),
(33, 'Francisco', 'Núñez', 'Díaz', 'francisco.nunez@gmail.com', '5534567892', 'NUDF781101HDFRN33', 'francisco444', '1978-01-20', '2024-05-10 14:30:00', '2024-05-10 14:30:00', 'VER013', 1, '2024-05-10 14:35:00'),
(34, 'Sofía', 'Méndez', 'Romero', 'sofia.mendez@hotmail.com', '5545678903', 'MERS820202MDFRN34', 'sofia666', '1982-02-28', '2024-05-20 10:00:00', '2024-05-20 10:00:00', 'VER014', 1, '2024-05-20 10:05:00'),
(35, 'Raúl', 'Bautista', 'Serrano', 'raul.bautista@gmail.com', '5556789014', 'BASR750303HDFRN35', 'raul999', '1975-03-25', '2024-06-01 12:30:00', '2024-06-01 12:30:00', 'VER015', 1, '2024-06-01 12:35:00'),
(36, 'Elena', 'Fuentes', 'Cárdenas', 'elena.fuentes@gmail.com', '5567890125', 'FUCE780404MDFRN36', 'elena123', '1978-04-04', '2024-06-10 11:00:00', '2024-06-10 11:00:00', 'VER016', 1, '2024-06-10 11:05:00'),
(37, 'Héctor', 'Pineda', 'Salazar', 'hector.pineda@hotmail.com', '5578901236', 'PISH750505HDFRN37', 'hector123', '1975-05-05', '2024-06-20 14:30:00', '2024-06-20 14:30:00', 'VER017', 1, '2024-06-20 14:35:00'),
(38, 'Leticia', 'Navarro', 'Jiménez', 'leticia.navarro@outlook.com', '5589012347', 'NAJL760606MDFRN38', 'leticia123', '1976-06-15', '2024-07-01 09:00:00', '2024-07-01 09:00:00', 'VER018', 1, '2024-07-01 09:05:00'),
(39, 'Salvador', 'Vázquez', 'Mora', 'salvador.vazquez@gmail.com', '5590123458', 'VAMS770707HDFRN39', 'salvador123', '1977-07-20', '2024-07-10 16:00:00', '2024-07-10 16:00:00', 'VER019', 1, '2024-07-10 16:05:00'),
(40, 'Gloria', 'Luna', 'Espinoza', 'gloria.luna@hotmail.com', '5501234569', 'LUEG780808MDFRN40', 'gloria123', '1978-08-08', '2024-07-20 12:30:00', '2024-07-20 12:30:00', 'VER020', 1, '2024-07-20 12:35:00');


-- -----------------------------------------------------
-- 3. TABLA arrendatario (idUsuario 1-20)
-- -----------------------------------------------------
INSERT INTO `arrendatario` (`idArrendatario`, `arrendatarioBoleta`, `arrendatarioVerificado`, `arrendatarioFechaVerificación`, `arrendatarioUser`, `usuario_idUsuario`, `carrera_idCarrera`) VALUES
(1, '2024030001', 1, '2024-08-01 09:00:00', 'juan_hdz', 1, 1),
(2, '2024030002', 1, '2024-08-15 10:30:00', 'maria_garcia', 2, 4),
(3, '2023030003', 1, '2024-07-20 11:15:00', 'carlos_rod', 3, 7),
(4, '2024020004', 1, '2024-09-01 14:45:00', 'ana_lopez', 4, 10),
(5, '2024010005', 0, NULL, 'diego_mtz', 5, 2),
(6, '2024030006', 1, '2024-10-10 09:20:00', 'vale_sanchez', 6, 5),
(7, '2023020007', 0, NULL, 'santi_perez', 7, 8),
(8, '2024040008', 1, '2024-11-05 12:00:00', 'renata_flores', 8, 11),
(9, '2023010009', 0, NULL, 'luis_torres', 9, 3),
(10, '2024030010', 1, '2024-12-10 16:30:00', 'camila_rojas', 10, 6),
(11, '2024020011', 1, '2025-01-15 10:00:00', 'andres_gomez', 11, 1),
(12, '2024010012', 0, NULL, 'isabella_orozco', 12, 4),
(13, '2024030013', 1, '2025-02-20 11:00:00', 'alejandro_ram', 13, 7),
(14, '2024040014', 1, '2025-03-01 09:30:00', 'fer_delgado', 14, 10),
(15, '2023010015', 0, NULL, 'ricardo_mendoza', 15, 2),
(16, '2024030016', 1, '2025-04-10 13:15:00', 'daniela_cruz', 16, 5),
(17, '2024020017', 0, NULL, 'javier_nunez', 17, 8),
(18, '2024010018', 1, '2025-05-05 15:45:00', 'paulina_vargas', 18, 11),
(19, '2024030019', 1, '2025-06-01 08:00:00', 'oscar_guerrero', 19, 3),
(20, '2024040020', 0, NULL, 'regina_molina', 20, 6);

-- -----------------------------------------------------
-- 4. TABLA arrendador (idUsuario 21-40, idArrendador será 1-20)
-- -----------------------------------------------------
INSERT INTO `arrendador` (`idArrendador`, `arrendadorRFC`, `usuario_idUsuario`, `direccion_idDireccion`) VALUES
(1, 'MEFR950101XXX', 21, 1),
(2, 'SAGL780202XXX', 22, 2),
(3, 'TOLM800303XXX', 23, 3),
(4, 'RAMP750404XXX', 24, 4),
(5, 'DIHF820505XXX', 25, 5),
(6, 'CRRC770606XXX', 26, 6),
(7, 'VEOJ790707XXX', 27, 7),
(8, 'RISM810808XXX', 28, 8),
(9, 'SIMA760909XXX', 29, 9),
(10, 'ROCG741010XXX', 30, 10),
(11, 'MOAA771111XXX', 31, 11),
(12, 'ORGT801212XXX', 32, 12),
(13, 'NUDF781101XXX', 33, 13),
(14, 'MERS820202XXX', 34, 14),
(15, 'BASR750303XXX', 35, 15),
(16, 'FUCE780404XXX', 36, 16),
(17, 'PISH750505XXX', 37, 17),
(18, 'NAJL760606XXX', 38, 18),
(19, 'VAMS770707XXX', 39, 19),
(20, 'LUEG780808XXX', 40, 20);

-- -----------------------------------------------------
-- 5. TABLA propiedad (20 propiedades, arrendador_idArrendador = 1-20)
-- -----------------------------------------------------
INSERT INTO `propiedad` (`idPropiedad`, `propiedadTitulo`, `propiedadDescripcion`, `propiedadTipo`, `propiedadLugares`, `propiedadPrecio`, `propiedadEstatus`, `propiedadFechaRegis`, `direccion_idDireccion`, `arrendador_idArrendador`) VALUES
(1, 'Loft cerca de ESCOM', 'Loft moderno a 5 min de ESCOM', 'Loft', 2, 8500.00, 'Disponible', '2024-12-01 10:00:00', 1, 1),
(2, 'Departamento Lindavista', 'Departamento en zona residencial', 'Departamento', 3, 12000.00, 'Disponible', '2024-12-15 11:30:00', 2, 2),
(3, 'Habitación Polanco', 'Habitación lujosa cerca de oficinas', 'Habitación', 1, 6500.00, 'Sin Disponibilidad', '2024-11-01 09:00:00', 3, 3),
(4, 'Casa Condesa', 'Casa completa con terraza', 'Casa', 4, 22000.00, 'Disponible', '2024-10-10 14:00:00', 4, 4),
(5, 'Estudio Roma', 'Estudio acogedor para estudiantes', 'Estudio', 1, 7500.00, 'Disponible', '2025-01-05 16:30:00', 5, 5),
(6, 'Departamento Del Valle', 'Excelente ubicación y seguridad', 'Departamento', 3, 15000.00, 'Desactivada', '2024-09-20 12:00:00', 6, 6),
(7, 'Habitación Iztapalapa', 'Habitación económica', 'Habitación', 1, 3500.00, 'Disponible', '2025-01-10 08:45:00', 7, 7),
(8, 'Casa Coyoacán', 'Casa colonial hermosa', 'Casa', 5, 28000.00, 'Disponible', '2024-08-01 10:00:00', 8, 8),
(9, 'Loft Santa Fe', 'Loft de lujo', 'Loft', 2, 18000.00, 'Sin Disponibilidad', '2024-07-15 09:30:00', 9, 9),
(10, 'Departamento Escandón', 'Departamento familiar', 'Departamento', 4, 13500.00, 'Disponible', '2025-01-20 15:00:00', 10, 10),
(11, 'Habitación Tacubaya', 'Cerca del metro', 'Habitación', 1, 4000.00, 'Disponible', '2024-11-25 11:00:00', 11, 11),
(12, 'Casa San Ángel', 'Casa con jardín', 'Casa', 6, 35000.00, 'Disponible', '2024-10-05 14:30:00', 12, 12),
(13, 'Estudio Narvarte', 'Perfecto para parejas', 'Estudio', 2, 9000.00, 'Disponible', '2025-01-01 12:00:00', 13, 13),
(14, 'Departamento Tlatelolco', 'Céntrico y económico', 'Departamento', 3, 8000.00, 'Desactivada', '2024-08-20 10:00:00', 14, 14),
(15, 'Habitación Azcapotzalco', 'Habitación amueblada', 'Habitación', 1, 3800.00, 'Disponible', '2025-01-15 09:00:00', 15, 15),
(16, 'Casa Tlalpan', 'Casa grande con alberca', 'Casa', 5, 40000.00, 'Disponible', '2024-09-10 11:30:00', 16, 16),
(17, 'Loft Juárez', 'Loft industrial', 'Loft', 2, 11000.00, 'Sin Disponibilidad', '2024-10-30 15:45:00', 17, 17),
(18, 'Departamento Xochimilco', 'Vista al mar', 'Departamento', 3, 9500.00, 'Disponible', '2025-01-25 08:00:00', 18, 18),
(19, 'Habitación Cuauhtémoc', 'Zona turística', 'Habitación', 1, 5500.00, 'Disponible', '2024-12-20 14:15:00', 19, 19),
(20, 'Casa Miguel Hidalgo', 'Casa de lujo con seguridad', 'Casa', 4, 32000.00, 'Disponible', '2024-11-11 10:30:00', 20, 20);

-- -----------------------------------------------------
-- 6. TABLA fotos (20 fotos)
-- -----------------------------------------------------
INSERT INTO `fotos` (`idFotos`, `fotosURL`, `propiedad_idPropiedad`) VALUES
(1, 'https://ejemplo.com/fotos/prop1/loft.jpg', 1),
(2, 'https://ejemplo.com/fotos/prop1/cocina.jpg', 1),
(3, 'https://ejemplo.com/fotos/prop2/fachada.jpg', 2),
(4, 'https://ejemplo.com/fotos/prop2/sala.jpg', 2),
(5, 'https://ejemplo.com/fotos/prop3/habitacion.jpg', 3),
(6, 'https://ejemplo.com/fotos/prop4/terraza.jpg', 4),
(7, 'https://ejemplo.com/fotos/prop4/patio.jpg', 4),
(8, 'https://ejemplo.com/fotos/prop5/estudio.jpg', 5),
(9, 'https://ejemplo.com/fotos/prop6/entrada.jpg', 6),
(10, 'https://ejemplo.com/fotos/prop7/habitacion.jpg', 7),
(11, 'https://ejemplo.com/fotos/prop7/jardin.jpg', 7),
(12, 'https://ejemplo.com/fotos/prop8/colonial.jpg', 8),
(13, 'https://ejemplo.com/fotos/prop9/loft_lujo.jpg', 9),
(14, 'https://ejemplo.com/fotos/prop10/sala.jpg', 10),
(15, 'https://ejemplo.com/fotos/prop10/cocina.jpg', 10),
(16, 'https://ejemplo.com/fotos/prop11/habitacion_simple.jpg', 11),
(17, 'https://ejemplo.com/fotos/prop12/jardin_grande.jpg', 12),
(18, 'https://ejemplo.com/fotos/prop13/estudio_partner.jpg', 13),
(19, 'https://ejemplo.com/fotos/prop14/departamento.jpg', 14),
(20, 'https://ejemplo.com/fotos/prop15/habitacion_amueblada.jpg', 15);

-- -----------------------------------------------------
-- 8. TABLA arrendamiento (20 contratos)
-- -----------------------------------------------------
INSERT INTO `arrendamiento` (`idArrendamiento`, `arrendamientoFechaInicio`, `arrendamientoRenta`, `arrendamientoDescrip`, `arrendamientoValEstudiante`, `arrendamientoValArrendador`, `arrendatario_idArrendatario`, `propiedad_idPropiedad`) VALUES
(1, '2024-12-01 00:00:00', 8500, 'Contrato anual - estudiante responsable', 1, 1, 1, 1),
(2, '2024-11-15 00:00:00', 12000, 'Renta con depósito', 1, 1, 2, 2),
(3, '2024-10-01 00:00:00', 6500, 'Contrato renovable', 1, 1, 3, 3),
(4, '2024-09-20 00:00:00', 22000, 'Familiar', 1, 1, 4, 4),
(5, '2024-12-20 00:00:00', 7500, 'Estudiante foráneo', 1, 1, 5, 5),
(6, '2024-08-01 00:00:00', 15000, 'Contrato temporal', 0, 1, 6, 6),
(7, '2024-07-15 00:00:00', 3500, 'Económico', 1, 0, 7, 7),
(8, '2024-11-01 00:00:00', 28000, 'Contrato familiar', 1, 1, 8, 8),
(9, '2024-10-10 00:00:00', 18000, 'Ejecutivo', 1, 1, 9, 9),
(10, '2024-09-05 00:00:00', 13500, 'Con amenities', 1, 1, 10, 10),
(11, '2024-12-15 00:00:00', 4000, 'Contrato semestral', 1, 1, 11, 11),
(12, '2024-11-20 00:00:00', 35000, 'Contrato lujoso', 1, 1, 12, 12),
(13, '2024-10-25 00:00:00', 9000, 'Para estudiantes', 1, 1, 13, 13),
(14, '2024-08-30 00:00:00', 8000, 'Céntrico', 0, 1, 14, 14),
(15, '2024-12-10 00:00:00', 3800, 'Económico amueblado', 1, 0, 15, 15),
(16, '2024-09-15 00:00:00', 40000, 'Contrato premium', 1, 1, 16, 16),
(17, '2024-10-05 00:00:00', 11000, 'Industrial', 1, 1, 17, 17),
(18, '2024-11-25 00:00:00', 9500, 'Vista al lago', 1, 1, 18, 18),
(19, '2024-12-30 00:00:00', 5500, 'Zona turística', 1, 1, 19, 19),
(20, '2024-11-10 00:00:00', 32000, 'Seguridad alta', 1, 1, 20, 20);

-- -----------------------------------------------------
-- 9. TABLA resena (20 reseñas)
-- -----------------------------------------------------
INSERT INTO `resena` (`idResena`, `resenaFechaCreacion`, `resenaDuracionRenta`, `resenaDescrip`, `resenaCalSerBasic`, `resenaCalSerComEnt`, `resenaCalSerAdicio`, `resenaCalGen`, `resenaSentimiento`, `propiedad_idPropiedad`, `arrendatario_idArrendatario`) VALUES
(1, '2025-01-15 10:00:00', 6, 'Excelente loft, todo muy limpio', 5.0, 4.5, 4.0, 4.8, 'Positivo', 1, 1),
(2, '2025-01-14 11:30:00', 8, 'Departamento amplio y bien ubicado', 5.0, 5.0, 4.5, 5.0, 'Positivo', 2, 2),
(3, '2025-01-13 09:15:00', 5, 'Habitación algo pequeña pero cómoda', 4.0, 4.0, 3.5, 4.0, 'Neutro', 3, 3),
(4, '2025-01-12 14:00:00', 10, 'Casa increíble, volvería', 5.0, 5.0, 5.0, 5.0, 'Positivo', 4, 4),
(5, '2025-01-11 16:30:00', 3, 'Estudio perfecto para estudiar', 4.5, 4.0, 4.0, 4.3, 'Positivo', 5, 5),
(6, '2025-01-10 08:45:00', 12, 'Mala experiencia, ruidoso', 2.0, 2.5, 3.0, 2.5, 'Negativo', 6, 6),
(7, '2025-01-09 10:00:00', 15, 'Excelente para el precio', 4.0, 4.0, 3.5, 4.0, 'Positivo', 7, 7),
(8, '2025-01-08 13:20:00', 8, 'Casa hermosa, jardín precioso', 5.0, 5.0, 5.0, 5.0, 'Positivo', 8, 8),
(9, '2025-01-07 12:00:00', 6, 'Loft de lujo, recomendado', 5.0, 4.5, 5.0, 4.9, 'Positivo', 9, 9),
(10, '2025-01-06 15:30:00', 7, 'Departamento cómodo y seguro', 4.5, 4.0, 4.5, 4.5, 'Positivo', 10, 10),
(11, '2025-01-05 09:00:00', 4, 'Habitación básica pero funcional', 3.5, 3.0, 3.0, 3.5, 'Neutro', 11, 11),
(12, '2025-01-04 11:45:00', 9, 'Casa espectacular', 5.0, 5.0, 5.0, 5.0, 'Positivo', 12, 12),
(13, '2025-01-03 14:15:00', 15, 'Muy caro para lo que ofrece', 3.0, 2.5, 4.0, 3.2, 'Negativo', 13, 13),
(14, '2025-01-02 10:30:00', 5, 'Muy céntrico y económico', 4.0, 4.0, 3.0, 4.0, 'Positivo', 14, 14),
(15, '2025-01-01 12:00:00', 6, 'Habitación amueblada, todo bien', 4.5, 4.0, 4.0, 4.2, 'Positivo', 15, 15),
(16, '2024-12-31 13:30:00', 10, 'Excelente para familias', 5.0, 5.0, 5.0, 5.0, 'Positivo', 16, 16),
(17, '2024-12-30 15:00:00', 11, 'Loft con estilo industrial', 4.5, 4.5, 4.0, 4.5, 'Positivo', 17, 17),
(18, '2024-12-29 08:30:00', 4, 'Vista increíble', 4.0, 5.0, 4.5, 4.5, 'Positivo', 18, 18),
(19, '2024-12-28 10:45:00', 7, 'Zona turística, ruido nocturno', 3.5, 3.0, 4.0, 3.5, 'Neutro', 19, 19),
(20, '2024-12-27 14:00:00', 12, 'Casa muy segura', 5.0, 4.5, 5.0, 4.8, 'Positivo', 20, 20);

-- -----------------------------------------------------
-- 10. TABLA servicio_has_propiedad (20 relaciones)
-- -----------------------------------------------------
INSERT INTO `servicio_has_propiedad` (`servicio_idServicio`, `propiedad_idPropiedad`) VALUES
(1, 1), (2, 1), (4, 1), (11, 1), (13, 1),
(1, 2), (2, 2), (3, 2), (4, 2), (11, 2), (14, 2),
(1, 3), (2, 3), (4, 3), (11, 3),
(1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (11, 4), (15, 4), (17, 4),
(1, 5), (2, 5), (4, 5), (6, 5), (11, 5),
(1, 6), (2, 6), (3, 6), (4, 6), (12, 6),
(1, 7), (3, 7), (4, 7),
(1, 8), (2, 8), (4, 8), (5, 8), (11, 8), (13, 8), (16, 8),
(1, 9), (2, 9), (4, 9), (11, 9), (13, 9), (14, 9),
(1, 10), (2, 10), (3, 10), (4, 10), (11, 10),
(1, 11), (2, 11), (4, 11),
(1, 12), (2, 12), (3, 12), (4, 12), (5, 12), (17, 12),
(1, 13), (2, 13), (4, 13), (11, 13),
(1, 14), (2, 14), (3, 14), (4, 14), (12, 14),
(1, 15), (3, 15), (4, 15), (7, 15),
(1, 16), (2, 16), (3, 16), (4, 16), (5, 16), (13, 16), (15, 16),
(1, 17), (2, 17), (4, 17), (11, 17),
(1, 18), (2, 18), (3, 18), (4, 18), (12, 18),
(1, 19), (2, 19), (4, 19), (6, 19),
(1, 20), (2, 20), (3, 20), (4, 20), (5, 20), (15, 20), (17, 20);

-- -----------------------------------------------------
-- 13. TABLA administrador (5 administradores)
-- -----------------------------------------------------
INSERT INTO `administrador` (`adminUser`, `adminContra`, `adminFechaInicioSesion`) VALUES
('admin_root', 'hash_admin_123', '2025-01-15 09:00:00'),
('super_admin', 'hash_super_456', '2025-01-15 10:30:00'),
('moderador1', 'hash_mod_789', '2025-01-14 14:00:00'),
('gestor_propiedades', 'hash_gestor_321', '2025-01-13 11:15:00'),
('soporte_tec', 'hash_soporte_555', '2025-01-12 16:45:00');

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;