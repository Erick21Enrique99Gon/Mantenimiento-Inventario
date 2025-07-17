import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<Usuario | null> {
    // Buscar el usuario por carnet o DPI
    const user = await this.usuarioRepository.findOne({
      where: [{ carnet: identifier }, { dpi: identifier }],
      relations: ['rol'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);
  
    // Generar el JWT con más datos del usuario
    const payload = {
      usuarioId: user.usuarioId,
      nombres: user.nombres,
      apellidos: user.apellidos,
      carnet: user.carnet,
      dpi: user.dpi,
      rol: user.rol.descripcion, // Solo la descripción del rol
    };
  
    return {
      access_token: this.jwtService.sign(payload),
      usuario: payload, // 🔥 Enviamos el mismo objeto en la respuesta
    };
  }
  
}