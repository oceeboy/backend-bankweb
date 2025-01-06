import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api'); to be added before deploying after test
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
