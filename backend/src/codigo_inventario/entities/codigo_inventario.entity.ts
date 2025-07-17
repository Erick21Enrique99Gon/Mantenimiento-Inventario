import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('codigo_inventario')
export class CodigoInventario {
  @PrimaryGeneratedColumn()
  codigoInventarioId: number;

  @Column({ length: 255, unique: true }) // ✅ Ajustado a la longitud real de la base de datos
  codigo: string;
}