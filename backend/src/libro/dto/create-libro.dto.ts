import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, Length } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  autor: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // ✅ Ajuste para coincidir con la BD
  isbn: string;

  @IsNumber()
  @IsPositive()
  anio: number;

  @IsNumber()
  @IsPositive()
  edicion: number;

  @IsNumber()
  @IsPositive()
  numero: number;

  @IsNumber()
  @IsOptional() // ✅ Ahora es opcional
  @IsPositive()
  rfidId?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  editorialId?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  codigoId?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  ubicacionId?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  estadoId?: number;
}