import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCodigoInventarioDto } from './dto/create-codigo_inventario.dto';
import { UpdateCodigoInventarioDto } from './dto/update-codigo_inventario.dto';
import { CodigoInventario } from './entities/codigo_inventario.entity';

@Injectable()
export class CodigoInventarioService {
  constructor(
    @InjectRepository(CodigoInventario)
    private readonly codigoInventarioRepository: Repository<CodigoInventario>,
  ) {}

  async create(createCodigoInventarioDto: CreateCodigoInventarioDto): Promise<CodigoInventario> {
    const codigoInventario = this.codigoInventarioRepository.create(createCodigoInventarioDto);
    return await this.codigoInventarioRepository.save(codigoInventario);
  }

  async findAll(): Promise<CodigoInventario[]> {
    return await this.codigoInventarioRepository.find();
  }

  async findOne(id: number): Promise<CodigoInventario> {
    try {
      return await this.codigoInventarioRepository.findOneOrFail({ where: { codigoInventarioId: id } });
    } catch (error) {
      throw new NotFoundException(`Código de inventario con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateCodigoInventarioDto: UpdateCodigoInventarioDto): Promise<CodigoInventario> {
    const codigoInventario = await this.findOne(id);
    Object.assign(codigoInventario, updateCodigoInventarioDto);
    return await this.codigoInventarioRepository.save(codigoInventario);
  }

  async remove(id: number): Promise<void> {
    const codigoInventario = await this.findOne(id);
    await this.codigoInventarioRepository.remove(codigoInventario);
  }
}