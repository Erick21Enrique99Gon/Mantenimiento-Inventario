import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RfidRegistroService } from './rfid_registro.service';
import { RfidRegistroController } from './rfid_registro.controller';
import { RfidRegistro } from './entities/rfid_registro.entity';
import { Estado } from 'src/estado/entities/estado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RfidRegistro, Estado])],
  controllers: [RfidRegistroController],
  providers: [RfidRegistroService],
})
export class RfidRegistroModule {}