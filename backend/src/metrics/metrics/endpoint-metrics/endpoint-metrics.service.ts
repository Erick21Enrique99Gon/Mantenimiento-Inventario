import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class EndpointMetricsService {
  private readonly requestCounter: Counter;

  constructor() {
    this.requestCounter = new Counter({
      name: 'http_requests_by_endpoint_status',
      help: 'Cantidad de solicitudes por endpoint y código de respuesta',
      labelNames: ['endpoint', 'status_code'],
    });
  }

  increment(endpoint: string, statusCode: number) {
    this.requestCounter.inc({ endpoint, status_code: statusCode });
  }
}