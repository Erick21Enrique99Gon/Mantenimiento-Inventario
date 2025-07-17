import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoEquipoDto } from './create-tipo_equipo.dto';

export class UpdateTipoEquipoDto extends PartialType(CreateTipoEquipoDto) {}
