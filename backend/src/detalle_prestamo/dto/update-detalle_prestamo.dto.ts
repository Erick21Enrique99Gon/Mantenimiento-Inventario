import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallePrestamoDto } from './create-detalle_prestamo.dto';

export class UpdateDetallePrestamoDto extends PartialType(CreateDetallePrestamoDto) {}