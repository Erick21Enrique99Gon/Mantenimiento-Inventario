import { PartialType } from '@nestjs/mapped-types';
import { CreateCodigoLibroDto } from './create-codigo_libro.dto';

export class UpdateCodigoLibroDto extends PartialType(CreateCodigoLibroDto) {}
