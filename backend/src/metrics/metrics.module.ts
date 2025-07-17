import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { MetricsController } from './metrics/metrics.controller';
import { Registry } from 'prom-client';
import { MetricsMiddleware } from './metrics/metrics.middleware';
import { SystemMetricsService } from './metrics/system-metrics/system-metrics.service';
import { HttpStatusMetricsService } from './metrics/http-status-metrics/http-status-metrics.service';
import { ErrorsMetricsService } from './metrics/errors-metrics/errors-metrics.service';
import { HttpLatencyMetricsService } from './metrics/http-latency-metrics/http-latency-metrics.service';
import { EndpointMetricsService } from './metrics/endpoint-metrics/endpoint-metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: false }, // Deshabilitar métricas por defecto
    }),
  ],
  controllers: [MetricsController],
  providers: [
    SystemMetricsService,
    HttpStatusMetricsService,
    ErrorsMetricsService,
    HttpLatencyMetricsService,
    EndpointMetricsService,
    {
      provide: Registry,
      useFactory: () => new Registry(),
    },
    EndpointMetricsService,
  ],
})
export class MetricsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}