import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { Ubicacion } from './entities/ubicacion.entity';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
  ) {}

  async create(createUbicacionDto: CreateUbicacionDto): Promise<Ubicacion> {
    const ubicacion = this.ubicacionRepository.create(createUbicacionDto);
    return await this.ubicacionRepository.save(ubicacion);
  }

  async findAll(): Promise<Ubicacion[]> {
    return await this.ubicacionRepository.find();
  }

  async findOne(id: number): Promise<Ubicacion> {
    return await this.ubicacionRepository.findOneOrFail({ where: { ubicacionId: id } });
  }

  async update(id: number, updateUbicacionDto: UpdateUbicacionDto): Promise<Ubicacion> {
    await this.ubicacionRepository.update(id, updateUbicacionDto);
    return await this.ubicacionRepository.findOneOrFail({ where: { ubicacionId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.ubicacionRepository.delete(id);
  }
}
