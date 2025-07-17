import { 
  Controller, Post, Patch, Delete, Body, Param, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProcedimientosService } from './procedimientos.service';

@Controller('procedimientos')
export class ProcedimientosController {
constructor(private readonly procedimientosService: ProcedimientosService) {}

private static storageConfig = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', 'uploads', 'recurso'), // 📌 Carpeta donde se almacenarán las imágenes
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

private static storageConfig2 = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', 'uploads', 'historial'), // 📌 Carpeta donde se almacenarán las imágenes
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

// 📌 Crear libro
@Post('crear-libro')
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig))
async crearLibro(@Body() body, @UploadedFile() file?: Express.Multer.File) {
  if (file) {
    body.imagen_recurso = `uploads/recurso/${file.filename}`;
  }
  return await this.procedimientosService.crearLibro(body);
}

// 📌 Crear mobiliario
@Post('crear-mobiliario')
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig))
async crearMobiliario(@Body() body, @UploadedFile() file?: Express.Multer.File) {
  if (file) {
    body.imagen_recurso = `uploads/recurso/${file.filename}`;
  }
  return await this.procedimientosService.crearMobiliario(body);
}

// 📌 Crear equipo
@Post('crear-equipo')
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig))
async crearEquipo(@Body() body, @UploadedFile() file?: Express.Multer.File) {
  if (file) {
    body.imagen_recurso = `uploads/recurso/${file.filename}`;
  }
  return await this.procedimientosService.crearEquipo(body);
}

// 📌 Actualizar libro
@Patch('actualizar-libro/:recursoId') // 📌 Cambiado de `:id` a `:recursoId`
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig))
async actualizarLibro(
  @Param('recursoId') recursoId: string,
  @Body() body,
  @UploadedFile() file?: Express.Multer.File
) {
  try {
    console.log(`📌 Recibido request para actualizar libro con recursoId: ${recursoId}`, body);

    if (file) {
      body.imagen_recurso = `uploads/recurso/${file.filename}`;
    } else if (body.imagen_recurso === "") {
      body.imagen_recurso = null;
    }

    const result = await this.procedimientosService.actualizarLibro(+recursoId, body);
    console.log(`✅ Respuesta de actualizarLibro:`, result);

    return {
      mensaje: result.filasAfectadas > 0 ? 'Libro actualizado correctamente' : 'No se realizaron cambios',
      resultado: result
    };
  } catch (error) {
    console.error('❌ Error en actualizarLibro:', error);
    return { error: `Error al actualizar el libro: ${error.message}` };
  }
}

// 📌 Actualizar mobiliario
@Patch('actualizar-mobiliario/:recursoId')
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig))
async actualizarMobiliario(
  @Param('recursoId') recursoId: string,
  @Body() body,
  @UploadedFile() file?: Express.Multer.File
) {
  try {
    console.log(`📌 Recibido request para actualizar mobiliario con recursoId: ${recursoId}`, body);

    if (file) {
      body.imagen_recurso = `uploads/recurso/${file.filename}`;
    } else if (body.imagen_recurso === "") {
      body.imagen_recurso = null;
    }

    const result = await this.procedimientosService.actualizarMobiliario(+recursoId, body);
    console.log(`✅ Respuesta de actualizarMobiliario:`, result);

    return {
      mensaje: result.filasAfectadas > 0 ? 'Mobiliario actualizado correctamente' : 'No se realizaron cambios',
      resultado: result
    };
  } catch (error) {
    console.error('❌ Error en actualizarMobiliario:', error);
    return { error: `Error al actualizar el mobiliario: ${error.message}` };
  }
}

// 📌 Actualizar equipo
@Patch('actualizar-equipo/:recursoId')
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig))
async actualizarEquipo(
  @Param('recursoId') recursoId: string,
  @Body() body,
  @UploadedFile() file?: Express.Multer.File
) {
  try {
    console.log(`📌 Recibido request para actualizar equipo con recursoId: ${recursoId}`, body);

    if (file) {
      body.imagen_recurso = `uploads/recurso/${file.filename}`;
    } else if (body.imagen_recurso === "") {
      body.imagen_recurso = null;
    }

    const result = await this.procedimientosService.actualizarEquipo(+recursoId, body);
    console.log(`✅ Respuesta de actualizarEquipo:`, result);

    return {
      mensaje: result.filasAfectadas > 0 ? 'Equipo actualizado correctamente' : 'No se realizaron cambios',
      resultado: result
    };
  } catch (error) {
    console.error('❌ Error en actualizarEquipo:', error);
    return { error: `Error al actualizar el equipo: ${error.message}` };
  }
}

// 📌 Asignar RFID a un libro
@Post('asignar-rfid-libro')
async asignarRFIDLibro(@Body() body) {
  return await this.procedimientosService.asignarRFIDLibro(body.libroId, body.rfidId);
}

// 📌 Desasignar RFID de un libro
@Patch('desasignar-rfid-libro/:id')
async desasignarRFIDLibro(@Param('id') id: string) {
  return await this.procedimientosService.desasignarRFIDLibro(+id);
}

// 📌 Asignar RFID a un mobiliario
@Post('asignar-rfid-mobiliario')
async asignarRFIDMobiliario(@Body() body) {
  return await this.procedimientosService.asignarRFIDMobiliario(body.mobiliarioId, body.rfidId);
}

// 📌 Desasignar RFID de un mobiliario
@Patch('desasignar-rfid-mobiliario/:id')
async desasignarRFIDMobiliario(@Param('id') id: string) {
  return await this.procedimientosService.desasignarRFIDMobiliario(+id);
}

// 📌 Asignar RFID a un equipo
@Post('asignar-rfid-equipo')
async asignarRFIDEquipo(@Body() body) {
  return await this.procedimientosService.asignarRFIDEquipo(body.equipoId, body.rfidId);
}

// 📌 Desasignar RFID de un equipo
@Patch('desasignar-rfid-equipo/:id')
async desasignarRFIDEquipo(@Param('id') id: string) {
  return await this.procedimientosService.desasignarRFIDEquipo(+id);
}

// 📌 Realizar préstamo

@Post("/realizar-prestamo")
@UseInterceptors(FileInterceptor("imagen_prestamo", ProcedimientosController.storageConfig2))
async realizarPrestamo(
  @Body() body: any,
  @UploadedFile() file: Express.Multer.File
) {
  console.log("📌 Recibido request para realizar préstamo:", body);

  if (!body.recursoId || !body.usuarioPrestarioId || !body.usuarioPrestamistaId || !body.observacion) {
    console.error("❌ ERROR: Datos incompletos en realizarPrestamo:", body);
    throw new Error("Faltan datos en la solicitud de préstamo.");
  }

  return this.procedimientosService.realizarPrestamo({
    recursoId: parseInt(body.recursoId),
    usuarioPrestarioId: parseInt(body.usuarioPrestarioId),
    usuarioPrestamistaId: parseInt(body.usuarioPrestamistaId),
    observacion: body.observacion,
    imagen_prestamo: file ? `uploads/historial/${file.filename}` : null,
  });
}

// 📌 Realizar devolución
@Post('realizar-devolucion')
@UseInterceptors(FileInterceptor('file', ProcedimientosController.storageConfig2))
async realizarDevolucion(
  @Body() body,
  @UploadedFile() file?: Express.Multer.File
) {
  try {
    console.log(`📌 Recibido request para realizar devolución`, body);

    if (file) {
      body.imagen_devolucion = `uploads/historial/${file.filename}`;
    }

    const result = await this.procedimientosService.realizarDevolucion(body);
    console.log(`✅ Respuesta de realizarDevolucion:`, result);

    return {
      mensaje: result.mensaje,
      resultado: result.resultado
    };
  } catch (error) {
    console.error('❌ Error en realizarDevolucion:', error);
    return { error: `Error al registrar la devolución: ${error.message}` };
  }
}

}