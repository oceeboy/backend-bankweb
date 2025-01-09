import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  await app.listen(3001);
}
bootstrap();
