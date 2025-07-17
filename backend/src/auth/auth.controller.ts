import { Controller, Post, Get, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticatedRequest } from '../types/express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔹 Login: Establece la cookie y devuelve el token en la respuesta
  @Post('login')
  async login(
    @Body() { identifier, password }: { identifier: string; password: string },
    @Res() res: Response
  ) {
    const { access_token, usuario } = await this.authService.login(identifier, password);
    
    // 🔥 Almacenar token en una cookie HTTP-only
    res.cookie('authToken', access_token, {
      httpOnly: true,
      secure: false, // 🚨 Usar `true` solo en producción con HTTPS
      sameSite: 'lax', // 🔥 Para permitir peticiones cross-site seguras
    });

    // 🔥 También devolver el token en la respuesta JSON
    return res.json({ usuario, access_token });
  }

  // 🔹 Logout: Borra la cookie de sesión
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('authToken');
    return res.json({ message: 'Sesión cerrada' });
  }

  // 🔹 Obtener usuario autenticado (y devolver el token si existe)
  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: AuthenticatedRequest) {
    return {
      usuario: req.user, // ✅ Contiene toda la información del usuario
      access_token: req.cookies.authToken,
    };
  }

}