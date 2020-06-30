import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import {
  DNSHealthIndicator,
  HealthCheckService,
  HealthCheck,
} from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
  ) {}

  @Get('healthz')
  @HealthCheck()
  healthCheck(): any {
    return this.health.check([
      async (): Promise<any> => this.dns.pingCheck('dns', 'https://google.com'),
    ]);
  }

  @Get('error')
  errorTest(): any {
    throw new HttpException('Test Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
