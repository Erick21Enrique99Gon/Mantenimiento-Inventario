import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { Equipo } from './entities/equipo.entity';
import { CategoriaEquipo } from '../categoria_equipo/entities/categoria_equipo.entity';
import { TipoEquipo } from '../tipo_equipo/entities/tipo_equipo.entity';
import { Ubicacion } from '../ubicacion/entities/ubicacion.entity';
import { Estado } from '../estado/entities/estado.entity';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipo, CategoriaEquipo, TipoEquipo, Ubicacion, Estado, CodigoInventario, RfidRegistro]),
  ],
  controllers: [EquipoController],
  providers: [EquipoService],
  exports: [EquipoService],
})
export class EquipoModule {}