import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodigoLibroService } from './codigo_libro.service';
import { CodigoLibroController } from './codigo_libro.controller';
import { CodigoLibro } from './entities/codigo_libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodigoLibro])],
  controllers: [CodigoLibroController],
  providers: [CodigoLibroService],
})
export class CodigoLibroModule {}
