import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEquipoService } from './tipo_equipo.service';
import { TipoEquipoController } from './tipo_equipo.controller';
import { TipoEquipo } from './entities/tipo_equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEquipo])],
  controllers: [TipoEquipoController],
  providers: [TipoEquipoService],
})
export class TipoEquipoModule {}
