import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaEquipo } from '../../categoria_equipo/entities/categoria_equipo.entity';
import { TipoEquipo } from '../../tipo_equipo/entities/tipo_equipo.entity';
import { Ubicacion } from '../../ubicacion/entities/ubicacion.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { CodigoInventario } from '../../codigo_inventario/entities/codigo_inventario.entity';
import { RfidRegistro } from '../../rfid_registro/entities/rfid_registro.entity';

@Entity('equipo')
export class Equipo {
  @PrimaryGeneratedColumn()
  equipoId: number;

  @ManyToOne(() => CodigoInventario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'codigoInventarioId' })
  codigoInventario?: CodigoInventario;

  @Column('text') // ✅ Ajustado a `TEXT` para coincidir con la base de datos
  descripcion: string;

  @Column()
  tresp: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // ✅ Ajustado a DECIMAL(10,2)
  valor: number;

  @ManyToOne(() => RfidRegistro, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rfidId' })
  rfid?: RfidRegistro;

  @ManyToOne(() => CategoriaEquipo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoria_equipoId' })
  categoria_equipo?: CategoriaEquipo;

  @ManyToOne(() => TipoEquipo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tipoEquipoId' })
  tipoEquipo?: TipoEquipo;

  @ManyToOne(() => Ubicacion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ubicacionId' })
  ubicacion?: Ubicacion;

  @ManyToOne(() => Estado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estadoId' })
  estado?: Estado;
}