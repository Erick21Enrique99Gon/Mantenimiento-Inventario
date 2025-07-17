import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/db-check')
  async checkDb() {
    return this.appService.checkDatabaseConnection();
  }
}