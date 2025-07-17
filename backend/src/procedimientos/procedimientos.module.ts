import { Module } from '@nestjs/common';
import { ProcedimientosService } from './procedimientos.service';
import { ProcedimientosController } from './procedimientos.controller';

@Module({
  providers: [ProcedimientosService],
  controllers: [ProcedimientosController]
})
export class ProcedimientosModule {}
