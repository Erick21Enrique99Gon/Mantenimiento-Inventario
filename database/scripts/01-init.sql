USE `Inventario`;

CREATE TABLE `cat_editorial` (
  `editorialId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`editorialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cat_estado` (
  `estadoId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`estadoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cat_tipo_equipo` (
  `tipoEquipoId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`tipoEquipoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `cat_tipo_mobiliario` (
  `tipoMobiliarioId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`tipoMobiliarioId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `codigo_libro` (
  `codigoId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`codigoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `cat_categorias_equipo` (
  `categoria_equipoId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`categoria_equipoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ubicacion_salon` (
  `ubicacionId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`ubicacionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `rol` (
  `rolId` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`rolId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `usuario` (
  `usuarioId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `apellidos` VARCHAR(255) NOT NULL,
  `carnet` VARCHAR(15) NOT NULL UNIQUE,
  `dpi` VARCHAR(13) NOT NULL UNIQUE,
  `rolId` INT(11) NULL,
  PRIMARY KEY (`usuarioId`),
  FOREIGN KEY (`rolId`) REFERENCES `rol`(`rolId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `codigo_inventario` (
  `codigoInventarioId` INT(11) NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (`codigoInventarioId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `rfid_registro` (
  `rfidId` INT(11) NOT NULL AUTO_INCREMENT,
  `rfid` VARCHAR(255) NOT NULL UNIQUE,
  `estadoId` INT(11) NULL,
  PRIMARY KEY (`rfidId`),
  FOREIGN KEY (`estadoId`) REFERENCES `cat_estado` (`estadoId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `equipo` (
  `equipoId` INT(11) NOT NULL AUTO_INCREMENT,
  `codigoInventarioId` INT(11) NULL,
  `descripcion` TEXT NOT NULL,
  `tresp` INT(11) NOT NULL,
  `rfidId` INT(11) NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `categoria_equipoId` INT(11) NULL,
  `tipoEquipoId` INT(11) NULL,
  `ubicacionId` INT(11) NULL,
  `estadoId` INT(11) NULL,
  PRIMARY KEY (`equipoId`),
  FOREIGN KEY (`codigoInventarioId`) REFERENCES `codigo_inventario` (`codigoInventarioId`) ON DELETE SET NULL,
  FOREIGN KEY (`rfidId`) REFERENCES `rfid_registro` (`rfidId`) ON DELETE SET NULL,
  FOREIGN KEY (`estadoId`) REFERENCES `cat_estado` (`estadoId`) ON DELETE SET NULL,
  FOREIGN KEY (`categoria_equipoId`) REFERENCES `cat_categorias_equipo` (`categoria_equipoId`) ON DELETE SET NULL,
  FOREIGN KEY (`tipoEquipoId`) REFERENCES `cat_tipo_equipo` (`tipoEquipoId`) ON DELETE SET NULL,
  FOREIGN KEY (`ubicacionId`) REFERENCES `ubicacion_salon` (`ubicacionId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mobiliario` (
  `mobiliarioId` INT(11) NOT NULL AUTO_INCREMENT,
  `codigoInventarioId` INT(11) NULL,
  `descripcion` TEXT NOT NULL,
  `tresp` INT(11) NOT NULL,
  `rfidId` INT(11) NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `tipoMobiliarioId` INT(11) NULL,
  `ubicacionId` INT(11) NULL,
  `estadoId` INT(11) NULL,
  PRIMARY KEY (`mobiliarioId`),
  FOREIGN KEY (`codigoInventarioId`) REFERENCES `codigo_inventario` (`codigoInventarioId`) ON DELETE SET NULL,
  FOREIGN KEY (`rfidId`) REFERENCES `rfid_registro` (`rfidId`) ON DELETE SET NULL,
  FOREIGN KEY (`estadoId`) REFERENCES `cat_estado` (`estadoId`) ON DELETE SET NULL,
  FOREIGN KEY (`tipoMobiliarioId`) REFERENCES `cat_tipo_mobiliario` (`tipoMobiliarioId`) ON DELETE SET NULL,
  FOREIGN KEY (`ubicacionId`) REFERENCES `ubicacion_salon` (`ubicacionId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `libro` (
  `libroId` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` TEXT NOT NULL,
  `autor` TEXT NOT NULL,
  `isbn` VARCHAR(255) NOT NULL,
  `anio` INT(4) NOT NULL,
  `edicion` INT(11) NOT NULL,
  `numero` INT(11) NOT NULL,
  `rfidId` INT(11) NULL,
  `editorialId` INT(11) NULL,
  `codigoId` INT(11) NULL,
  `ubicacionId` INT(11) NULL,
  `estadoId` INT(11) NULL,
  PRIMARY KEY (`libroId`),
  FOREIGN KEY (`rfidId`) REFERENCES `rfid_registro` (`rfidId`) ON DELETE SET NULL,
  FOREIGN KEY (`codigoId`) REFERENCES `codigo_libro` (`codigoId`) ON DELETE SET NULL,
  FOREIGN KEY (`estadoId`) REFERENCES `cat_estado` (`estadoId`) ON DELETE SET NULL,
  FOREIGN KEY (`editorialId`) REFERENCES `cat_editorial` (`editorialId`) ON DELETE SET NULL,
  FOREIGN KEY (`ubicacionId`) REFERENCES `ubicacion_salon` (`ubicacionId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `recurso` (
  `recursoId` INT(11) NOT NULL AUTO_INCREMENT,
  `libroId` INT(11) NULL,
  `equipoId` INT(11) NULL,
  `mobiliarioId` INT(11) NULL,
  `estadoId` INT(11) NULL,
  `imagen_recurso` TEXT NULL,
  PRIMARY KEY (`recursoId`),
  FOREIGN KEY (`estadoId`) REFERENCES `cat_estado` (`estadoId`) ON DELETE SET NULL,
  FOREIGN KEY (`equipoId`) REFERENCES `equipo` (`equipoId`) ON DELETE SET NULL,
  FOREIGN KEY (`libroId`) REFERENCES `libro` (`libroId`) ON DELETE SET NULL,
  FOREIGN KEY (`mobiliarioId`) REFERENCES `mobiliario` (`mobiliarioId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `prestamo` (
  `prestamoId` INT(11) NOT NULL AUTO_INCREMENT,
  `estadoId` INT(11) NULL,
  `observacion` TEXT NOT NULL,
  PRIMARY KEY (`prestamoId`),
  FOREIGN KEY (`estadoId`) REFERENCES `cat_estado` (`estadoId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `detalle_prestamo` (
  `detalleId` INT(11) NOT NULL AUTO_INCREMENT,
  `prestamoId` INT(11) NULL,
  `recursoId` INT(11) NULL,
  PRIMARY KEY (`detalleId`),
  FOREIGN KEY (`prestamoId`) REFERENCES `prestamo` (`prestamoId`) ON DELETE SET NULL,
  FOREIGN KEY (`recursoId`) REFERENCES `recurso` (`recursoId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `historial_prestamo` (
  `historialPrestamoId` INT(11) NOT NULL AUTO_INCREMENT,
  `prestamoId` INT(11) NOT NULL,
  `usuario_prestarioId` INT(11) NULL,
  `usuario_prestamistaId` INT(11) NULL,
  `fecha_prestamo` DATETIME NOT NULL,
  `imagen_prestamo` TEXT NULL,
  `fecha_devolucion` DATETIME NULL,
  `imagen_devolucion` TEXT NULL,
  PRIMARY KEY (`historialPrestamoId`),
  FOREIGN KEY (`prestamoId`) REFERENCES `prestamo` (`prestamoId`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_prestarioId`) REFERENCES `usuario` (`usuarioId`) ON DELETE SET NULL,
  FOREIGN KEY (`usuario_prestamistaId`) REFERENCES `usuario` (`usuarioId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


