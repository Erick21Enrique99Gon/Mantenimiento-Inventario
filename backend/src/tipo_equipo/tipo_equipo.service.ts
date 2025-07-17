import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoEquipoDto } from './dto/create-tipo_equipo.dto';
import { UpdateTipoEquipoDto } from './dto/update-tipo_equipo.dto';
import { TipoEquipo } from './entities/tipo_equipo.entity';

@Injectable()
export class TipoEquipoService {
  constructor(
    @InjectRepository(TipoEquipo)
    private readonly tipoEquipoRepository: Repository<TipoEquipo>,
  ) {}

  async create(createTipoEquipoDto: CreateTipoEquipoDto): Promise<TipoEquipo> {
    const tipoEquipo = this.tipoEquipoRepository.create(createTipoEquipoDto);
    return await this.tipoEquipoRepository.save(tipoEquipo);
  }

  async findAll(): Promise<TipoEquipo[]> {
    return await this.tipoEquipoRepository.find();
  }

  async findOne(id: number): Promise<TipoEquipo> {
    return await this.tipoEquipoRepository.findOneOrFail({ where: { tipoEquipoId: id } });
  }

  async update(id: number, updateTipoEquipoDto: UpdateTipoEquipoDto): Promise<TipoEquipo> {
    await this.tipoEquipoRepository.update(id, updateTipoEquipoDto);
    return await this.tipoEquipoRepository.findOneOrFail({ where: { tipoEquipoId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.tipoEquipoRepository.delete(id);
  }
}
