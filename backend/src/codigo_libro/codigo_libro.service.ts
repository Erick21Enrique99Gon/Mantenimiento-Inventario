import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCodigoLibroDto } from './dto/create-codigo_libro.dto';
import { UpdateCodigoLibroDto } from './dto/update-codigo_libro.dto';
import { CodigoLibro } from './entities/codigo_libro.entity';

@Injectable()
export class CodigoLibroService {
  constructor(
    @InjectRepository(CodigoLibro)
    private readonly codigoLibroRepository: Repository<CodigoLibro>,
  ) {}

  async create(createCodigoLibroDto: CreateCodigoLibroDto): Promise<CodigoLibro> {
    const codigoLibro = this.codigoLibroRepository.create(createCodigoLibroDto);
    return await this.codigoLibroRepository.save(codigoLibro);
  }

  async findAll(): Promise<CodigoLibro[]> {
    return await this.codigoLibroRepository.find();
  }

  async findOne(id: number): Promise<CodigoLibro> {
    return await this.codigoLibroRepository.findOneOrFail({ where: { codigoId: id } });
  }

  async update(id: number, updateCodigoLibroDto: UpdateCodigoLibroDto): Promise<CodigoLibro> {
    await this.codigoLibroRepository.update(id, updateCodigoLibroDto);
    return await this.codigoLibroRepository.findOneOrFail({ where: { codigoId: id } });
  }

  async remove(id: number): Promise<void> {
    await this.codigoLibroRepository.delete(id);
  }
}
