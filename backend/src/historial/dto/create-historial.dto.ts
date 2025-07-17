import { IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateHistorialDto {
  @IsNumber()
  prestamoId: number;

  @IsNumber()
  @IsOptional()
  usuario_prestario: number;

  @IsNumber()
  @IsOptional()
  usuario_prestamista: number;

  @IsDateString()
  fecha_prestamo: string;

  @IsString()
  @IsOptional()
  imagen_prestamo?: string;

  @IsDateString()
  @IsOptional()
  fecha_devolucion?: string;

  @IsString()
  @IsOptional()
  imagen_devolucion?: string;
}