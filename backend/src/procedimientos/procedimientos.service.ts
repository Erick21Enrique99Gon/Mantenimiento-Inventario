import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity'
import { RfidRegistro } from 'src/rfid_registro/entities/rfid_registro.entity';

import { TipoMobiliario } from 'src/tipo_mobiliario/entities/tipo_mobiliario.entity';

import { TipoEquipo } from 'src/tipo_equipo/entities/tipo_equipo.entity';
import { CategoriaEquipo } from 'src/categoria_equipo/entities/categoria_equipo.entity';
import { Ubicacion } from 'src/ubicacion/entities/ubicacion.entity';
import { Equipo } from 'src/equipo/entities/equipo.entity';
import { Mobiliario } from 'src/mobiliario/entities/mobiliario.entity';
import { Editorial } from 'src/editorial/entities/editorial.entity';
import { Libro } from 'src/libro/entities/libro.entity';
import { CodigoLibro } from 'src/codigo_libro/entities/codigo_libro.entity';

import { Recurso } from 'src/recurso/entities/recurso.entity';

import { Estado } from 'src/estado/entities/estado.entity';

export class ProcedimientosService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CodigoInventario)
    private readonly CodigoInventario: Repository<CodigoInventario>,
    @InjectRepository(RfidRegistro)
    private readonly RfidRegistro: Repository<RfidRegistro>,
    @InjectRepository(Ubicacion)
    private readonly Ubicacion: Repository<Ubicacion>,
    @InjectRepository(TipoEquipo)
    private readonly TipoEquipo: Repository<TipoEquipo>,
    @InjectRepository(Equipo)
    private readonly Equipo: Repository<Equipo>,
    @InjectRepository(CategoriaEquipo)
    private readonly CategoriaEquipo: Repository<CategoriaEquipo>,
    @InjectRepository(TipoMobiliario)
    private readonly TipoMobiliario: Repository<TipoMobiliario>,
    @InjectRepository(Editorial)
    private readonly Editorial: Repository<Editorial>,
    @InjectRepository(Libro)
    private readonly Libro: Repository<Libro>,
    @InjectRepository(CodigoLibro)
    private readonly CodigoLibro: Repository<CodigoLibro>
  ) {}

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

  async obtenerUnicosCodigoInventarioRFID(){
    const codigosSolo = (await this.CodigoInventario.find()).map(item => item.codigo);
    return {codigosSolo}
  }

  async comprobarCodigoInventario(codigosSolo: any[], codigo: string){
    if (codigosSolo.includes(codigo)) {
          throw new Error(`El código de inventario "${codigo}" ya existe.`);
        }
  }

  async combrobarUndifined(value:string){
    if (value !== undefined && value !== null && value !== "") {
          throw new Error(`Faltan datos`);
        }
  }

async cargaMasicaEquipo(body: any[]) {
  const { codigosSolo } = await this.obtenerUnicosCodigoInventarioRFID();
  
  const errores = [];
  const exitosos = [];
  
  const camposRequeridos = [
    'codigo de inventario',
    'Tipo',
    'Categoria de Equipo',
    'Ubicacion',
    'Descripcion',
    'TResp',
    'Valor',
  ];
  
  for (let index = 0; index < body.length; index++) {
    const element = body[index];
    
    // Validar campos vacíos
    const camposVacios = camposRequeridos.filter(campo => {
      const val = element[campo];
      return val === undefined || val === null || val.toString().trim() === '';
    });
    
    if (camposVacios.length > 0) {
      errores.push({
        fila: index + 1,
        codigo: element['codigo de inventario'] || 'N/A',
        error: `Faltan datos en los campos: ${camposVacios.join(', ')}`,
        datos: element
      });
      continue;
    }
    
    if (codigosSolo.includes(element['codigo de inventario'])) {
      errores.push({
        fila: index + 1,
        codigo: element['codigo de inventario'],
        error: 'El código de inventario ya existe',
        datos: element
      });
      continue;
    }
    
    // 🔹 Transacción individual por registro
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const codigoInventarioNuevo = await queryRunner.manager.create(CodigoInventario, {
        codigo: element['codigo de inventario'],
      });
      await queryRunner.manager.save(codigoInventarioNuevo);
      
      // 🔹 Buscar TipoEquipo
      let TipoEquipoId = await queryRunner.manager.findOne(TipoEquipo, {
        where: { descripcion: element['Tipo'] }
      });
      if (!TipoEquipoId) {
        TipoEquipoId = await queryRunner.manager.create(TipoEquipo, {
          descripcion: element['Tipo'],
        });
        await queryRunner.manager.save(TipoEquipoId);
      }
      
      // 🔹 Buscar CategoriaEquipo
      let CategoriaEquipoId = await queryRunner.manager.findOne(CategoriaEquipo, {
        where: { descripcion: element['Categoria de Equipo'] }
      });
      if (!CategoriaEquipoId) {
        CategoriaEquipoId = await queryRunner.manager.create(CategoriaEquipo, {
          descripcion: element['Categoria de Equipo'],
        });
        await queryRunner.manager.save(CategoriaEquipoId);
      }
      
      const ubicacionId = await queryRunner.manager.findOne(Ubicacion, {
        where: { descripcion: element['Ubicacion'] }
      });
      
      if (!ubicacionId) {
        throw new Error(`Ubicación '${element['Ubicacion']}' no encontrada`);
      }
      
      // 🔹 CREAR EQUIPO SIN ESTADO
      const resultCreateEquipo = await queryRunner.manager.create(Equipo, {
        codigoInventario: codigoInventarioNuevo,
        descripcion: element['Descripcion'],
        tresp: Number(element['TResp']),
        valor: Number(element['Valor']),
        rfid: null,
        // ❌ Sin estado para Equipo
        categoria_equipo: CategoriaEquipoId,
        tipoEquipo: TipoEquipoId,
        ubicacion: ubicacionId,
      });
      await queryRunner.manager.save(resultCreateEquipo);
      
      // 🔹 OBTENER ESTADO 'Disponible' SOLO PARA RECURSO
      const estado = await queryRunner.manager.findOne(Estado, {
        where: { descripcion: 'Disponible' }
      });
      if (!estado) {
        throw new Error("Estado 'Disponible' no encontrado en la base de datos");
      }
      
      // 🔹 CREAR RECURSO CON ESTADO DISPONIBLE
      const recurso = await queryRunner.manager.create(Recurso, {
        libro: null,
        equipo: resultCreateEquipo,
        mobiliario: null,
        estado: estado, // ✅ Solo el Recurso tiene estado
        imagen_recurso: null,
      });
      await queryRunner.manager.save(recurso);
      
      await queryRunner.commitTransaction();
      exitosos.push(element);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      errores.push({
        fila: index + 1,
        codigo: element['codigo de inventario'],
        error: error.message || 'Error desconocido',
        datos: element
      });
    } finally {
      await queryRunner.release();
    }
  }
  
  return { exitosos, errores };
}


async cargaMasicaMobiliario(body: any[]) {
  const codigosSolo = (await this.CodigoInventario.find()).map(item => item.codigo);
  const errores = [];
  const exitosos = [];
  
  const camposRequeridos = [
    'codigo de inventario',
    'Tipo',
    'Ubicacion',
    'Descripcion',
    'TResp',
    'Valor',
  ];
  
  for (let index = 0; index < body.length; index++) {
    const element = body[index];
    
    const camposVacios = camposRequeridos.filter(campo => {
      const val = element[campo];
      return val === undefined || val === null || val.toString().trim() === '';
    });
    
    if (camposVacios.length > 0) {
      errores.push({
        fila: index + 1,
        codigo: element['codigo de inventario'] || 'N/A',
        error: `Faltan datos en los campos: ${camposVacios.join(', ')}`,
        data: element,
      });
      continue;
    }
    
    if (codigosSolo.includes(element['codigo de inventario'])) {
      errores.push({
        fila: index + 1,
        codigo: element['codigo de inventario'],
        error: 'El código de inventario ya existe',
        data: element,
      });
      continue;
    }
    
    // 🔹 Transacción individual por registro
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const codigoInventarioNuevo = await queryRunner.manager.create(CodigoInventario, {
        codigo: element['codigo de inventario'],
      });
      await queryRunner.manager.save(codigoInventarioNuevo);
      
      const ubicacionId = await queryRunner.manager.findOne(Ubicacion, {
        where: { descripcion: element['Ubicacion'] }
      });
      
      if (!ubicacionId) {
        throw new Error(`Ubicación '${element['Ubicacion']}' no encontrada`);
      }
      
      // 🔹 Buscar TipoMobiliario CON el queryRunner actual
      let tipoMobiliarioId = await queryRunner.manager.findOne(TipoMobiliario, {
        where: { descripcion: element['Tipo'] }
      });
      if (!tipoMobiliarioId) {
        tipoMobiliarioId = await queryRunner.manager.create(TipoMobiliario, {
          descripcion: element['Tipo'],
        });
        await queryRunner.manager.save(tipoMobiliarioId);
      }
      
      // 🔹 CREAR MOBILIARIO SIN ESTADO
      const resultCreateMobiliario = await queryRunner.manager.create(Mobiliario, {
        codigoInventario: codigoInventarioNuevo,
        descripcion: element['Descripcion'],
        tresp: Number(element['TResp']),
        valor: Number(element['Valor']),
        rfid: null,
        ubicacion: ubicacionId,
        tipoMobiliario: tipoMobiliarioId,
      });
      await queryRunner.manager.save(resultCreateMobiliario);
      
      // 🔹 OBTENER ESTADO 'Disponible' PARA RECURSO
      const estado = await queryRunner.manager.findOne(Estado, {
        where: { descripcion: 'Disponible' }
      });
      if (!estado) {
        throw new Error("Estado 'Disponible' no encontrado en la base de datos");
      }
      
      // 🔹 CREAR RECURSO ASOCIADO AL MOBILIARIO
      const recurso = await queryRunner.manager.create(Recurso, {
        libro: null,
        equipo: null,
        mobiliario: resultCreateMobiliario, // 🔹 Asociar mobiliario
        estado: estado,
        imagen_recurso: null,
      });
      await queryRunner.manager.save(recurso);
      
      await queryRunner.commitTransaction();
      exitosos.push(element);
    } catch (errInterno) {
      await queryRunner.rollbackTransaction();
      errores.push({
        fila: index + 1,
        codigo: element['codigo de inventario'],
        error: errInterno.message || 'Error desconocido',
        data: element,
      });
    } finally {
      await queryRunner.release();
    }
  }
  
  return { exitosos, errores };
}

async cargaMasicaLibro(body: any[]) {
  const errores = [];
  const exitosos = [];
  
  const camposRequeridos = [
    'TITULO',
    'AUTOR',
    'ISBN',
    'EDICION',
    'Anio',
    'Numero',
    'UBICACION',
    'EDITORIAL',
    'Codigo',
  ];
  
  for (let index = 0; index < body.length; index++) {
    const element = body[index];
    
    // Validar campos vacíos
    const camposVacios = camposRequeridos.filter(campo => {
      const val = element[campo];
      return val === undefined || val === null || val.toString().trim() === '';
    });
    
    if (camposVacios.length > 0) {
      errores.push({
        fila: index + 1,
        codigo: element['Codigo'] || 'N/A',
        error: `Faltan datos en los campos: ${camposVacios.join(', ')}`,
        elemento: element
      });
      continue;
    }
    
    // 🔹 Transacción individual por registro
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Buscar ubicación
      const ubicacionId = await queryRunner.manager.findOne(Ubicacion, {
        where: { descripcion: element['UBICACION'] }
      });
      
      if (!ubicacionId) {
        throw new Error(`Ubicación '${element['UBICACION']}' no encontrada`);
      }
      
      // 🔹 Buscar o crear Editorial CON el queryRunner actual
      let editorialId = await queryRunner.manager.findOne(Editorial, {
        where: { descripcion: element['EDITORIAL'] }
      });
      if (!editorialId) {
        editorialId = await queryRunner.manager.create(Editorial, {
          descripcion: element['EDITORIAL'],
        });
        await queryRunner.manager.save(editorialId);
      }
      
      // 🔹 Buscar o crear CodigoLibro CON el queryRunner actual
      let codigoId = await queryRunner.manager.findOne(CodigoLibro, {
        where: { descripcion: element['Codigo'] }
      });
      if (!codigoId) {
        codigoId = await queryRunner.manager.create(CodigoLibro, {
          descripcion: element['Codigo'],
        });
        await queryRunner.manager.save(codigoId);
      }
      
      // 🔹 CREAR LIBRO SIN ESTADO
      const nuevoLibro = await queryRunner.manager.create(Libro, {
        titulo: element['TITULO'],
        autor: element['AUTOR'],
        isbn: element['ISBN'],
        edicion: element['EDICION'],
        anio: element['Anio'],
        numero: element['Numero'],
        tresp: Number(element['TResp']),
        valor: Number(element['Valor']),
        rfid: null,
        ubicacion: ubicacionId,
        editorial: editorialId,
        codigoLibro: codigoId,
      });
      await queryRunner.manager.save(nuevoLibro);
      
      // 🔹 OBTENER ESTADO 'Disponible' PARA RECURSO
      const estado = await queryRunner.manager.findOne(Estado, {
        where: { descripcion: 'Disponible' }
      });
      if (!estado) {
        throw new Error("Estado 'Disponible' no encontrado en la base de datos");
      }
      
      // 🔹 CREAR RECURSO ASOCIADO AL LIBRO
      const recurso = await queryRunner.manager.create(Recurso, {
        libro: nuevoLibro, // 🔹 Asociar libro
        equipo: null,
        mobiliario: null,
        estado: estado,
        imagen_recurso: null,
      });
      await queryRunner.manager.save(recurso);
      
      await queryRunner.commitTransaction();
      exitosos.push(element);
    } catch (errInterno) {
      await queryRunner.rollbackTransaction();
      errores.push({
        fila: index + 1,
        codigo: element['Codigo'] || 'N/A',
        error: errInterno.message || 'Error desconocido',
        elemento: element
      });
    } finally {
      await queryRunner.release();
    }
  }
  
  return { exitosos, errores };
}

}