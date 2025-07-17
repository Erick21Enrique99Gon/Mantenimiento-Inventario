import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('cat_categorias_equipo')
@Unique(['descripcion']) // 🔥 Refleja la restricción UNIQUE
export class CategoriaEquipo {
  @PrimaryGeneratedColumn()
  categoria_equipoId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}