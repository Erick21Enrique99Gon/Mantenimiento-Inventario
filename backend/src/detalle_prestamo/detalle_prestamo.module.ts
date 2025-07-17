import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePrestamoService } from './detalle_prestamo.service';
import { DetallePrestamoController } from './detalle_prestamo.controller';
import { DetallePrestamo } from './entities/detalle_prestamo.entity';
import { Prestamo } from '../prestamo/entities/prestamo.entity';
import { Recurso } from '../recurso/entities/recurso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetallePrestamo, Prestamo, Recurso])],
  controllers: [DetallePrestamoController],
  providers: [DetallePrestamoService],
})
export class DetallePrestamoModule {}