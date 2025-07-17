import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estado } from '../../estado/entities/estado.entity';
import { Libro } from '../../libro/entities/libro.entity';
import { Equipo } from '../../equipo/entities/equipo.entity';
import { Mobiliario } from '../../mobiliario/entities/mobiliario.entity';

@Entity('recurso')
export class Recurso {
  @PrimaryGeneratedColumn()
  recursoId: number;

  @ManyToOne(() => Libro, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'libroId' })
  libro?: Libro;

  @ManyToOne(() => Equipo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'equipoId' })
  equipo?: Equipo;

  @ManyToOne(() => Mobiliario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mobiliarioId' })
  mobiliario?: Mobiliario;

  @ManyToOne(() => Estado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estadoId' })
  estado?: Estado;

  @Column({ type: 'text', nullable: true })
  imagen_recurso?: string;
}