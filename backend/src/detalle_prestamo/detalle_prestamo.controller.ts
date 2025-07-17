import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallePrestamoService } from './detalle_prestamo.service';
import { CreateDetallePrestamoDto } from './dto/create-detalle_prestamo.dto';
import { UpdateDetallePrestamoDto } from './dto/update-detalle_prestamo.dto';

@Controller('detalle-prestamo')
export class DetallePrestamoController {
  constructor(private readonly detallePrestamoService: DetallePrestamoService) {}

  @Post()
  async create(@Body() createDetallePrestamoDto: CreateDetallePrestamoDto) {
    return await this.detallePrestamoService.create(createDetallePrestamoDto);
  }

  @Get()
  async findAll() {
    return await this.detallePrestamoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.detallePrestamoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDetallePrestamoDto: UpdateDetallePrestamoDto) {
    return await this.detallePrestamoService.update(+id, updateDetallePrestamoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.detallePrestamoService.remove(+id);
  }
}