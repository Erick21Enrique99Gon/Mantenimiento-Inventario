import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/types/express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: AuthenticatedRequest = context.switchToHttp().getRequest();
    const token = req.cookies?.authToken;
  
    if (!token) {
      throw new UnauthorizedException('No autorizado, token no encontrado');
    }
  
    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
  
}