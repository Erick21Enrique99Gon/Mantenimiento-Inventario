import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { RecursoService } from './recurso.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';

@Controller('recurso')
export class RecursoController {
  constructor(private readonly recursoService: RecursoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'recurso'), // Carpeta donde se guardan las imágenes
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createRecursoDto: CreateRecursoDto,
    @UploadedFile() file?: Express.Multer.File, // Ahora la imagen es opcional
  ) {
    // Si se carga un archivo, se guarda su ruta en el DTO
    if (file) {
      createRecursoDto.imagen_recurso = `uploads/recurso/${file.filename}`;
    }
    return await this.recursoService.create(createRecursoDto);
  }

  @Get()
  async findAll() {
    return await this.recursoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.recursoService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads', 'recurso'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateRecursoDto: UpdateRecursoDto,
    @UploadedFile() file?: Express.Multer.File, // Imagen opcional
  ) {
    // Si se carga un archivo, actualiza la ruta de la imagen en el DTO
    if (file) {
      updateRecursoDto.imagen_recurso = `uploads/recurso/${file.filename}`;
    }

    return await this.recursoService.update(+id, updateRecursoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.recursoService.remove(+id);
  }
}