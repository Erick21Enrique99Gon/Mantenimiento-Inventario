import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('cat_estado')
@Unique(['descripcion']) // 🔥 Asegura que la descripción sea única en la DB
export class Estado {
  @PrimaryGeneratedColumn()
  estadoId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}