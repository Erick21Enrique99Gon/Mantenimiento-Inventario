import { PartialType } from '@nestjs/mapped-types';
import { CreateRfidRegistroDto } from './create-rfid_registro.dto';

export class UpdateRfidRegistroDto extends PartialType(CreateRfidRegistroDto) {}