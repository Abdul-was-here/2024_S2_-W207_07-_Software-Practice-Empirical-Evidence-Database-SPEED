import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();  // 启用 CORS
  app.setGlobalPrefix('api');  // 设置全局 API 前缀
  await app.listen(process.env.PORT || 3000);  // 使用环境变量 PORT 或默认的 3000 端口
}
bootstrap();
