import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadAppConfig } from './config/env';

async function bootstrap() {
  const config = loadAppConfig();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.frontendOrigin,
  });
  await app.listen(config.port);
}
void bootstrap();
