import { Injectable } from '@nestjs/common'; // Import the Injectable decorator
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel for dependency injection
import { Model } from 'mongoose'; // Import Model from Mongoose
import { Article } from './schemas/article.schema'; // Import the Article schema
import { CreateArticleDto } from './dto/create-article.dto'; // Import DTO for article creation
import { isValidObjectId } from 'mongoose'; // Import to validate MongoDB Object IDs
import { HttpException, HttpStatus } from '@nestjs/common'; // Import HttpException and HttpStatus for error handling

@Injectable() // Mark the class as a provider
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>, // Inject the Article model
  ) {}
  
  // Search articles by title
  async searchArticles(query: string): Promise<Article[]> {
    return this.articleModel.find({ title: new RegExp(query, 'i') }).exec(); // Search for articles matching the title
  }

}
