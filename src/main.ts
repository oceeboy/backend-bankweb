import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token',
  });

  await app.listen(3001);
}
bootstrap();
