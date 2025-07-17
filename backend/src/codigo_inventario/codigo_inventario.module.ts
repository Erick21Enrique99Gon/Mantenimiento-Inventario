import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodigoInventarioService } from './codigo_inventario.service';
import { CodigoInventarioController } from './codigo_inventario.controller';
import { CodigoInventario } from './entities/codigo_inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodigoInventario])],
  controllers: [CodigoInventarioController],
  providers: [CodigoInventarioService],
})
export class CodigoInventarioModule {}