import { PartialType } from '@nestjs/mapped-types';
import { CreateCodigoInventarioDto } from './create-codigo_inventario.dto';

export class UpdateCodigoInventarioDto extends PartialType(CreateCodigoInventarioDto) {}