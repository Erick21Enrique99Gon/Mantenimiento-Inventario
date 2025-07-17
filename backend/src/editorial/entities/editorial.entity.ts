import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('cat_editorial')
@Unique(['descripcion']) // 🔥 Asegura que la descripción sea única en la DB
export class Editorial {
  @PrimaryGeneratedColumn()
  editorialId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}