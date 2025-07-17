import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoEquipoService } from './tipo_equipo.service';
import { CreateTipoEquipoDto } from './dto/create-tipo_equipo.dto';
import { UpdateTipoEquipoDto } from './dto/update-tipo_equipo.dto';

@Controller('tipo-equipo')
export class TipoEquipoController {
  constructor(private readonly tipoEquipoService: TipoEquipoService) {}

  @Post()
  async create(@Body() createTipoEquipoDto: CreateTipoEquipoDto) {
    return await this.tipoEquipoService.create(createTipoEquipoDto);
  }

  @Get()
  async findAll() {
    return await this.tipoEquipoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tipoEquipoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoEquipoDto: UpdateTipoEquipoDto) {
    return await this.tipoEquipoService.update(+id, updateTipoEquipoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tipoEquipoService.remove(+id);
  }
}
