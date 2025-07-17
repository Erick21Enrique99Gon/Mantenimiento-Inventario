import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MobiliarioService } from './mobiliario.service';
import { CreateMobiliarioDto } from './dto/create-mobiliario.dto';
import { UpdateMobiliarioDto } from './dto/update-mobiliario.dto';

@Controller('mobiliario')
export class MobiliarioController {
  constructor(private readonly mobiliarioService: MobiliarioService) {}

  @Post()
  async create(@Body() createMobiliarioDto: CreateMobiliarioDto) {
    return await this.mobiliarioService.create(createMobiliarioDto);
  }

  @Get()
  async findAll() {
    return await this.mobiliarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.mobiliarioService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMobiliarioDto: UpdateMobiliarioDto) {
    return await this.mobiliarioService.update(+id, updateMobiliarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.mobiliarioService.remove(+id);
  }
}