import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateCategoriaEquipoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // 🔥 Ajustado a la longitud de la base de datos
  @Matches(/^\S.*\S$|^\S$/, { message: 'La descripción no puede contener solo espacios en blanco' })
  descripcion: string;
}