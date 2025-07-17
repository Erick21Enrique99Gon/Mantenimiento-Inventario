import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobiliarioService } from './mobiliario.service';
import { MobiliarioController } from './mobiliario.controller';
import { Mobiliario } from './entities/mobiliario.entity';
import { TipoMobiliario } from '../tipo_mobiliario/entities/tipo_mobiliario.entity';
import { Ubicacion } from '../ubicacion/entities/ubicacion.entity';
import { Estado } from '../estado/entities/estado.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';
import { CodigoInventario } from '../codigo_inventario/entities/codigo_inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mobiliario, TipoMobiliario, Ubicacion, Estado, RfidRegistro, CodigoInventario]),
  ],
  controllers: [MobiliarioController],
  providers: [MobiliarioService],
  exports: [MobiliarioService],
})
export class MobiliarioModule {}