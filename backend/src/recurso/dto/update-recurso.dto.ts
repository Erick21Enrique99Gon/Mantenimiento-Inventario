import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateRecursoDto {
  @IsOptional()
  @IsNumber()
  libroId?: number;

  @IsOptional()
  @IsNumber()
  equipoId?: number;

  @IsOptional()
  @IsNumber()
  mobiliarioId?: number;

  @IsOptional()
  @IsNumber()
  estadoId?: number;

  @IsOptional()
  @IsString()
  imagen_recurso?: string;
}