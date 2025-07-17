import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({ relations: ['usuarios'] });
  }

  async findOne(id: number): Promise<Rol> {
    try {
      return await this.rolRepository.findOneOrFail({
        where: { rolId: id },
        relations: ['usuarios'],
      });
    } catch (error) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    await this.rolRepository.update(id, updateRolDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rolRepository.delete(id);
  }
}