import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
 
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.DB_URI), 
    ArticlesModule,
  ],
})
export class AppModule {}


