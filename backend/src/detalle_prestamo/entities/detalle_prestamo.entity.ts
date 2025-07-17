import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Prestamo } from '../../prestamo/entities/prestamo.entity';
import { Recurso } from '../../recurso/entities/recurso.entity';

@Entity('detalle_prestamo')
export class DetallePrestamo {
  @PrimaryGeneratedColumn()
  detalleId: number;

  @ManyToOne(() => Prestamo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestamoId' })
  prestamo: Prestamo;

  @ManyToOne(() => Recurso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recursoId' })
  recurso: Recurso;
}