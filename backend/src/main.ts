import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadAppConfig } from './config/env';

async function bootstrap() {
  const config = loadAppConfig();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.frontendOrigin,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(config.port);
}
void bootstrap();
