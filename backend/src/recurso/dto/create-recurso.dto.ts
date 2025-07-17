import { IsNumber, IsOptional, IsString, IsPositive, IsUrl } from 'class-validator';

export class CreateRecursoDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  libroId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  equipoId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  mobiliarioId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  estadoId?: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  imagen_recurso?: string;
}