import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoMobiliarioDto } from './dto/create-tipo_mobiliario.dto';
import { UpdateTipoMobiliarioDto } from './dto/update-tipo_mobiliario.dto';
import { TipoMobiliario } from './entities/tipo_mobiliario.entity';

@Injectable()
export class TipoMobiliarioService {
  constructor(
    @InjectRepository(TipoMobiliario)
    private readonly tipoMobiliarioRepository: Repository<TipoMobiliario>,
  ) {}

  async create(createTipoMobiliarioDto: CreateTipoMobiliarioDto): Promise<TipoMobiliario> {
    const tipoMobiliario = this.tipoMobiliarioRepository.create(createTipoMobiliarioDto);
    return await this.tipoMobiliarioRepository.save(tipoMobiliario);
  }

  async findAll(): Promise<TipoMobiliario[]> {
    return await this.tipoMobiliarioRepository.find();
  }

  async findOne(id: number): Promise<TipoMobiliario> {
    return await this.tipoMobiliarioRepository.findOneOrFail({ where: { tipoMobiliarioId: id } });
  }

  async update(id: number, updateTipoMobiliarioDto: UpdateTipoMobiliarioDto): Promise<TipoMobiliario> {
    await this.tipoMobiliarioRepository.update(id, updateTipoMobiliarioDto);
    return await this.tipoMobiliarioRepository.findOneOrFail({ where: { tipoMobiliarioId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.tipoMobiliarioRepository.delete(id);
  }
}
