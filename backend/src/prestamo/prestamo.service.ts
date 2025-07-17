import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { Prestamo } from './entities/prestamo.entity';

@Injectable()
export class PrestamoService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
  ) {}

  async create(createPrestamoDto: CreatePrestamoDto): Promise<Prestamo> {
    const prestamo = this.prestamoRepository.create(createPrestamoDto);
    return await this.prestamoRepository.save(prestamo);
  }

  async findAll(): Promise<Prestamo[]> {
    return await this.prestamoRepository.find({
      relations: ['estado'],
    });
  }

  async findOne(id: number): Promise<Prestamo> {
    try {
      return await this.prestamoRepository.findOneOrFail({
        where: { prestamoId: id },
        relations: ['estado'],
      });
    } catch (error) {
      throw new NotFoundException(`Préstamo con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updatePrestamoDto: UpdatePrestamoDto): Promise<Prestamo> {
    await this.prestamoRepository.update(id, updatePrestamoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.prestamoRepository.delete(id);
  }
}
