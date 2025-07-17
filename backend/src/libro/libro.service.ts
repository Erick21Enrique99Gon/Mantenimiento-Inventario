import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { Libro } from './entities/libro.entity';
import { Editorial } from '../editorial/entities/editorial.entity';
import { CodigoLibro } from '../codigo_libro/entities/codigo_libro.entity';
import { Ubicacion } from '../ubicacion/entities/ubicacion.entity';
import { Estado } from '../estado/entities/estado.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
    @InjectRepository(Editorial)
    private readonly editorialRepository: Repository<Editorial>,
    @InjectRepository(CodigoLibro)
    private readonly codigoLibroRepository: Repository<CodigoLibro>,
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
    @InjectRepository(RfidRegistro)
    private readonly rfidRegistroRepository: Repository<RfidRegistro>,
  ) {}

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    const { rfidId, codigoId, editorialId, ubicacionId, estadoId, ...libroData } = createLibroDto;
  
    const rfid = await this.rfidRegistroRepository.findOne({ where: { rfidId } });
    if (!rfid) throw new NotFoundException(`RFID con ID ${rfidId} no encontrado`);
  
    const codigoLibro = codigoId
      ? await this.codigoLibroRepository.findOne({ where: { codigoId } })
      : null;
    if (codigoId && !codigoLibro) {
      throw new NotFoundException(`Código de Libro con ID ${codigoId} no encontrado`);
    }
  
    const editorial = editorialId
      ? await this.editorialRepository.findOne({ where: { editorialId } })
      : null;
    if (editorialId && !editorial) {
      throw new NotFoundException(`Editorial con ID ${editorialId} no encontrada`);
    }
  
    const ubicacion = ubicacionId
      ? await this.ubicacionRepository.findOne({ where: { ubicacionId } })
      : null;
    if (ubicacionId && !ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${ubicacionId} no encontrada`);
    }
  
    const estado = estadoId
      ? await this.estadoRepository.findOne({ where: { estadoId } })
      : null;
    if (estadoId && !estado) {
      throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
    }
  
    const libro = this.libroRepository.create({
      ...libroData,
      rfid,
      codigoLibro,
      editorial,
      ubicacion,
      estado,
    });
  
    return await this.libroRepository.save(libro);
  }

  async findAll(): Promise<Libro[]> {
    return await this.libroRepository.find({
      relations: ['rfid', 'editorial', 'codigoLibro', 'ubicacion', 'estado'],
    });
  }
  
  async findOne(id: number): Promise<Libro> {
    try {
      return await this.libroRepository.findOneOrFail({
        where: { libroId: id },
        relations: ['rfid', 'editorial', 'codigoLibro', 'ubicacion', 'estado'],
      });
    } catch (error) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateLibroDto: UpdateLibroDto): Promise<Libro> {
    const { rfidId, codigoId, editorialId, ubicacionId, estadoId, ...updateData } = updateLibroDto;
  
    const libro = await this.findOne(id);
  
    if (rfidId) {
      const rfid = await this.rfidRegistroRepository.findOne({ where: { rfidId } });
      if (!rfid) throw new NotFoundException(`RFID con ID ${rfidId} no encontrado`);
      libro.rfid = rfid;
    }
  
    if (codigoId) {
      const codigoLibro = await this.codigoLibroRepository.findOne({ where: { codigoId } });
      if (!codigoLibro) throw new NotFoundException(`Código de Libro con ID ${codigoId} no encontrado`);
      libro.codigoLibro = codigoLibro;
    }
  
    if (editorialId) {
      const editorial = await this.editorialRepository.findOne({ where: { editorialId } });
      if (!editorial) throw new NotFoundException(`Editorial con ID ${editorialId} no encontrada`);
      libro.editorial = editorial;
    }
  
    if (ubicacionId) {
      const ubicacion = await this.ubicacionRepository.findOne({ where: { ubicacionId } });
      if (!ubicacion) throw new NotFoundException(`Ubicación con ID ${ubicacionId} no encontrada`);
      libro.ubicacion = ubicacion;
    }
  
    if (estadoId) {
      const estado = await this.estadoRepository.findOne({ where: { estadoId } });
      if (!estado) throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
      libro.estado = estado;
    }
  
    Object.assign(libro, updateData);
  
    return await this.libroRepository.save(libro);
  }

  async remove(id: number): Promise<void> {
    const result = await this.libroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
  }
}