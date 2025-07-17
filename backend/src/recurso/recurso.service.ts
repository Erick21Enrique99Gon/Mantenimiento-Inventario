import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';
import { Recurso } from './entities/recurso.entity';
import { Libro } from '../libro/entities/libro.entity';
import { Equipo } from '../equipo/entities/equipo.entity';
import { Mobiliario } from '../mobiliario/entities/mobiliario.entity';
import { Estado } from '../estado/entities/estado.entity';

@Injectable()
export class RecursoService {
  constructor(
    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,

    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,

    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,

    @InjectRepository(Mobiliario)
    private readonly mobiliarioRepository: Repository<Mobiliario>,

    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createRecursoDto: CreateRecursoDto): Promise<Recurso> {
    const { libroId, equipoId, mobiliarioId, estadoId } = createRecursoDto;
  
    const libro = libroId ? await this.libroRepository.findOne({ where: { libroId }, relations: ['rfid', 'codigoLibro', 'estado', 'ubicacion', 'editorial'] }) : null;
    if (libroId && !libro) throw new NotFoundException(`Libro con ID ${libroId} no encontrado`);

    const equipo = equipoId ? await this.equipoRepository.findOne({ where: { equipoId }, relations: ['rfid', 'codigoInventario', 'estado', 'ubicacion', 'categoria_equipo', 'tipoEquipo'] }) : null;
    if (equipoId && !equipo) throw new NotFoundException(`Equipo con ID ${equipoId} no encontrado`);

    const mobiliario = mobiliarioId ? await this.mobiliarioRepository.findOne({ where: { mobiliarioId }, relations: ['rfid', 'codigoInventario', 'estado', 'ubicacion', 'tipoMobiliario'] }) : null;
    if (mobiliarioId && !mobiliario) throw new NotFoundException(`Mobiliario con ID ${mobiliarioId} no encontrado`);

    const estado = estadoId ? await this.estadoRepository.findOne({ where: { estadoId } }) : null;
    if (estadoId && !estado) throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);

    const recurso = this.recursoRepository.create({ libro, equipo, mobiliario, estado });
    return await this.recursoRepository.save(recurso);
  }

  async findAll(): Promise<Recurso[]> {
    return await this.recursoRepository
      .createQueryBuilder('recurso')
      .leftJoinAndSelect('recurso.libro', 'libro')
      .leftJoinAndSelect('libro.rfid', 'rfid_libro')
      .leftJoinAndSelect('libro.codigoLibro', 'codigoLibro')
      .leftJoinAndSelect('libro.estado', 'estado_libro')
      .leftJoinAndSelect('libro.ubicacion', 'ubicacion_libro')
      .leftJoinAndSelect('libro.editorial', 'editorial')

      .leftJoinAndSelect('recurso.equipo', 'equipo')
      .leftJoinAndSelect('equipo.rfid', 'rfid_equipo')
      .leftJoinAndSelect('equipo.codigoInventario', 'codigoInventario_equipo')
      .leftJoinAndSelect('equipo.estado', 'estado_equipo')
      .leftJoinAndSelect('equipo.ubicacion', 'ubicacion_equipo')
      .leftJoinAndSelect('equipo.categoria_equipo', 'categoria_equipo')
      .leftJoinAndSelect('equipo.tipoEquipo', 'tipoEquipo')

      .leftJoinAndSelect('recurso.mobiliario', 'mobiliario')
      .leftJoinAndSelect('mobiliario.rfid', 'rfid_mobiliario')
      .leftJoinAndSelect('mobiliario.codigoInventario', 'codigoInventario_mobiliario')
      .leftJoinAndSelect('mobiliario.estado', 'estado_mobiliario')
      .leftJoinAndSelect('mobiliario.ubicacion', 'ubicacion_mobiliario')
      .leftJoinAndSelect('mobiliario.tipoMobiliario', 'tipoMobiliario')

      .leftJoinAndSelect('recurso.estado', 'estado_recurso')
      .getMany();
  }

  async findOne(id: number): Promise<Recurso> {
    try {
      return await this.recursoRepository
        .createQueryBuilder('recurso')
        .leftJoinAndSelect('recurso.libro', 'libro')
        .leftJoinAndSelect('libro.rfid', 'rfid_libro')
        .leftJoinAndSelect('libro.codigoLibro', 'codigoLibro')
        .leftJoinAndSelect('libro.estado', 'estado_libro')
        .leftJoinAndSelect('libro.ubicacion', 'ubicacion_libro')
        .leftJoinAndSelect('libro.editorial', 'editorial')

        .leftJoinAndSelect('recurso.equipo', 'equipo')
        .leftJoinAndSelect('equipo.rfid', 'rfid_equipo')
        .leftJoinAndSelect('equipo.codigoInventario', 'codigoInventario_equipo')
        .leftJoinAndSelect('equipo.estado', 'estado_equipo')
        .leftJoinAndSelect('equipo.ubicacion', 'ubicacion_equipo')
        .leftJoinAndSelect('equipo.categoria_equipo', 'categoria_equipo')
        .leftJoinAndSelect('equipo.tipoEquipo', 'tipoEquipo')

        .leftJoinAndSelect('recurso.mobiliario', 'mobiliario')
        .leftJoinAndSelect('mobiliario.rfid', 'rfid_mobiliario')
        .leftJoinAndSelect('mobiliario.codigoInventario', 'codigoInventario_mobiliario')
        .leftJoinAndSelect('mobiliario.estado', 'estado_mobiliario')
        .leftJoinAndSelect('mobiliario.ubicacion', 'ubicacion_mobiliario')
        .leftJoinAndSelect('mobiliario.tipoMobiliario', 'tipoMobiliario')

        .leftJoinAndSelect('recurso.estado', 'estado_recurso')
        .where('recurso.recursoId = :id', { id })
        .getOneOrFail();
    } catch (error) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateRecursoDto: UpdateRecursoDto): Promise<Recurso> {
    const recurso = await this.findOne(id);
    const { libroId, equipoId, mobiliarioId, estadoId } = updateRecursoDto;

    const libro = libroId ? await this.libroRepository.findOne({ where: { libroId } }) : recurso.libro;
    if (libroId && !libro) throw new NotFoundException(`Libro con ID ${libroId} no encontrado`);

    const equipo = equipoId ? await this.equipoRepository.findOne({ where: { equipoId } }) : recurso.equipo;
    if (equipoId && !equipo) throw new NotFoundException(`Equipo con ID ${equipoId} no encontrado`);

    const mobiliario = mobiliarioId ? await this.mobiliarioRepository.findOne({ where: { mobiliarioId } }) : recurso.mobiliario;
    if (mobiliarioId && !mobiliario) throw new NotFoundException(`Mobiliario con ID ${mobiliarioId} no encontrado`);

    const estado = estadoId ? await this.estadoRepository.findOne({ where: { estadoId } }) : recurso.estado;
    if (estadoId && !estado) throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);

    await this.recursoRepository.update(id, { libro, equipo, mobiliario, estado });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const recurso = await this.findOne(id);
    await this.recursoRepository.delete(id);
  }
}