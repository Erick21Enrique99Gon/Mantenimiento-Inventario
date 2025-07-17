import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaEquipoDto } from './dto/create-categoria_equipo.dto';
import { UpdateCategoriaEquipoDto } from './dto/update-categoria_equipo.dto';
import { CategoriaEquipo } from './entities/categoria_equipo.entity';

@Injectable()
export class CategoriaEquipoService {
  constructor(
    @InjectRepository(CategoriaEquipo)
    private readonly categoriaEquipoRepository: Repository<CategoriaEquipo>,
  ) {}

  async create(createCategoriaEquipoDto: CreateCategoriaEquipoDto): Promise<CategoriaEquipo> {
    const categoriaEquipo = this.categoriaEquipoRepository.create(createCategoriaEquipoDto);
    return await this.categoriaEquipoRepository.save(categoriaEquipo);
  }

  async findAll(): Promise<CategoriaEquipo[]> {
    return await this.categoriaEquipoRepository.find();
  }

  async findOne(id: number): Promise<CategoriaEquipo> {
    try {
      return await this.categoriaEquipoRepository.findOneOrFail({ where: { categoria_equipoId: id } });
    } catch (error) {
      throw new NotFoundException(`Categoría de equipo con ID ${id} no encontrada`);
    }
  }

  async update(id: number, updateCategoriaEquipoDto: UpdateCategoriaEquipoDto): Promise<CategoriaEquipo> {
    await this.categoriaEquipoRepository.update(id, updateCategoriaEquipoDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriaEquipoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría de equipo con ID ${id} no encontrada`);
    }
  }
}