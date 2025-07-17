import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CodigoInventarioService } from './codigo_inventario.service';
import { CreateCodigoInventarioDto } from './dto/create-codigo_inventario.dto';
import { UpdateCodigoInventarioDto } from './dto/update-codigo_inventario.dto';

@Controller('codigo-inventario')
export class CodigoInventarioController {
  constructor(private readonly codigoInventarioService: CodigoInventarioService) {}

  @Post()
  async create(@Body() createCodigoInventarioDto: CreateCodigoInventarioDto) {
    return await this.codigoInventarioService.create(createCodigoInventarioDto);
  }

  @Get()
  async findAll() {
    return await this.codigoInventarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.codigoInventarioService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCodigoInventarioDto: UpdateCodigoInventarioDto) {
    return await this.codigoInventarioService.update(+id, updateCodigoInventarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.codigoInventarioService.remove(+id);
  }
}