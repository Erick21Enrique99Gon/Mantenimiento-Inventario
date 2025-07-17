import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Controller('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  @Post()
  async create(@Body() createUbicacionDto: CreateUbicacionDto) {
    return await this.ubicacionService.create(createUbicacionDto);
  }

  @Get()
  async findAll() {
    return await this.ubicacionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ubicacionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUbicacionDto: UpdateUbicacionDto) {
    return await this.ubicacionService.update(+id, updateUbicacionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ubicacionService.remove(+id);
  }
}
