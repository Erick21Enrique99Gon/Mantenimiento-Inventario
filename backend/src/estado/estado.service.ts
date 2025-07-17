import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Estado } from './entities/estado.entity';

@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createEstadoDto: CreateEstadoDto): Promise<Estado> {
    const estado = this.estadoRepository.create(createEstadoDto);
    return await this.estadoRepository.save(estado);
  }

  async findAll(): Promise<Estado[]> {
    return await this.estadoRepository.find();
  }

  async findOne(id: number): Promise<Estado> {
    return await this.estadoRepository.findOneOrFail({ where: { estadoId: id } });
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto): Promise<Estado> {
    await this.estadoRepository.update(id, updateEstadoDto);
    return await this.estadoRepository.findOneOrFail({ where: { estadoId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.estadoRepository.delete(id);
  }
}
