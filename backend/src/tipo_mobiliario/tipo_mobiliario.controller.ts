import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMobiliarioService } from './tipo_mobiliario.service';
import { CreateTipoMobiliarioDto } from './dto/create-tipo_mobiliario.dto';
import { UpdateTipoMobiliarioDto } from './dto/update-tipo_mobiliario.dto';

@Controller('tipo-mobiliario')
export class TipoMobiliarioController {
  constructor(private readonly tipoMobiliarioService: TipoMobiliarioService) {}

  @Post()
  async create(@Body() createTipoMobiliarioDto: CreateTipoMobiliarioDto) {
    return await this.tipoMobiliarioService.create(createTipoMobiliarioDto);
  }

  @Get()
  async findAll() {
    return await this.tipoMobiliarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tipoMobiliarioService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTipoMobiliarioDto: UpdateTipoMobiliarioDto) {
    return await this.tipoMobiliarioService.update(+id, updateTipoMobiliarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tipoMobiliarioService.remove(+id);
  }
}
