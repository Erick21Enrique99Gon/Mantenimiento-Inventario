import { Test, TestingModule } from '@nestjs/testing';
import { SystemMetricsService } from './system-metrics.service';

describe('SystemMetricsService', () => {
  let service: SystemMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemMetricsService],
    }).compile();

    service = module.get<SystemMetricsService>(SystemMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
