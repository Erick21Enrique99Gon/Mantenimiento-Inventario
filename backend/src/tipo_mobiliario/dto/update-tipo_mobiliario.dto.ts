import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMobiliarioDto } from './create-tipo_mobiliario.dto';

export class UpdateTipoMobiliarioDto extends PartialType(CreateTipoMobiliarioDto) {}
