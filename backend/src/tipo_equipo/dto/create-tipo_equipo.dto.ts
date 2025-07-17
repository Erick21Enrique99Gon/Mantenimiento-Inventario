import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateTipoEquipoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @Matches(/^\S.*\S$|^\S$/, { message: 'La descripción no puede contener solo espacios en blanco' })
  descripcion: string;
}