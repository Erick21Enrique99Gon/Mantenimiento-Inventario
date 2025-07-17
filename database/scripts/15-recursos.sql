USE `Inventario`;
-- Asociar libros a recurso
INSERT INTO recurso (libroId, estadoId)
SELECT libroId, 1 FROM libro;

-- Asociar equipos a recurso
INSERT INTO recurso (equipoId, estadoId)
SELECT equipoId, 1 FROM equipo;

-- Asociar mobiliario a recurso
INSERT INTO recurso (mobiliarioId, estadoId)
SELECT mobiliarioId, 1 FROM mobiliario;