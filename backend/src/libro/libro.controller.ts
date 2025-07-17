import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibroService } from './libro.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Controller('libro')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Post()
  async create(@Body() createLibroDto: CreateLibroDto) {
    return await this.libroService.create(createLibroDto);
  }

  @Get()
  async findAll() {
    return await this.libroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.libroService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLibroDto: UpdateLibroDto) {
    return await this.libroService.update(+id, updateLibroDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.libroService.remove(+id);
  }
}