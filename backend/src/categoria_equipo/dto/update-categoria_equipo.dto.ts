import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaEquipoDto } from './create-categoria_equipo.dto';

export class UpdateCategoriaEquipoDto extends PartialType(CreateCategoriaEquipoDto) {}