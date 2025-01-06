import { Controller, Get, Options } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  defaultApiRoute() {
    return { message: 'Welcome to the API!' };
  }

  @Options()
  preflightHandler() {
    return { message: 'Preflight OK' };
  }
}
