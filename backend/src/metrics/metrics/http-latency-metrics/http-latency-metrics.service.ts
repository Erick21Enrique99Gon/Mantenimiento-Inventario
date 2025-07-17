import { Injectable } from '@nestjs/common';
import { Histogram } from 'prom-client';

@Injectable()
export class HttpLatencyMetricsService {
  private httpLatency: Histogram<string>;

  constructor() {
    this.httpLatency = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'status_code'], // Etiquetas para el método HTTP y el código de estado
      buckets: [0.1, 0.5, 1, 2, 5, 10], // Definir los buckets de latencia en segundos
    });
  }

  recordLatency(method: string, statusCode: number, duration: number) {
    this.httpLatency.observe({ method, status_code: statusCode.toString() }, duration); // Registrar la latencia
  }

  getLatencyMetrics() {
    return this.httpLatency;
  }
}