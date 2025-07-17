import { Controller, Get } from '@nestjs/common';
import { Registry } from 'prom-client';
import { HttpStatusMetricsService } from './http-status-metrics/http-status-metrics.service';
import { HttpLatencyMetricsService } from './http-latency-metrics/http-latency-metrics.service';
import { ErrorsMetricsService } from './errors-metrics/errors-metrics.service';
import { SystemMetricsService } from './system-metrics/system-metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly httpStatusMetricsService: HttpStatusMetricsService,
    private readonly httpLatencyMetricsService: HttpLatencyMetricsService,
    private readonly errorsMetricsService: ErrorsMetricsService,
    private readonly systemMetricsService: SystemMetricsService,
    private readonly registry: Registry,
  ) {}

  @Get()
  async getMetrics(): Promise<string> {
    // Exponer todas las métricas registradas
    return this.registry.metrics();
  }
}