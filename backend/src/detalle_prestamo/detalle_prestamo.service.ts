import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePrestamo } from './entities/detalle_prestamo.entity';
import { CreateDetallePrestamoDto } from './dto/create-detalle_prestamo.dto';
import { UpdateDetallePrestamoDto } from './dto/update-detalle_prestamo.dto';
import { Prestamo } from '../prestamo/entities/prestamo.entity';
import { Recurso } from '../recurso/entities/recurso.entity';

@Injectable()
export class DetallePrestamoService {
  constructor(
    @InjectRepository(DetallePrestamo)
    private readonly detallePrestamoRepository: Repository<DetallePrestamo>,

    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,

    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,
  ) {}

  async create(createDetallePrestamoDto: CreateDetallePrestamoDto): Promise<DetallePrestamo> {
    const { prestamoId, recursoId } = createDetallePrestamoDto;

    const prestamo = await this.prestamoRepository.findOne({ where: { prestamoId } });
    if (!prestamo) {
      throw new NotFoundException(`Préstamo con ID ${prestamoId} no encontrado`);
    }

    const recurso = await this.recursoRepository.findOne({ where: { recursoId } });
    if (!recurso) {
      throw new NotFoundException(`Recurso con ID ${recursoId} no encontrado`);
    }

    const detallePrestamo = this.detallePrestamoRepository.create({
      prestamo,
      recurso,
    });

    return await this.detallePrestamoRepository.save(detallePrestamo);
  }

  async findAll(): Promise<DetallePrestamo[]> {
    return await this.detallePrestamoRepository.find({ relations: ['prestamo', 'recurso'] });
  }

  async findOne(id: number): Promise<DetallePrestamo> {
    try {
      return await this.detallePrestamoRepository.findOneOrFail({
        where: { detalleId: id },
        relations: ['prestamo', 'recurso'],
      });
    } catch (error) {
      throw new NotFoundException(`Detalle de préstamo con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateDetallePrestamoDto: UpdateDetallePrestamoDto): Promise<DetallePrestamo> {
    const { prestamoId, recursoId } = updateDetallePrestamoDto;
  
    const detallePrestamo = await this.detallePrestamoRepository.findOne({ where: { detalleId: id } });
    if (!detallePrestamo) {
      throw new NotFoundException(`Detalle de préstamo con ID ${id} no encontrado`);
    }
  
    if (prestamoId) {
      const prestamo = await this.prestamoRepository.findOne({ where: { prestamoId } });
      if (!prestamo) {
        throw new NotFoundException(`Préstamo con ID ${prestamoId} no encontrado`);
      }
      detallePrestamo.prestamo = prestamo;
    }
  
    if (recursoId) {
      const recurso = await this.recursoRepository.findOne({ where: { recursoId } });
      if (!recurso) {
        throw new NotFoundException(`Recurso con ID ${recursoId} no encontrado`);
      }
      detallePrestamo.recurso = recurso;
    }
  
    return await this.detallePrestamoRepository.save(detallePrestamo);
  }

  async remove(id: number): Promise<void> {
    await this.detallePrestamoRepository.delete(id);
  }
}