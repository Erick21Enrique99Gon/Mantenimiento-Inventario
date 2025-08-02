import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcedimientosService } from './procedimientos.service';
import { ProcedimientosController } from './procedimientos.controller';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity';
import { RfidRegistro } from 'src/rfid_registro/entities/rfid_registro.entity';
import { TipoEquipo } from 'src/tipo_equipo/entities/tipo_equipo.entity';
import { CategoriaEquipo } from 'src/categoria_equipo/entities/categoria_equipo.entity';
import { TipoMobiliario } from 'src/tipo_mobiliario/entities/tipo_mobiliario.entity';
import { Ubicacion } from 'src/ubicacion/entities/ubicacion.entity';
import { Equipo } from 'src/equipo/entities/equipo.entity';
import { CodigoLibro } from 'src/codigo_libro/entities/codigo_libro.entity';
import { Editorial } from 'src/editorial/entities/editorial.entity';
import { Libro } from 'src/libro/entities/libro.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([CodigoInventario]),
    TypeOrmModule.forFeature([RfidRegistro]),
    TypeOrmModule.forFeature([Ubicacion]),
    TypeOrmModule.forFeature([TipoEquipo]),
    TypeOrmModule.forFeature([CategoriaEquipo]),
    TypeOrmModule.forFeature([Equipo]),
    TypeOrmModule.forFeature([CodigoLibro]),
    TypeOrmModule.forFeature([Editorial]),
    TypeOrmModule.forFeature([Libro]),
    TypeOrmModule.forFeature([TipoMobiliario])
  ],
  providers: [ProcedimientosService],
  controllers: [ProcedimientosController]
})
export class ProcedimientosModule {}
