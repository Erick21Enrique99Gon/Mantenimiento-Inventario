import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaEquipoService } from './categoria_equipo.service';
import { CreateCategoriaEquipoDto } from './dto/create-categoria_equipo.dto';
import { UpdateCategoriaEquipoDto } from './dto/update-categoria_equipo.dto';

@Controller('categoria-equipo')
export class CategoriaEquipoController {
  constructor(private readonly categoriaEquipoService: CategoriaEquipoService) {}

  @Post()
  async create(@Body() createCategoriaEquipoDto: CreateCategoriaEquipoDto) {
    return await this.categoriaEquipoService.create(createCategoriaEquipoDto);
  }

  @Get()
  async findAll() {
    return await this.categoriaEquipoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriaEquipoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoriaEquipoDto: UpdateCategoriaEquipoDto) {
    return await this.categoriaEquipoService.update(+id, updateCategoriaEquipoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriaEquipoService.remove(+id);
  }
}