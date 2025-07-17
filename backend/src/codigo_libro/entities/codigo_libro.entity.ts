import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('codigo_libro')
@Unique(['descripcion']) // 🔥 Refleja la restricción UNIQUE
export class CodigoLibro {
  @PrimaryGeneratedColumn()
  codigoId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}