USE `Inventario`;
-- Procedimientos almacenados

DELIMITER //

-- Procedimiento para crear un libro
CREATE PROCEDURE CrearLibro(
    IN p_titulo TEXT,
    IN p_autor TEXT,
    IN p_isbn VARCHAR(255),
    IN p_anio INT,
    IN p_edicion INT,
    IN p_numero INT,
    IN p_rfidId INT,
    IN p_editorialId INT,
    IN p_codigoId INT,
    IN p_ubicacionId INT,
    IN p_imagen_recurso TEXT
)
BEGIN
    DECLARE v_libroId INT;

    -- Si se proporciona un RFID, actualizar su estado a "Activo"
    IF p_rfidId IS NOT NULL THEN
        UPDATE rfid_registro SET estadoId = 4 WHERE rfidId = p_rfidId;
    END IF;

    INSERT INTO libro (titulo, autor, isbn, anio, edicion, numero, rfidId, editorialId, codigoId, ubicacionId, estadoId)
    VALUES (p_titulo, p_autor, p_isbn, p_anio, p_edicion, p_numero, p_rfidId, p_editorialId, p_codigoId, p_ubicacionId, 1);

    SET v_libroId = LAST_INSERT_ID();

    INSERT INTO recurso (libroId, estadoId, imagen_recurso)
    VALUES (v_libroId, 1, p_imagen_recurso);

    SELECT 'Libro creado exitosamente' AS mensaje, v_libroId AS id;
END //

-- Procedimiento para crear mobiliario
CREATE PROCEDURE CrearMobiliario(
    IN p_codigoInventarioId INT,
    IN p_descripcion TEXT,
    IN p_tresp INT,
    IN p_rfidId INT,
    IN p_valor DECIMAL(10,2),
    IN p_tipoMobiliarioId INT,
    IN p_ubicacionId INT,
    IN p_imagen_recurso TEXT
)
BEGIN
    DECLARE v_mobiliarioId INT;

    -- Si se proporciona un RFID, actualizar su estado a "Activo"
    IF p_rfidId IS NOT NULL THEN
        UPDATE rfid_registro SET estadoId = 4 WHERE rfidId = p_rfidId;
    END IF;

    IF EXISTS (SELECT 1 FROM equipo WHERE codigoInventarioId = p_codigoInventarioId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El Código de Inventario ya está en uso en equipo';
    END IF;

    IF EXISTS (SELECT 1 FROM mobiliario WHERE codigoInventarioId = p_codigoInventarioId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El Código de Inventario ya está en uso en mobiliario';
    END IF;

    INSERT INTO mobiliario (codigoInventarioId, descripcion, tresp, rfidId, valor, tipoMobiliarioId, ubicacionId, estadoId)
    VALUES (p_codigoInventarioId, p_descripcion, p_tresp, p_rfidId, p_valor, p_tipoMobiliarioId, p_ubicacionId, 1);

    SET v_mobiliarioId = LAST_INSERT_ID();

    INSERT INTO recurso (mobiliarioId, estadoId, imagen_recurso)
    VALUES (v_mobiliarioId, 1, p_imagen_recurso);

    SELECT 'Mobiliario creado exitosamente' AS mensaje, v_mobiliarioId AS id;
END //

-- Procedimiento para crear equipo
CREATE PROCEDURE CrearEquipo(
    IN p_codigoInventarioId INT,
    IN p_descripcion TEXT,
    IN p_tresp INT,
    IN p_rfidId INT,
    IN p_valor DECIMAL(10,2),
    IN p_categoria_equipoId INT,
    IN p_tipoEquipoId INT,
    IN p_ubicacionId INT,
    IN p_imagen_recurso TEXT
)
BEGIN
    DECLARE v_equipoId INT;

    -- Si se proporciona un RFID, actualizar su estado a "Activo"
    IF p_rfidId IS NOT NULL THEN
        UPDATE rfid_registro SET estadoId = 4 WHERE rfidId = p_rfidId;
    END IF;

    IF EXISTS (SELECT 1 FROM equipo WHERE codigoInventarioId = p_codigoInventarioId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El Código de Inventario ya está en uso en equipo';
    END IF;

    IF EXISTS (SELECT 1 FROM mobiliario WHERE codigoInventarioId = p_codigoInventarioId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El Código de Inventario ya está en uso en mobiliario';
    END IF;

    INSERT INTO equipo (codigoInventarioId, descripcion, tresp, rfidId, valor, categoria_equipoId, tipoEquipoId, ubicacionId, estadoId)
    VALUES (p_codigoInventarioId, p_descripcion, p_tresp, p_rfidId, p_valor, p_categoria_equipoId, p_tipoEquipoId, p_ubicacionId, 1);

    SET v_equipoId = LAST_INSERT_ID();

    INSERT INTO recurso (equipoId, estadoId, imagen_recurso)
    VALUES (v_equipoId, 1, p_imagen_recurso);

    SELECT 'Equipo creado exitosamente' AS mensaje, v_equipoId AS id;
END //

-- Procedimiento para actualizar libro
CREATE PROCEDURE ActualizarLibro(
    IN p_recursoId INT, -- Se usa recursoId en lugar de libroId
    IN p_titulo TEXT,
    IN p_autor TEXT,
    IN p_isbn VARCHAR(255),
    IN p_anio INT,
    IN p_edicion INT,
    IN p_numero INT,
    IN p_editorialId INT,
    IN p_codigoId INT,
    IN p_ubicacionId INT,
    IN p_imagen_recurso TEXT
)
BEGIN
    DECLARE v_libroId INT;
    DECLARE filas_afectadas INT DEFAULT 0;

    -- Obtener el libroId correspondiente al recursoId
    SELECT libroId INTO v_libroId FROM recurso WHERE recursoId = p_recursoId;

    -- Validar si el libro existe
    IF v_libroId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No existe un libro asociado a este recurso';
    ELSE
        -- Actualizar libro asegurando que no se sobrescriban valores idénticos
        UPDATE libro 
        SET titulo = IFNULL(NULLIF(p_titulo, titulo), titulo),
            autor = IFNULL(NULLIF(p_autor, autor), autor),
            isbn = IFNULL(NULLIF(p_isbn, isbn), isbn),
            anio = IFNULL(NULLIF(p_anio, anio), anio),
            edicion = IFNULL(NULLIF(p_edicion, edicion), edicion),
            numero = IFNULL(NULLIF(p_numero, numero), numero),
            editorialId = IFNULL(NULLIF(p_editorialId, editorialId), editorialId),
            codigoId = IFNULL(NULLIF(p_codigoId, codigoId), codigoId),
            ubicacionId = IFNULL(NULLIF(p_ubicacionId, ubicacionId), ubicacionId)
        WHERE libroId = v_libroId;

        SET filas_afectadas = ROW_COUNT();

        -- Actualizar imagen si se proporciona
        IF p_imagen_recurso IS NOT NULL AND p_imagen_recurso != '' THEN
            UPDATE recurso 
            SET imagen_recurso = p_imagen_recurso
            WHERE recursoId = p_recursoId;

            SET filas_afectadas = filas_afectadas + ROW_COUNT();
        END IF;

        -- Mensaje de respuesta
        IF filas_afectadas > 0 THEN
            SELECT 'Libro actualizado exitosamente' AS mensaje, v_libroId AS id;
        ELSE
            SELECT 'No se realizaron cambios, los valores son iguales a los actuales' AS mensaje, v_libroId AS id;
        END IF;
    END IF;

    -- Verificar si el libro realmente se actualizó
    SELECT * FROM libro WHERE libroId = v_libroId;
END //


-- Procedimiento para actualizar mobiliario
CREATE PROCEDURE ActualizarMobiliario(
    IN p_recursoId INT, -- Se usa recursoId en lugar de mobiliarioId
    IN p_codigoInventarioId INT,
    IN p_descripcion TEXT,
    IN p_tresp VARCHAR(255),
    IN p_valor DECIMAL(10,2),
    IN p_tipoMobiliarioId INT,
    IN p_ubicacionId INT,
    IN p_imagen_recurso TEXT
)
BEGIN
    DECLARE v_mobiliarioId INT;
    DECLARE filas_afectadas INT DEFAULT 0;
    DECLARE v_codigoInventarioId_actual INT;

    -- Obtener el mobiliarioId correspondiente al recursoId
    SELECT mobiliarioId, codigoInventarioId 
    INTO v_mobiliarioId, v_codigoInventarioId_actual
    FROM mobiliario WHERE mobiliarioId = (SELECT mobiliarioId FROM recurso WHERE recursoId = p_recursoId);

    -- Validar si el mobiliario existe
    IF v_mobiliarioId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No existe un mobiliario asociado a este recurso';
    END IF;

    -- Validar si se intenta asignar un código de inventario ya en uso por otro mobiliario o equipo
    IF p_codigoInventarioId IS NOT NULL 
       AND p_codigoInventarioId <> v_codigoInventarioId_actual 
       AND (EXISTS (SELECT 1 FROM equipo WHERE codigoInventarioId = p_codigoInventarioId) 
            OR EXISTS (SELECT 1 FROM mobiliario WHERE codigoInventarioId = p_codigoInventarioId AND mobiliarioId <> v_mobiliarioId)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El Código de Inventario ya está en uso por otro mobiliario o equipo';
    END IF;

    -- Actualizar mobiliario asegurando que no se sobrescriban valores idénticos
    UPDATE mobiliario 
    SET codigoInventarioId = IFNULL(NULLIF(p_codigoInventarioId, codigoInventarioId), codigoInventarioId),
        descripcion = IFNULL(NULLIF(p_descripcion, descripcion), descripcion),
        tresp = IFNULL(NULLIF(p_tresp, tresp), tresp),
        valor = IFNULL(NULLIF(p_valor, valor), valor),
        tipoMobiliarioId = IFNULL(NULLIF(p_tipoMobiliarioId, tipoMobiliarioId), tipoMobiliarioId),
        ubicacionId = IFNULL(NULLIF(p_ubicacionId, ubicacionId), ubicacionId)
    WHERE mobiliarioId = v_mobiliarioId;

    SET filas_afectadas = ROW_COUNT();

    -- Actualizar imagen si se proporciona
    IF p_imagen_recurso IS NOT NULL AND p_imagen_recurso != '' THEN
        UPDATE recurso 
        SET imagen_recurso = p_imagen_recurso
        WHERE recursoId = p_recursoId;

        SET filas_afectadas = filas_afectadas + ROW_COUNT();
    END IF;

    -- Mensaje de respuesta
    IF filas_afectadas > 0 THEN
        SELECT 'Mobiliario actualizado exitosamente' AS mensaje, v_mobiliarioId AS id;
    ELSE
        SELECT 'No se realizaron cambios, los valores son iguales a los actuales' AS mensaje, v_mobiliarioId AS id;
    END IF;

    -- Verificar si el mobiliario realmente se actualizó
    SELECT * FROM mobiliario WHERE mobiliarioId = v_mobiliarioId;
END //


-- Procedimiento para actualizar equipo
CREATE PROCEDURE ActualizarEquipo(
    IN p_recursoId INT, -- Usar recursoId en lugar de equipoId
    IN p_codigoInventarioId INT,
    IN p_descripcion TEXT,
    IN p_tresp VARCHAR(255),
    IN p_valor DECIMAL(10,2),
    IN p_categoria_equipoId INT,
    IN p_tipoEquipoId INT,
    IN p_ubicacionId INT,
    IN p_imagen_recurso TEXT
)
BEGIN
    DECLARE v_equipoId INT;
    DECLARE filas_afectadas INT DEFAULT 0;
    DECLARE v_codigoInventarioId_actual INT;

    -- Obtener el equipoId y códigoInventarioId correspondiente al recursoId
    SELECT equipoId, codigoInventarioId 
    INTO v_equipoId, v_codigoInventarioId_actual
    FROM equipo WHERE equipoId = (SELECT equipoId FROM recurso WHERE recursoId = p_recursoId);

    -- Validar si el equipo existe
    IF v_equipoId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No existe un equipo asociado a este recurso';
    END IF;

    -- Validar si se intenta asignar un código de inventario ya en uso por otro equipo o mobiliario
    IF p_codigoInventarioId IS NOT NULL 
       AND p_codigoInventarioId <> v_codigoInventarioId_actual 
       AND (EXISTS (SELECT 1 FROM equipo WHERE codigoInventarioId = p_codigoInventarioId AND equipoId <> v_equipoId) 
            OR EXISTS (SELECT 1 FROM mobiliario WHERE codigoInventarioId = p_codigoInventarioId)) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El Código de Inventario ya está en uso por otro equipo o mobiliario';
    END IF;

    -- Actualizar equipo asegurando que no se sobrescriban valores idénticos
    UPDATE equipo 
    SET codigoInventarioId = IFNULL(NULLIF(p_codigoInventarioId, codigoInventarioId), codigoInventarioId),
        descripcion = IFNULL(NULLIF(p_descripcion, descripcion), descripcion),
        tresp = IFNULL(NULLIF(p_tresp, tresp), tresp),
        valor = IFNULL(NULLIF(p_valor, valor), valor),
        categoria_equipoId = IFNULL(NULLIF(p_categoria_equipoId, categoria_equipoId), categoria_equipoId),
        tipoEquipoId = IFNULL(NULLIF(p_tipoEquipoId, tipoEquipoId), tipoEquipoId),
        ubicacionId = IFNULL(NULLIF(p_ubicacionId, ubicacionId), ubicacionId)
    WHERE equipoId = v_equipoId;

    SET filas_afectadas = ROW_COUNT();

    -- Si hay imagen, actualizar en recurso
    IF p_imagen_recurso IS NOT NULL AND p_imagen_recurso != '' THEN
        UPDATE recurso 
        SET imagen_recurso = p_imagen_recurso
        WHERE recursoId = p_recursoId;

        SET filas_afectadas = filas_afectadas + ROW_COUNT();
    END IF;

    -- Mensaje de respuesta
    IF filas_afectadas > 0 THEN
        SELECT 'Equipo actualizado exitosamente' AS mensaje, v_equipoId AS id;
    ELSE
        SELECT 'No se realizaron cambios, los valores son iguales a los actuales' AS mensaje, v_equipoId AS id;
    END IF;

    -- Verificar si el equipo realmente se actualizó
    SELECT * FROM equipo WHERE equipoId = v_equipoId;
END //

-- Asignar RFID a un libro
CREATE PROCEDURE AsignarRFIDLibro(
    IN p_libroId INT,
    IN p_rfidId INT
)
BEGIN
    -- Validar si el RFID existe y está inactivo
    IF NOT EXISTS (SELECT 1 FROM rfid_registro WHERE rfidId = p_rfidId AND estadoId = 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: RFID no existe o ya está en uso';
    ELSE
        -- Asignar RFID al libro y actualizar su estado
        UPDATE libro SET rfidId = p_rfidId WHERE libroId = p_libroId;
        UPDATE rfid_registro SET estadoId = 4 WHERE rfidId = p_rfidId;
        SELECT 'RFID asignado exitosamente al libro' AS mensaje;
    END IF;
END //

-- Desasignar RFID de un libro
CREATE PROCEDURE DesasignarRFIDLibro(
    IN p_libroId INT
)
BEGIN
    DECLARE v_rfidId INT;

    -- Obtener el RFID asociado al libro
    SELECT rfidId INTO v_rfidId FROM libro WHERE libroId = p_libroId;
    
    -- Validar si el libro tiene un RFID asignado
    IF v_rfidId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Este libro no tiene un RFID asignado';
    ELSE
        -- Desasignar RFID y cambiar su estado a inactivo
        UPDATE libro SET rfidId = NULL WHERE libroId = p_libroId;
        UPDATE rfid_registro SET estadoId = 5 WHERE rfidId = v_rfidId;
        SELECT 'RFID desasignado exitosamente del libro' AS mensaje;
    END IF;
END //

-- Asignar RFID a un mobiliario
CREATE PROCEDURE AsignarRFIDMobiliario(
    IN p_mobiliarioId INT,
    IN p_rfidId INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM rfid_registro WHERE rfidId = p_rfidId AND estadoId = 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: RFID no existe o ya está en uso';
    ELSE
        UPDATE mobiliario SET rfidId = p_rfidId WHERE mobiliarioId = p_mobiliarioId;
        UPDATE rfid_registro SET estadoId = 4 WHERE rfidId = p_rfidId;
        SELECT 'RFID asignado exitosamente al mobiliario' AS mensaje;
    END IF;
END //

-- Desasignar RFID de un mobiliario
CREATE PROCEDURE DesasignarRFIDMobiliario(
    IN p_mobiliarioId INT
)
BEGIN
    DECLARE v_rfidId INT;

    SELECT rfidId INTO v_rfidId FROM mobiliario WHERE mobiliarioId = p_mobiliarioId;

    IF v_rfidId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Este mobiliario no tiene un RFID asignado';
    ELSE
        UPDATE mobiliario SET rfidId = NULL WHERE mobiliarioId = p_mobiliarioId;
        UPDATE rfid_registro SET estadoId = 5 WHERE rfidId = v_rfidId;
        SELECT 'RFID desasignado exitosamente del mobiliario' AS mensaje;
    END IF;
END //

-- Asignar RFID a un equipo
CREATE PROCEDURE AsignarRFIDEquipo(
    IN p_equipoId INT,
    IN p_rfidId INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM rfid_registro WHERE rfidId = p_rfidId AND estadoId = 5) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: RFID no existe o ya está en uso';
    ELSE
        UPDATE equipo SET rfidId = p_rfidId WHERE equipoId = p_equipoId;
        UPDATE rfid_registro SET estadoId = 4 WHERE rfidId = p_rfidId;
        SELECT 'RFID asignado exitosamente al equipo' AS mensaje;
    END IF;
END //

-- Desasignar RFID de un equipo
CREATE PROCEDURE DesasignarRFIDEquipo(
    IN p_equipoId INT
)
BEGIN
    DECLARE v_rfidId INT;

    SELECT rfidId INTO v_rfidId FROM equipo WHERE equipoId = p_equipoId;

    IF v_rfidId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Este equipo no tiene un RFID asignado';
    ELSE
        UPDATE equipo SET rfidId = NULL WHERE equipoId = p_equipoId;
        UPDATE rfid_registro SET estadoId = 5 WHERE rfidId = v_rfidId;
        SELECT 'RFID desasignado exitosamente del equipo' AS mensaje;
    END IF;
END //

-- Procedimiento para realizar un préstamo

CREATE PROCEDURE RealizarPrestamo(
    IN p_recursoId INT,
    IN p_usuarioPrestarioId INT,
    IN p_usuarioPrestamistaId INT,
    IN p_observacion TEXT,
    IN p_imagen_prestamo TEXT
)
BEGIN
    DECLARE v_recursoExiste INT;
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_hijoId INT;
    DECLARE v_rfidId INT;
    DECLARE v_estadoId INT;
    DECLARE v_prestamoId INT;
    DECLARE v_estadoDisponible INT;
    DECLARE v_estadoPrestado INT;

    -- Obtener IDs de estado
    SELECT estadoId INTO v_estadoDisponible FROM cat_estado WHERE descripcion = 'Disponible';
    SELECT estadoId INTO v_estadoPrestado FROM cat_estado WHERE descripcion = 'Prestado';

    -- Validar que el recurso exista
    SELECT COUNT(*) INTO v_recursoExiste FROM recurso WHERE recursoId = p_recursoId;
    IF v_recursoExiste = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El recurso no existe';
    END IF;

    -- Determinar el tipo y obtener el ID del hijo
    SELECT 
        IF(libroId IS NOT NULL, 'Libro', 
           IF(mobiliarioId IS NOT NULL, 'Mobiliario', 
              IF(equipoId IS NOT NULL, 'Equipo', NULL))) INTO v_tipo
    FROM recurso WHERE recursoId = p_recursoId;

    SELECT COALESCE(libroId, mobiliarioId, equipoId) INTO v_hijoId
    FROM recurso WHERE recursoId = p_recursoId;

    IF v_tipo IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Tipo de recurso desconocido';
    END IF;

    -- Obtener RFID y estado
    IF v_tipo = 'Libro' THEN
        SELECT rfidId, estadoId INTO v_rfidId, v_estadoId FROM libro WHERE libroId = v_hijoId;
    ELSEIF v_tipo = 'Mobiliario' THEN
        SELECT rfidId, estadoId INTO v_rfidId, v_estadoId FROM mobiliario WHERE mobiliarioId = v_hijoId;
    ELSEIF v_tipo = 'Equipo' THEN
        SELECT rfidId, estadoId INTO v_rfidId, v_estadoId FROM equipo WHERE equipoId = v_hijoId;
    END IF;

    IF v_rfidId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El recurso no tiene RFID';
    END IF;

    IF v_estadoId <> v_estadoDisponible THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Recurso no disponible';
    END IF;

    -- Crear el préstamo
    INSERT INTO prestamo (estadoId, observacion)
    VALUES ((SELECT estadoId FROM cat_estado WHERE descripcion = 'Activo'), p_observacion);

    SET v_prestamoId = LAST_INSERT_ID();

    INSERT INTO detalle_prestamo (prestamoId, recursoId)
    VALUES (v_prestamoId, p_recursoId);

    -- Actualizar estados
    UPDATE recurso SET estadoId = v_estadoPrestado WHERE recursoId = p_recursoId;

    IF v_tipo = 'Libro' THEN
        UPDATE libro SET estadoId = v_estadoPrestado WHERE libroId = v_hijoId;
    ELSEIF v_tipo = 'Mobiliario' THEN
        UPDATE mobiliario SET estadoId = v_estadoPrestado WHERE mobiliarioId = v_hijoId;
    ELSEIF v_tipo = 'Equipo' THEN
        UPDATE equipo SET estadoId = v_estadoPrestado WHERE equipoId = v_hijoId;
    END IF;

    -- Insertar historial con ambos usuarios
    INSERT INTO historial_prestamo (
        prestamoId, 
        usuario_prestarioId, 
        usuario_prestamistaId, 
        fecha_prestamo, 
        imagen_prestamo
    )
    VALUES (
        v_prestamoId,
        p_usuarioPrestarioId,
        p_usuarioPrestamistaId,
        NOW(),
        p_imagen_prestamo
    );

    SELECT 'Préstamo registrado exitosamente' AS mensaje, v_prestamoId AS prestamoId;
END //

CREATE PROCEDURE RealizarDevolucion(
    IN p_prestamoId INT,
    IN p_imagen_devolucion TEXT
)
BEGIN
    DECLARE v_estadoPrestamoId INT;
    DECLARE v_recursoId INT;
    DECLARE v_hijoId INT;
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_estadoDisponible INT;
    DECLARE v_estadoInactivo INT;
    DECLARE v_prestamoExiste INT;

    -- Obtener IDs de estado
    SELECT estadoId INTO v_estadoDisponible FROM cat_estado WHERE descripcion = 'Disponible';
    SELECT estadoId INTO v_estadoInactivo FROM cat_estado WHERE descripcion = 'Inactivo';

    -- Verificar si el préstamo existe
    SELECT COUNT(*) INTO v_prestamoExiste FROM prestamo WHERE prestamoId = p_prestamoId;

    IF v_prestamoExiste = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El préstamo no existe';
    END IF;

    -- Obtener el estado del préstamo
    SELECT estadoId INTO v_estadoPrestamoId FROM prestamo WHERE prestamoId = p_prestamoId;

    -- Verificar si el préstamo está activo
    IF v_estadoPrestamoId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No se encontró un estado válido para el préstamo';
    END IF;

    IF v_estadoPrestamoId <> (SELECT estadoId FROM cat_estado WHERE descripcion = 'Activo') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El préstamo ya está inactivo o no puede ser devuelto';
    END IF;

    -- Obtener el `recursoId` del préstamo
    SELECT recursoId INTO v_recursoId FROM detalle_prestamo WHERE prestamoId = p_prestamoId LIMIT 1;

    IF v_recursoId IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No se encontró un recurso asociado al préstamo';
    END IF;

    -- Determinar el tipo de recurso (Libro, Mobiliario o Equipo)
    SELECT 
        IF(libroId IS NOT NULL, 'Libro', 
           IF(mobiliarioId IS NOT NULL, 'Mobiliario', 
              IF(equipoId IS NOT NULL, 'Equipo', NULL))) INTO v_tipo
    FROM recurso WHERE recursoId = v_recursoId;

    SELECT COALESCE(libroId, mobiliarioId, equipoId) INTO v_hijoId
    FROM recurso WHERE recursoId = v_recursoId;

    IF v_tipo IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: No se encontró un tipo de recurso válido';
    END IF;

    -- Actualizar estado del recurso a "Disponible"
    UPDATE recurso SET estadoId = v_estadoDisponible WHERE recursoId = v_recursoId;

    -- Actualizar estado del hijo (libro, mobiliario o equipo) solo si tiene un ID válido
    IF v_hijoId IS NOT NULL THEN
        UPDATE libro SET estadoId = v_estadoDisponible WHERE libroId = v_hijoId;
        UPDATE mobiliario SET estadoId = v_estadoDisponible WHERE mobiliarioId = v_hijoId;
        UPDATE equipo SET estadoId = v_estadoDisponible WHERE equipoId = v_hijoId;
    END IF;

    -- Cambiar estado del préstamo a "Inactivo"
    UPDATE prestamo SET estadoId = v_estadoInactivo WHERE prestamoId = p_prestamoId;

    -- Actualizar `historial_prestamo` con la fecha y la imagen de devolución
    UPDATE historial_prestamo 
    SET fecha_devolucion = NOW(), imagen_devolucion = p_imagen_devolucion
    WHERE prestamoId = p_prestamoId;

    -- Retornar mensaje de éxito
    SELECT 'Devolución registrada exitosamente' AS mensaje, p_prestamoId AS prestamoId;
END //

DELIMITER ;

