import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePrestamoDto {
  @IsNumber()
  @IsPositive()
  estadoId: number;

  @IsString()
  @IsNotEmpty()
  observacion: string;
}
