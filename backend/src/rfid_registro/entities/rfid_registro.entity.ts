import { Estado } from 'src/estado/entities/estado.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rfid_registro')
export class RfidRegistro {
  @PrimaryGeneratedColumn()
  rfidId: number;

  @Column({ length: 255, unique: true }) // ✅ Ajustado a la longitud real de la base de datos
  rfid: string;

  @ManyToOne(() => Estado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'estadoId' })
  estado: Estado;
}