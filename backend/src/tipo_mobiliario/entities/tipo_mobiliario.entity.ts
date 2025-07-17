import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('cat_tipo_mobiliario')
@Unique(['descripcion']) // 🔥 Refleja la restricción UNIQUE
export class TipoMobiliario {
  @PrimaryGeneratedColumn()
  tipoMobiliarioId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;
}