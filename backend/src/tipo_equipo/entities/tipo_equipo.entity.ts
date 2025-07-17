import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('cat_tipo_equipo')
@Unique(['descripcion']) // 🔥 Asegura que la descripción sea única en la DB
export class TipoEquipo {
  @PrimaryGeneratedColumn()
  tipoEquipoId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}