import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('ubicacion_salon')
@Unique(['descripcion']) // 🔥 Refleja la restricción UNIQUE
export class Ubicacion {
  @PrimaryGeneratedColumn()
  ubicacionId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}