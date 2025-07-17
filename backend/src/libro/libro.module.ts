import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { Libro } from './entities/libro.entity';
import { Editorial } from '../editorial/entities/editorial.entity';
import { CodigoLibro } from '../codigo_libro/entities/codigo_libro.entity';
import { Ubicacion } from '../ubicacion/entities/ubicacion.entity';
import { Estado } from '../estado/entities/estado.entity';
import { RfidRegistro } from '../rfid_registro/entities/rfid_registro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Libro, Editorial, CodigoLibro, Ubicacion, Estado, RfidRegistro]),
  ],
  controllers: [LibroController],
  providers: [LibroService],
})
export class LibroModule {}