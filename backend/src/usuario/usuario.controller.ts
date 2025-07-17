import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  async findAll() {
    return await this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usuarioService.remove(+id);
  }
}
