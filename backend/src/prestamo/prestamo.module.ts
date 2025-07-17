import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamoService } from './prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { Prestamo } from './entities/prestamo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo])],
  controllers: [PrestamoController],
  providers: [PrestamoService],
})
export class PrestamoModule {}
