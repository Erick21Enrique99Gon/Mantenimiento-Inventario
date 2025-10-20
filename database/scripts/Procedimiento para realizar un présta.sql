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

    -- Obtener  estado
    IF v_tipo = 'Libro' THEN
        SELECT estadoId INTO v_estadoId FROM libro WHERE libroId = v_hijoId;
    ELSEIF v_tipo = 'Mobiliario' THEN
        SELECT estadoId INTO v_estadoId FROM mobiliario WHERE mobiliarioId = v_hijoId;
    ELSEIF v_tipo = 'Equipo' THEN
        SELECT estadoId INTO v_estadoId FROM equipo WHERE equipoId = v_hijoId;
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