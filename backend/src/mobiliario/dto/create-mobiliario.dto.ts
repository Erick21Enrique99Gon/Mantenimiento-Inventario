import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateMobiliarioDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  codigoInventarioId?: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  tresp: number;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  rfidId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  tipoMobiliarioId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  ubicacionId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  estadoId?: number;
}