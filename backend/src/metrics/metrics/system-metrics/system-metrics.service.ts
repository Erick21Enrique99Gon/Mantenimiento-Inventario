import { Injectable } from '@nestjs/common';
import { Gauge } from 'prom-client';
import * as os from 'os';

@Injectable()
export class SystemMetricsService {
  private cpuUsage: Gauge<string>;
  private memoryUsage: Gauge<string>;

  constructor() {
    this.cpuUsage = new Gauge({
      name: 'system_cpu_usage',
      help: 'CPU Usage Percentage',
    });

    this.memoryUsage = new Gauge({
      name: 'system_memory_usage',
      help: 'Memory Usage in bytes',
    });

    this.collectMetrics();
  }

  private collectMetrics() {
    setInterval(() => {
      const cpuUsage = os.loadavg()[0]; // Carga promedio de la CPU
      const memoryUsage = os.totalmem() - os.freemem(); // Memoria usada
      this.cpuUsage.set(cpuUsage); // Establecer el valor de la CPU
      this.memoryUsage.set(memoryUsage); // Establecer el valor de la memoria
    }, 10000); // Actualizar cada 10 segundos
  }
}