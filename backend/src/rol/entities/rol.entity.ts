import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('rol')
@Unique(['descripcion']) // 🔥 Refleja la restricción UNIQUE
export class Rol {
  @PrimaryGeneratedColumn()
  rolId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  descripcion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}