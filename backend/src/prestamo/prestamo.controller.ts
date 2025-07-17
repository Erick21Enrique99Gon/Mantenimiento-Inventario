import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Controller('prestamo')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}

  @Post()
  async create(@Body() createPrestamoDto: CreatePrestamoDto) {
    return await this.prestamoService.create(createPrestamoDto);
  }

  @Get()
  async findAll() {
    return await this.prestamoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.prestamoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return await this.prestamoService.update(+id, updatePrestamoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.prestamoService.remove(+id);
  }
}
