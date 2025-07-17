import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Editorial } from '../../editorial/entities/editorial.entity';
import { CodigoLibro } from '../../codigo_libro/entities/codigo_libro.entity';
import { Ubicacion } from '../../ubicacion/entities/ubicacion.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { RfidRegistro } from '../../rfid_registro/entities/rfid_registro.entity';

@Entity('libro')
export class Libro {
  @PrimaryGeneratedColumn()
  libroId: number;

  @Column('text') // ✅ Ajustado a `TEXT` para coincidir con la base de datos
  titulo: string;

  @Column('text') // ✅ Ajustado a `TEXT` para coincidir con la base de datos
  autor: string;

  @Column({ length: 255 }) // ✅ Ahora coincide con la base de datos
  isbn: string;

  @Column({ type: 'int' })
  anio: number;

  @Column()
  edicion: number;

  @Column()
  numero: number;

  @ManyToOne(() => RfidRegistro, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rfidId' })
  rfid?: RfidRegistro;

  @ManyToOne(() => Editorial, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'editorialId' })
  editorial?: Editorial;

  @ManyToOne(() => CodigoLibro, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'codigoId' })
  codigoLibro?: CodigoLibro;

  @ManyToOne(() => Ubicacion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ubicacionId' })
  ubicacion?: Ubicacion;

  @ManyToOne(() => Estado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estadoId' })
  estado?: Estado;
}