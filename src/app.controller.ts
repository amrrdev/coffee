import { Controller, Get, HttpStatus, Query, Redirect, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { msg: string } {
    return this.appService.getHello();
  }
}
