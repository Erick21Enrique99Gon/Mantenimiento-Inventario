import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEquipoService } from './categoria_equipo.service';
import { CategoriaEquipoController } from './categoria_equipo.controller';
import { CategoriaEquipo } from './entities/categoria_equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEquipo])],
  controllers: [CategoriaEquipoController],
  providers: [CategoriaEquipoService],
})
export class CategoriaEquipoModule {}