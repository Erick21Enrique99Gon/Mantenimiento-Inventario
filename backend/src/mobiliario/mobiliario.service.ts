import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMobiliarioDto } from './dto/create-mobiliario.dto';
import { UpdateMobiliarioDto } from './dto/update-mobiliario.dto';
import { Mobiliario } from './entities/mobiliario.entity';
import { TipoMobiliario } from '../tipo_mobiliario/entities/tipo_mobiliario.entity';
import { Ubicacion } from '../ubicacion/entities/ubicacion.entity';
import { Estado } from '../estado/entities/estado.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity';

@Injectable()
export class MobiliarioService {
  constructor(
    @InjectRepository(Mobiliario)
    private readonly mobiliarioRepository: Repository<Mobiliario>,
    @InjectRepository(TipoMobiliario)
    private readonly tipoMobiliarioRepository: Repository<TipoMobiliario>,
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
    @InjectRepository(RfidRegistro)
    private readonly rfidRegistroRepository: Repository<RfidRegistro>,
    @InjectRepository(CodigoInventario)
    private readonly codigoInventarioRepository: Repository<CodigoInventario>,
  ) {}

  async create(createMobiliarioDto: CreateMobiliarioDto): Promise<Mobiliario> {
    const { rfidId, codigoInventarioId, tipoMobiliarioId, ubicacionId, estadoId, ...mobiliarioData } = createMobiliarioDto;
  
    // 📌 Validar existencia de RFID
    let rfid = null;
    if (rfidId) {
      rfid = await this.rfidRegistroRepository.findOne({ where: { rfidId } });
      if (!rfid) throw new NotFoundException(`RFID con ID ${rfidId} no encontrado`);
    }
  
    // 📌 Validar existencia de Código de Inventario
    let codigoInventario = null;
    if (codigoInventarioId) {
      codigoInventario = await this.codigoInventarioRepository.findOne({ where: { codigoInventarioId } });
      if (!codigoInventario) throw new NotFoundException(`Código de Inventario con ID ${codigoInventarioId} no encontrado`);
    }
  
    // 📌 Validar existencia de Tipo de Mobiliario
    let tipoMobiliario = null;
    if (tipoMobiliarioId) {
      tipoMobiliario = await this.tipoMobiliarioRepository.findOne({ where: { tipoMobiliarioId } });
      if (!tipoMobiliario) throw new NotFoundException(`Tipo de Mobiliario con ID ${tipoMobiliarioId} no encontrado`);
    }
  
    // 📌 Validar existencia de Ubicación
    let ubicacion = null;
    if (ubicacionId) {
      ubicacion = await this.ubicacionRepository.findOne({ where: { ubicacionId } });
      if (!ubicacion) throw new NotFoundException(`Ubicación con ID ${ubicacionId} no encontrada`);
    }
  
    // 📌 Validar existencia de Estado
    let estado = null;
    if (estadoId) {
      estado = await this.estadoRepository.findOne({ where: { estadoId } });
      if (!estado) throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
    }
  
    const mobiliario = this.mobiliarioRepository.create({
      ...mobiliarioData,
      rfid,
      codigoInventario,
      tipoMobiliario,
      ubicacion,
      estado,
    });
  
    return await this.mobiliarioRepository.save(mobiliario);
  }

  async findAll(): Promise<Mobiliario[]> {
    return await this.mobiliarioRepository.find({
      relations: ['rfid', 'codigoInventario', 'tipoMobiliario', 'ubicacion', 'estado'],
    });
  }
  
  async findOne(id: number): Promise<Mobiliario> {
    try {
      return await this.mobiliarioRepository.findOneOrFail({
        where: { mobiliarioId: id },
        relations: ['rfid', 'codigoInventario', 'tipoMobiliario', 'ubicacion', 'estado'],
      });
    } catch (error) {
      throw new NotFoundException(`Mobiliario con ID ${id} no encontrado`);
    }
  }

  async update(id: number, updateMobiliarioDto: UpdateMobiliarioDto): Promise<Mobiliario> {
    const mobiliario = await this.findOne(id);
    const { rfidId, codigoInventarioId, tipoMobiliarioId, ubicacionId, estadoId, ...updateData } = updateMobiliarioDto;
  
    let rfid = mobiliario.rfid;
    if (rfidId) {
      rfid = await this.rfidRegistroRepository.findOne({ where: { rfidId } });
      if (!rfid) throw new NotFoundException(`RFID con ID ${rfidId} no encontrado`);
    }
  
    let codigoInventario = mobiliario.codigoInventario;
    if (codigoInventarioId) {
      codigoInventario = await this.codigoInventarioRepository.findOne({ where: { codigoInventarioId } });
      if (!codigoInventario) throw new NotFoundException(`Código de Inventario con ID ${codigoInventarioId} no encontrado`);
    }
  
    let tipoMobiliario = mobiliario.tipoMobiliario;
    if (tipoMobiliarioId) {
      tipoMobiliario = await this.tipoMobiliarioRepository.findOne({ where: { tipoMobiliarioId } });
      if (!tipoMobiliario) throw new NotFoundException(`Tipo de Mobiliario con ID ${tipoMobiliarioId} no encontrado`);
    }
  
    let ubicacion = mobiliario.ubicacion;
    if (ubicacionId) {
      ubicacion = await this.ubicacionRepository.findOne({ where: { ubicacionId } });
      if (!ubicacion) throw new NotFoundException(`Ubicación con ID ${ubicacionId} no encontrada`);
    }
  
    let estado = mobiliario.estado;
    if (estadoId) {
      estado = await this.estadoRepository.findOne({ where: { estadoId } });
      if (!estado) throw new NotFoundException(`Estado con ID ${estadoId} no encontrado`);
    }
  
    await this.mobiliarioRepository.update(id, {
      ...updateData,
      rfid,
      codigoInventario,
      tipoMobiliario,
      ubicacion,
      estado,
    });
  
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.mobiliarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Mobiliario con ID ${id} no encontrado`);
    }
  }
}