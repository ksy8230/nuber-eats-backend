import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { jwtMiddleware } from './jwt/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // 전체 어플리케이션에서 사용하고 싶을 때
  // app.use(jwtMiddleware);
  await app.listen(3000);
}
bootstrap();
