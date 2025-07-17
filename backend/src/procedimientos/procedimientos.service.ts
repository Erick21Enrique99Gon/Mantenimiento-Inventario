import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProcedimientosService {
  constructor(private readonly dataSource: DataSource) {}

  private optionalValue(value: any): any {
    return value !== undefined && value !== null && value !== "" ? value : null;
  }

  // 📌 Crear libro
  async crearLibro(body: any) {
    return await this.dataSource.query(
      `CALL CrearLibro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.titulo,
        body.autor,
        body.isbn,
        body.anio,
        body.edicion,
        body.numero,
        body.rfidId,
        body.editorialId,
        body.codigoId,
        body.ubicacionId,
        body.imagen_recurso
      ]
    );
  }

  // 📌 Crear mobiliario
  async crearMobiliario(body: any) {
    return await this.dataSource.query(
      `CALL CrearMobiliario(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.codigoInventarioId,
        body.descripcion,
        body.tresp,
        body.rfidId,
        body.valor,
        body.tipoMobiliarioId,
        body.ubicacionId,
        body.imagen_recurso
      ]
    );
  }

  // 📌 Crear equipo
  async crearEquipo(body: any) {
    return await this.dataSource.query(
      `CALL CrearEquipo(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.codigoInventarioId,
        body.descripcion,
        body.tresp,
        body.rfidId,
        body.valor,
        body.categoria_equipoId,
        body.tipoEquipoId,
        body.ubicacionId,
        body.imagen_recurso
      ]
    );
  }

  // 📌 Actualizar libro
  async actualizarLibro(recursoId: number, body: any) {
    try {
      console.log(`🔹 Actualizando libro con recursoId: ${recursoId}`, body);

      const result = await this.dataSource.query(
        `CALL ActualizarLibro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recursoId, // 📌 Se envía `recursoId` directamente al procedimiento
          this.optionalValue(body.titulo),
          this.optionalValue(body.autor),
          this.optionalValue(body.isbn),
          this.optionalValue(body.anio),
          this.optionalValue(body.edicion),
          this.optionalValue(body.numero),
          this.optionalValue(body.editorialId),
          this.optionalValue(body.codigoId),
          this.optionalValue(body.ubicacionId),
          this.optionalValue(body.imagen_recurso),
        ]
      );

      const filasAfectadas = result[2]?.affectedRows || 0;
      console.log(`✅ Filas afectadas (Libro): ${filasAfectadas}`);

      return {
        mensaje: filasAfectadas > 0 ? 'Libro actualizado correctamente' : 'No se realizaron cambios',
        filasAfectadas,
        resultado: result
      };
    } catch (error) {
      console.error('❌ Error en actualizarLibro:', error);
      throw new Error(`Error SQL al actualizar el libro: ${error.message}`);
    }
  }

  // 📌 Actualizar mobiliario
  async actualizarMobiliario(recursoId: number, body: any) {
    try {
      console.log(`🔹 Actualizando mobiliario con recursoId: ${recursoId}`, body);

      const result = await this.dataSource.query(
        `CALL ActualizarMobiliario(?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recursoId, // 📌 Se envía `recursoId` directamente al procedimiento
          this.optionalValue(body.codigoInventarioId),
          this.optionalValue(body.descripcion),
          this.optionalValue(body.tresp),
          this.optionalValue(body.valor),
          this.optionalValue(body.tipoMobiliarioId),
          this.optionalValue(body.ubicacionId),
          this.optionalValue(body.imagen_recurso),
        ]
      );

      const filasAfectadas = result[2]?.affectedRows || 0;
      console.log(`✅ Filas afectadas (Mobiliario): ${filasAfectadas}`);

      return {
        mensaje: filasAfectadas > 0 ? 'Mobiliario actualizado correctamente' : 'No se realizaron cambios',
        filasAfectadas,
        resultado: result
      };
    } catch (error) {
      console.error('❌ Error en actualizarMobiliario:', error);
      throw new Error(`Error SQL al actualizar el mobiliario: ${error.message}`);
    }
  }

  // 📌 Actualizar equipo
  async actualizarEquipo(recursoId: number, body: any) {
    try {
      console.log(`🔹 Actualizando equipo con recursoId: ${recursoId}`, body);

      const result = await this.dataSource.query(
        `CALL ActualizarEquipo(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recursoId, // 📌 Se envía `recursoId` directamente al procedimiento
          this.optionalValue(body.codigoInventarioId),
          this.optionalValue(body.descripcion),
          this.optionalValue(body.tresp),
          this.optionalValue(body.valor),
          this.optionalValue(body.categoria_equipoId),
          this.optionalValue(body.tipoEquipoId),
          this.optionalValue(body.ubicacionId),
          this.optionalValue(body.imagen_recurso),
        ]
      );

      const filasAfectadas = result[2]?.affectedRows || 0;
      console.log(`✅ Filas afectadas (Equipo): ${filasAfectadas}`);

      return {
        mensaje: filasAfectadas > 0 ? 'Equipo actualizado correctamente' : 'No se realizaron cambios',
        filasAfectadas,
        resultado: result
      };
    } catch (error) {
      console.error('❌ Error en actualizarEquipo:', error);
      throw new Error(`Error SQL al actualizar el equipo: ${error.message}`);
    }
  }

  // 📌 Asignar RFID a un libro
  async asignarRFIDLibro(libroId: number, rfidId: number) {
    return await this.dataSource.query(`CALL AsignarRFIDLibro(?, ?)`, [libroId, rfidId]);
  }

  // 📌 Desasignar RFID de un libro
  async desasignarRFIDLibro(libroId: number) {
    return await this.dataSource.query(`CALL DesasignarRFIDLibro(?)`, [libroId]);
  }

  // 📌 Asignar RFID a un mobiliario
  async asignarRFIDMobiliario(mobiliarioId: number, rfidId: number) {
    return await this.dataSource.query(`CALL AsignarRFIDMobiliario(?, ?)`, [mobiliarioId, rfidId]);
  }

  // 📌 Desasignar RFID de un mobiliario
  async desasignarRFIDMobiliario(mobiliarioId: number) {
    return await this.dataSource.query(`CALL DesasignarRFIDMobiliario(?)`, [mobiliarioId]);
  }

  // 📌 Asignar RFID a un equipo
  async asignarRFIDEquipo(equipoId: number, rfidId: number) {
    return await this.dataSource.query(`CALL AsignarRFIDEquipo(?, ?)`, [equipoId, rfidId]);
  }

  // 📌 Desasignar RFID de un equipo
  async desasignarRFIDEquipo(equipoId: number) {
    return await this.dataSource.query(`CALL DesasignarRFIDEquipo(?)`, [equipoId]);
  }

// 📌 Realizar préstamo con usuario prestario y prestamista
async realizarPrestamo(body: any) {
  try {
    console.log(`📌 Procesando préstamo con datos recibidos:`, body);

    if (!body.recursoId || !body.usuarioPrestarioId || !body.usuarioPrestamistaId || !body.observacion) {
      console.error("❌ ERROR: Datos incompletos en realizarPrestamo:", body);
      throw new Error("Faltan datos en la solicitud de préstamo.");
    }

    const result = await this.dataSource.query(
      `CALL RealizarPrestamo(?, ?, ?, ?, ?)`,
      [
        body.recursoId,
        body.usuarioPrestarioId,
        body.usuarioPrestamistaId,
        body.observacion,
        body.imagen_prestamo || null
      ]
    );

    console.log(`✅ Préstamo registrado exitosamente:`, result);
    return {
      mensaje: 'Préstamo registrado exitosamente',
      resultado: result
    };
  } catch (error) {
    console.error('❌ Error en realizarPrestamo:', error);
    throw new Error(`Error al registrar préstamo: ${error.message}`);
  }
}

  // 📌 Realizar devolución
  async realizarDevolucion(body: any) {
    try {
      console.log(`📌 Procesando devolución para préstamo ID: ${body.prestamoId}`);

      const result = await this.dataSource.query(
        `CALL RealizarDevolucion(?, ?)`,
        [
          body.prestamoId,
          body.imagen_devolucion || null // Imagen opcional
        ]
      );

      console.log(`✅ Devolución registrada:`, result);
      return {
        mensaje: 'Devolución registrada exitosamente',
        resultado: result
      };
    } catch (error) {
      console.error('❌ Error en realizarDevolucion:', error);
      throw new Error(`Error al registrar devolución: ${error.message}`);
    }
  }
}