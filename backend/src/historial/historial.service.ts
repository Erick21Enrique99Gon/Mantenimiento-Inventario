import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { Historial } from './entities/historial.entity';
import { DeepPartial } from 'typeorm';
import { Prestamo } from '../prestamo/entities/prestamo.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
  ) {}

  async create(createHistorialDto: CreateHistorialDto): Promise<Historial> {
    const historial = this.historialRepository.create({
      prestamo: { prestamoId: createHistorialDto.prestamoId } as DeepPartial<any>,
      usuario_prestario: createHistorialDto.usuario_prestario
        ? { usuarioId: createHistorialDto.usuario_prestario } as DeepPartial<any>
        : undefined,
      usuario_prestamista: createHistorialDto.usuario_prestamista
        ? { usuarioId: createHistorialDto.usuario_prestamista } as DeepPartial<any>
        : undefined,
      fecha_prestamo: new Date(createHistorialDto.fecha_prestamo),
      imagen_prestamo: createHistorialDto.imagen_prestamo,
      fecha_devolucion: createHistorialDto.fecha_devolucion
        ? new Date(createHistorialDto.fecha_devolucion)
        : undefined,
      imagen_devolucion: createHistorialDto.imagen_devolucion,
    });
  
    return await this.historialRepository.save(historial);
  }

  async findAll(): Promise<Historial[]> {
    return await this.historialRepository.find({
      relations: ['prestamo', 'usuario_prestario', 'usuario_prestamista'],
    });
  }

  async findOne(id: number): Promise<Historial> {
    try {
      return await this.historialRepository.findOneOrFail({
        where: { historialPrestamoId: id },
        relations: ['prestamo', 'usuario_prestario', 'usuario_prestamista'],
      });
    } catch (error) {
      throw new NotFoundException(`Historial con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateHistorialDto: UpdateHistorialDto): Promise<Historial> {
    const dataToUpdate: DeepPartial<Historial> = {};
  
    if (updateHistorialDto.prestamoId !== undefined)
      dataToUpdate.prestamo = { prestamoId: updateHistorialDto.prestamoId } as DeepPartial<Prestamo>;
  
    if (updateHistorialDto.usuario_prestario !== undefined)
      dataToUpdate.usuario_prestario = { usuarioId: updateHistorialDto.usuario_prestario } as DeepPartial<Usuario>;
  
    if (updateHistorialDto.usuario_prestamista !== undefined)
      dataToUpdate.usuario_prestamista = { usuarioId: updateHistorialDto.usuario_prestamista } as DeepPartial<Usuario>;
  
    if (updateHistorialDto.fecha_prestamo !== undefined)
      dataToUpdate.fecha_prestamo = new Date(updateHistorialDto.fecha_prestamo);
  
    if (updateHistorialDto.imagen_prestamo !== undefined)
      dataToUpdate.imagen_prestamo = updateHistorialDto.imagen_prestamo;
  
    if (updateHistorialDto.fecha_devolucion !== undefined)
      dataToUpdate.fecha_devolucion = updateHistorialDto.fecha_devolucion
        ? new Date(updateHistorialDto.fecha_devolucion)
        : null;
  
    if (updateHistorialDto.imagen_devolucion !== undefined)
      dataToUpdate.imagen_devolucion = updateHistorialDto.imagen_devolucion;
  
    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error('No se proporcionaron valores válidos para actualizar');
    }
  
    await this.historialRepository.update(id, dataToUpdate);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.historialRepository.delete(id);
  }
}