import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Prestamo } from '../../prestamo/entities/prestamo.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('historial_prestamo')
export class Historial {
  @PrimaryGeneratedColumn()
  historialPrestamoId: number;

  @ManyToOne(() => Prestamo)
  @JoinColumn({ name: 'prestamoId' })
  prestamo: Prestamo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_prestarioId' })
  usuario_prestario: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_prestamistaId' })
  usuario_prestamista: Usuario;

  @Column({ type: 'datetime' })
  fecha_prestamo: Date;

  @Column({ type: 'text', nullable: true })
  imagen_prestamo?: string;

  @Column({ type: 'datetime', nullable: true })
  fecha_devolucion?: Date;

  @Column({ type: 'text', nullable: true })
  imagen_devolucion?: string;
}
