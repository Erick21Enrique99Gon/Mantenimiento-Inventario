import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @Matches(/^\S.*\S$|^\S$/, { message: 'El nombre no puede contener solo espacios en blanco' })
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @Matches(/^\S.*\S$|^\S$/, { message: 'El apellido no puede contener solo espacios en blanco' })
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @Length(15, 15)
  @Matches(/^\S.*\S$|^\S$/, { message: 'El carnet no puede contener solo espacios en blanco' })
  carnet: string;

  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  @Matches(/^\d{13}$/, { message: 'El DPI debe contener exactamente 13 dígitos numéricos' })
  dpi: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial',
  })
  password: string;

  @IsOptional() // ✅ Ahora permite `null`
  @IsInt()
  rolId?: number;
}