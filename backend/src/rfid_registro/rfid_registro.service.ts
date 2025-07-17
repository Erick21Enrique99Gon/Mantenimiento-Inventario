import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRfidRegistroDto } from './dto/create-rfid_registro.dto';
import { UpdateRfidRegistroDto } from './dto/update-rfid_registro.dto';
import { RfidRegistro } from './entities/rfid_registro.entity';
import { Estado } from 'src/estado/entities/estado.entity';

@Injectable()
export class RfidRegistroService {
  constructor(
    @InjectRepository(RfidRegistro)
    private readonly rfidRegistroRepository: Repository<RfidRegistro>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createRfidRegistroDto: CreateRfidRegistroDto): Promise<RfidRegistro> {
    const { estadoId, ...rfidData } = createRfidRegistroDto;
    let estado = null;

    if (estadoId) {
      estado = await this.estadoRepository.findOne({ where: { estadoId } });
      if (!estado) {
        throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
      }
    }

    const rfidRegistro = this.rfidRegistroRepository.create({
      ...rfidData,
      estado,
    });

    return await this.rfidRegistroRepository.save(rfidRegistro);
  }

  async findAll(): Promise<RfidRegistro[]> {
    return await this.rfidRegistroRepository.find({ relations: ['estado'] });
  }

  async findOne(id: number): Promise<RfidRegistro> {
    try {
      return await this.rfidRegistroRepository.findOneOrFail({
        where: { rfidId: id },
        relations: ['estado'],
      });
    } catch (error) {
      throw new NotFoundException(`RFID con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateRfidRegistroDto: UpdateRfidRegistroDto): Promise<RfidRegistro> {
    const { estadoId, ...rfidData } = updateRfidRegistroDto;
    const rfidRegistro = await this.findOne(id);

    if (estadoId) {
      const estado = await this.estadoRepository.findOne({ where: { estadoId } });
      if (!estado) {
        throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
      }
      rfidRegistro.estado = estado;
    }

    Object.assign(rfidRegistro, rfidData);
    return await this.rfidRegistroRepository.save(rfidRegistro);
  }

  async remove(id: number): Promise<void> {
    const rfidRegistro = await this.findOne(id);
    await this.rfidRegistroRepository.remove(rfidRegistro);
  }
}