import { IsNumber, IsOptional, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class CreateEquipoDto {
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
  @IsOptional() 
  rfidId?: number;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  categoria_equipoId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  tipoEquipoId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  ubicacionId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  estadoId?: number;
}