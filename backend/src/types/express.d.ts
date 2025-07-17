import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    usuarioId: number;
    rol: string;
  };
}