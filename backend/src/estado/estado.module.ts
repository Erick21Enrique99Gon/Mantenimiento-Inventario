import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { Estado } from './entities/estado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  controllers: [EstadoController],
  providers: [EstadoService],
})
export class EstadoModule {}
