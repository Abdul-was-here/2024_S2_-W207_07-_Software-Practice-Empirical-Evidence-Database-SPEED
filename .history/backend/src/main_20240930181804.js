import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js'; // 注意需要显式指定 .js 后缀


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
