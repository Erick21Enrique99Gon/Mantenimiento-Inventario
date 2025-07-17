import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RfidRegistroService } from './rfid_registro.service';
import { CreateRfidRegistroDto } from './dto/create-rfid_registro.dto';
import { UpdateRfidRegistroDto } from './dto/update-rfid_registro.dto';

@Controller('rfid-registro')
export class RfidRegistroController {
  constructor(private readonly rfidRegistroService: RfidRegistroService) {}

  @Post()
  async create(@Body() createRfidRegistroDto: CreateRfidRegistroDto) {
    return await this.rfidRegistroService.create(createRfidRegistroDto);
  }

  @Get()
  async findAll() {
    return await this.rfidRegistroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rfidRegistroService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRfidRegistroDto: UpdateRfidRegistroDto) {
    return await this.rfidRegistroService.update(+id, updateRfidRegistroDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rfidRegistroService.remove(+id);
  }
}