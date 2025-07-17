import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoService } from './recurso.service';
import { RecursoController } from './recurso.controller';
import { Recurso } from './entities/recurso.entity';
import { Libro } from '../libro/entities/libro.entity';
import { Equipo } from '../equipo/entities/equipo.entity';
import { Mobiliario } from '../mobiliario/entities/mobiliario.entity';
import { Estado } from '../estado/entities/estado.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recurso, Libro, Equipo, Mobiliario, Estado, RfidRegistro, CodigoInventario]),
  ],
  controllers: [RecursoController],
  providers: [RecursoService],
  exports: [RecursoService],
})
export class RecursoModule {}