import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.authToken, // Extraer de la cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }

  async validate(payload: any) {
    return {
      usuarioId: payload.usuarioId,
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      carnet: payload.carnet,
      dpi: payload.dpi,
      rol: payload.rol,
    };
  }
  
}