import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class HttpStatusMetricsService {
  private httpStatusCodes: Counter<string>;

  constructor() {
    this.httpStatusCodes = new Counter({
      name: 'http_requests_by_status_code',
      help: 'Count of HTTP requests by status code',
      labelNames: ['status_code'], // Etiqueta para el código de estado HTTP
    });
  }

  recordStatusCode(statusCode: number) {
    this.httpStatusCodes.inc({ status_code: statusCode.toString() }); // Incrementar el contador con el código de estado
  }

  getStatusCodeMetrics() {
    return this.httpStatusCodes;
  }
}