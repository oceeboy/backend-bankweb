import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://example.com'], // Allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
      credentials: true, // Allow cookies
    }),
  );

  await app.listen(3001);
}
bootstrap();
