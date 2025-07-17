import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoMobiliario } from '../../tipo_mobiliario/entities/tipo_mobiliario.entity';
import { Ubicacion } from '../../ubicacion/entities/ubicacion.entity';
import { Estado } from '../../estado/entities/estado.entity';
import { RfidRegistro } from '../../rfid_registro/entities/rfid_registro.entity';
import { CodigoInventario } from '../../codigo_inventario/entities/codigo_inventario.entity';

@Entity('mobiliario')
export class Mobiliario {
  @PrimaryGeneratedColumn()
  mobiliarioId: number;

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

  @ManyToOne(() => TipoMobiliario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'tipoMobiliarioId' })
  tipoMobiliario?: TipoMobiliario;

  @ManyToOne(() => Ubicacion, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ubicacionId' })
  ubicacion?: Ubicacion;

  @ManyToOne(() => Estado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estadoId' })
  estado?: Estado;
}