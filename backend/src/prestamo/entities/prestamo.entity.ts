import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estado } from '../../estado/entities/estado.entity';

@Entity('prestamo')
export class Prestamo {
  @PrimaryGeneratedColumn()
  prestamoId: number;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estadoId' })
  estado: Estado;

  @Column({ length: 200 })
  observacion: string;
}
