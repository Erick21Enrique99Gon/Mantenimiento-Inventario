import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  async create(@Body() createRolDto: CreateRolDto) {
    return await this.rolService.create(createRolDto);
  }

  @Get()
  async findAll() {
    return await this.rolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto) {
    return await this.rolService.update(+id, updateRolDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolService.remove(+id);
  }
}