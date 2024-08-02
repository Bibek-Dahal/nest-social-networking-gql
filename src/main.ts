import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties not defined in DTO
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
  }));
  await app.listen(8000);
}
bootstrap();
