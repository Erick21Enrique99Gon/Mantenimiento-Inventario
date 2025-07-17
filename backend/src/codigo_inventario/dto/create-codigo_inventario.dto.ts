import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateCodigoInventarioDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // ✅ Ajustado a la longitud real de la base de datos
  @Matches(/^\S.*\S$|^\S$/, { message: 'El código no puede contener solo espacios en blanco' })
  codigo: string;
}