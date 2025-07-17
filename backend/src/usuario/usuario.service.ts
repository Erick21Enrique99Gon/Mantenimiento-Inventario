import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../rol/entities/rol.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { rolId, password, ...usuarioData } = createUsuarioDto;
  
    // Verificar si el rol existe
    const rol = await this.rolRepository.findOne({ where: { rolId } });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
    }
  
    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const usuario = this.usuarioRepository.create({
      ...usuarioData,
      password: hashedPassword,
      rol,
    });
  
    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOneOrFail({
        where: { usuarioId: id },
        relations: ['rol'],
      });
    } catch (error) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const { rolId, password, ...usuarioData } = updateUsuarioDto;
  
    // Buscar el usuario existente
    const usuario = await this.findOne(id);
  
    if (rolId) {
      const rol = await this.rolRepository.findOne({ where: { rolId } });
      if (!rol) {
        throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
      }
      usuario.rol = rol;
    }
  
    // Si el usuario envía una nueva contraseña, la encriptamos
    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }
  
    Object.assign(usuario, usuarioData);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}