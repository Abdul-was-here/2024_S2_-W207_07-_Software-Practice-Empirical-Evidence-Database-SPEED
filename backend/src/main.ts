import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const dbUri = process.env.DB_URI;
  Logger.log(`DB_URI: ${dbUri}`, 'Bootstrap');

  try {
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
    Logger.log('Database connected successfully');
  } catch (err) {
    Logger.error('Database connection error:', err.message);
  }

  const app = await NestFactory.create(AppModule);
  // enable cors
 app.enableCors({ origin: true, credentials: true });
  const port = process.env.PORT || 8082;
  await app.listen(port, () => Logger.log(`Server running on port ${port}`));
}
bootstrap();
