import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Controller('equipo')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  @Post()
  async create(@Body() createEquipoDto: CreateEquipoDto) {
    return await this.equipoService.create(createEquipoDto);
  }

  @Get()
  async findAll() {
    return await this.equipoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.equipoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEquipoDto: UpdateEquipoDto) {
    return await this.equipoService.update(+id, updateEquipoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.equipoService.remove(+id);
  }
}