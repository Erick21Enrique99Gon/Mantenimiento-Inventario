import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CodigoLibroService } from './codigo_libro.service';
import { CreateCodigoLibroDto } from './dto/create-codigo_libro.dto';
import { UpdateCodigoLibroDto } from './dto/update-codigo_libro.dto';

@Controller('codigo-libro')
export class CodigoLibroController {
  constructor(private readonly codigoLibroService: CodigoLibroService) {}

  @Post()
  async create(@Body() createCodigoLibroDto: CreateCodigoLibroDto) {
    return await this.codigoLibroService.create(createCodigoLibroDto);
  }

  @Get()
  async findAll() {
    return await this.codigoLibroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.codigoLibroService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCodigoLibroDto: UpdateCodigoLibroDto) {
    return await this.codigoLibroService.update(+id, updateCodigoLibroDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.codigoLibroService.remove(+id);
  }
}
