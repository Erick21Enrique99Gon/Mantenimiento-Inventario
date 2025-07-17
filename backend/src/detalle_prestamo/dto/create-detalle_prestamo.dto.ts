import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetallePrestamoDto {
  @IsNumber()
  @IsNotEmpty()
  prestamoId: number;

  @IsNumber()
  @IsNotEmpty()
  recursoId: number;
}