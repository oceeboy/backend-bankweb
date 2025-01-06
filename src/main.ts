import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Allow requests from localhost
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow sending credentials (cookies, Authorization header)
  };
  app.setGlobalPrefix('api');
  app.enableCors(corsOptions);
  await app.listen(3000); // Change the port number as per your setup
}
bootstrap();
