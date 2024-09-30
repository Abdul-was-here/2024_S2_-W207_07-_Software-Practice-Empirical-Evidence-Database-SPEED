const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');

const express = require('@nestjs/platform-express');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
