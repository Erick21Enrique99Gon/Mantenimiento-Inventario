import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  usuarioId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombres: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  apellidos: string;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: false })
  carnet: string;

  @Column({ type: 'varchar', length: 13, unique: true, nullable: false })
  dpi: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @ManyToOne(() => Rol, { nullable: true }) // ✅ Ahora permite `null`
  @JoinColumn({ name: 'rolId' })
  rol: Rol;
}