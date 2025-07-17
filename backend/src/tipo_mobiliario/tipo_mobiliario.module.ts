import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMobiliarioService } from './tipo_mobiliario.service';
import { TipoMobiliarioController } from './tipo_mobiliario.controller';
import { TipoMobiliario } from './entities/tipo_mobiliario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMobiliario])],
  controllers: [TipoMobiliarioController],
  providers: [TipoMobiliarioService],
})
export class TipoMobiliarioModule {}
