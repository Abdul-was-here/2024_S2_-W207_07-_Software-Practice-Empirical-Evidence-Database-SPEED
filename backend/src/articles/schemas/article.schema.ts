import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  isbn: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description: string;

  @Prop()
  published_date: Date;

  @Prop()
  publisher: string;

  @Prop({ default: Date.now })
  updated_date: Date;

  @Prop({ required: true })  
  doi: string;

  @Prop({ default: 'pending_moderation' })  // 状态字段，默认值
  status: string;

  @Prop()
  analysisResult: string;  // 确保这里有 analysisResult 字段
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
