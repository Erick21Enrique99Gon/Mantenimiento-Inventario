import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpStatusMetricsService } from './http-status-metrics/http-status-metrics.service';
import { HttpLatencyMetricsService } from './http-latency-metrics/http-latency-metrics.service';
import { ErrorsMetricsService } from './errors-metrics/errors-metrics.service';
import { EndpointMetricsService } from './endpoint-metrics/endpoint-metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    private readonly httpStatusMetricsService: HttpStatusMetricsService,
    private readonly httpLatencyMetricsService: HttpLatencyMetricsService,
    private readonly errorsMetricsService: ErrorsMetricsService,
    private readonly endpointMetricsService: EndpointMetricsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now(); // Medir el tiempo de inicio para latencia

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000; // Duración de la solicitud en segundos
      const statusCode = res.statusCode; // Obtener el código de estado HTTP
      const endpoint = req.originalUrl; // Obtener la URL del endpoint consultado

      // Registrar métricas de latencia
      this.httpLatencyMetricsService.recordLatency(req.method, statusCode, duration);

      // Registrar métricas de código de estado HTTP
      this.httpStatusMetricsService.recordStatusCode(statusCode);

      // Registrar métricas de errores (si el código de estado es 4xx o 5xx)
      if (statusCode >= 400 && statusCode < 500) {
        this.errorsMetricsService.recordError('4xx');
      } else if (statusCode >= 500 && statusCode < 600) {
        this.errorsMetricsService.recordError('5xx');
      }

      // Registrar métricas de cantidad de consultas por endpoint y código de respuesta
      this.endpointMetricsService.increment(endpoint, statusCode);
    });

    // Continuar con la ejecución del siguiente middleware o controlador
    next();
  }
}