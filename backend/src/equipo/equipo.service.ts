import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { CategoriaEquipo } from '../categoria_equipo/entities/categoria_equipo.entity';
import { TipoEquipo } from '../tipo_equipo/entities/tipo_equipo.entity';
import { Ubicacion } from '../ubicacion/entities/ubicacion.entity';
import { Estado } from '../estado/entities/estado.entity';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(CodigoInventario)
    private readonly codigoInventarioRepository: Repository<CodigoInventario>,
    @InjectRepository(RfidRegistro)
    private readonly rfidRegistroRepository: Repository<RfidRegistro>,
    @InjectRepository(CategoriaEquipo)
    private readonly categoriaEquipoRepository: Repository<CategoriaEquipo>,
    @InjectRepository(TipoEquipo)
    private readonly tipoEquipoRepository: Repository<TipoEquipo>,
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
   const {
      codigoInventarioId,
      rfidId,
      categoria_equipoId,
      tipoEquipoId,
      ubicacionId,
      estadoId,
      ...equipoData
    } = createEquipoDto;
  
    // 📌 Buscar entidades relacionadas en paralelo
    const [
      codigoInventario,
      rfid,
      categoria_equipo,
      tipoEquipo,
      ubicacion,
      estado
    ] = await Promise.all([
      codigoInventarioId ? this.codigoInventarioRepository.findOneBy({ codigoInventarioId }) : null,
      rfidId ? this.rfidRegistroRepository.findOne({ where: { rfidId } }) : null,
      categoria_equipoId ? this.categoriaEquipoRepository.findOne({ where: { categoria_equipoId } }) : null,
      tipoEquipoId ? this.tipoEquipoRepository.findOne({ where: { tipoEquipoId } }) : null,
      ubicacionId ? this.ubicacionRepository.findOne({ where: { ubicacionId } }) : null,
      estadoId ? this.estadoRepository.findOne({ where: { estadoId } }) : null,
    ]);
  
    // 📌 Validar existencia de las entidades
    if (codigoInventarioId && !codigoInventario) {
      throw new NotFoundException(`Código de Inventario con ID ${codigoInventarioId} no encontrado`);
    }
    if (rfidId && !rfid) {
      throw new NotFoundException(`RFID con ID ${rfidId} no encontrado`);
    }
    if (categoria_equipoId && !categoria_equipo) {
      throw new NotFoundException(`Categoría de Equipo con ID ${categoria_equipoId} no encontrada`);
    }
    if (tipoEquipoId && !tipoEquipo) {
      throw new NotFoundException(`Tipo de Equipo con ID ${tipoEquipoId} no encontrado`);
    }
    if (ubicacionId && !ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${ubicacionId} no encontrada`);
    }
    if (estadoId && !estado) {
      throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
    }
  
    // 📌 Crear la entidad equipo
    const equipo = this.equipoRepository.create({
      ...equipoData,
      codigoInventario,
      rfid,
      categoria_equipo,
      tipoEquipo,
      ubicacion,
      estado,
    });
  
    console.log("Equipo antes de guardar:", equipo);
  
    return await this.equipoRepository.save(equipo);
  }

  async findAll(): Promise<Equipo[]> {
    return await this.equipoRepository.find({
      relations: ['codigoInventario', 'rfid', 'categoria_equipo', 'tipoEquipo', 'ubicacion', 'estado'],
    });
  }

  async findOne(id: number): Promise<Equipo> {
    try {
      return await this.equipoRepository.findOneOrFail({
        where: { equipoId: id },
        relations: ['codigoInventario', 'rfid', 'categoria_equipo', 'tipoEquipo', 'ubicacion', 'estado'],
      });
    } catch (error) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto): Promise<Equipo> {
    const {
      codigoInventarioId,
      rfidId,
      categoria_equipoId,
      tipoEquipoId,
      ubicacionId,
      estadoId,
      ...equipoData
    } = updateEquipoDto;

    // 📌 Buscar entidades relacionadas
    const [
      codigoInventario,
      rfid,
      categoria_equipo,
      tipoEquipo,
      ubicacion,
      estado
    ] = await Promise.all([
      codigoInventarioId ? this.codigoInventarioRepository.findOne({ where: { codigoInventarioId } }) : null,
      rfidId ? this.rfidRegistroRepository.findOne({ where: { rfidId } }) : null,
      categoria_equipoId ? this.categoriaEquipoRepository.findOne({ where: { categoria_equipoId } }) : null,
      tipoEquipoId ? this.tipoEquipoRepository.findOne({ where: { tipoEquipoId } }) : null,
      ubicacionId ? this.ubicacionRepository.findOne({ where: { ubicacionId } }) : null,
      estadoId ? this.estadoRepository.findOne({ where: { estadoId } }) : null,
    ]);

    // 📌 Validar existencia de las entidades
    if (codigoInventarioId && !codigoInventario) {
      throw new NotFoundException(`Código de Inventario con ID ${codigoInventarioId} no encontrado`);
    }
    if (rfidId && !rfid) {
      throw new NotFoundException(`RFID con ID ${rfidId} no encontrado`);
    }
    if (categoria_equipoId && !categoria_equipo) {
      throw new NotFoundException(`Categoría de Equipo con ID ${categoria_equipoId} no encontrada`);
    }
    if (tipoEquipoId && !tipoEquipo) {
      throw new NotFoundException(`Tipo de Equipo con ID ${tipoEquipoId} no encontrado`);
    }
    if (ubicacionId && !ubicacion) {
      throw new NotFoundException(`Ubicación con ID ${ubicacionId} no encontrada`);
    }
    if (estadoId && !estado) {
      throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
    }

    // 📌 Crear objeto de actualización
    const updatedEquipo = {
      ...equipoData,
      codigoInventario,
      rfid,
      categoria_equipo,
      tipoEquipo,
      ubicacion,
      estado,
    };

    // 📌 Realizar la actualización
    await this.equipoRepository.update(id, updatedEquipo);

    return this.findOne(id);
}


  async remove(id: number): Promise<void> {
    const result = await this.equipoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
  }
}