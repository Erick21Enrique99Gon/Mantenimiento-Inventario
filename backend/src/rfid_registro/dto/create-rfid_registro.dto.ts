import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsNumber } from 'class-validator';

export class CreateRfidRegistroDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // ✅ Ajustado a la longitud real de la base de datos
  @Matches(/^\S.*\S$|^\S$/, { message: 'El código RFID no puede contener solo espacios en blanco' })
  rfid: string;

  @IsNumber()
  @IsOptional()
  estadoId?: number;
}