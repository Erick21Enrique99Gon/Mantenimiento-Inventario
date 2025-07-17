import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class ErrorsMetricsService {
  private httpErrors: Counter<string>;

  constructor() {
    this.httpErrors = new Counter({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors (4xx, 5xx)',
      labelNames: ['error_type'], // Etiqueta para el tipo de error
    });
  }

  recordError(errorType: string) {
    this.httpErrors.inc({ error_type: errorType }); // Incrementar el contador de errores
  }

  getErrorMetrics() {
    return this.httpErrors;
  }
}