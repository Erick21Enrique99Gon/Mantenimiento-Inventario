import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFiles 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imagen_prestamo', maxCount: 1 },
      { name: 'imagen_devolucion', maxCount: 1 }
    ], {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'historial'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createHistorialDto: CreateHistorialDto,
    @UploadedFiles() files: { imagen_prestamo?: Express.Multer.File[], imagen_devolucion?: Express.Multer.File[] },
  ) {
    if (files?.imagen_prestamo) {
      createHistorialDto.imagen_prestamo = `uploads/historial/${files.imagen_prestamo[0].filename}`;
    }
    if (files?.imagen_devolucion) {
      createHistorialDto.imagen_devolucion = `uploads/historial/${files.imagen_devolucion[0].filename}`;
    }

    return await this.historialService.create(createHistorialDto);
  }

  @Get()
  async findAll() {
    return await this.historialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.historialService.findOne(+id);
  }

  
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imagen_prestamo', maxCount: 1 },
      { name: 'imagen_devolucion', maxCount: 1 }
    ], {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'historial'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateHistorialDto: UpdateHistorialDto,
    @UploadedFiles() files: { imagen_prestamo?: Express.Multer.File[], imagen_devolucion?: Express.Multer.File[] },
  ) {
    if (files?.imagen_prestamo) {
      updateHistorialDto.imagen_prestamo = `uploads/historial/${files.imagen_prestamo[0].filename}`;
    }
    if (files?.imagen_devolucion) {
      updateHistorialDto.imagen_devolucion = `uploads/historial/${files.imagen_devolucion[0].filename}`;
    }

    return await this.historialService.update(+id, updateHistorialDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.historialService.remove(+id);
  }
}