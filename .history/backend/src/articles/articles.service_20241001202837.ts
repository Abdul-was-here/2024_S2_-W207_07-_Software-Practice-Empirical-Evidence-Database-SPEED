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

  // Submit an article and save submitter information
  async submitArticle(createArticleDto: CreateArticleDto, submitterEmail: string): Promise<Article> {
    const createdArticle = new this.articleModel({
      ...createArticleDto, // Spread operator to include properties from the DTO
      updated_date: new Date(), // Set the current date as updated date
      status: 'pending_moderation',  // Initial status is set to pending moderation
      submitter: submitterEmail,  // Save the submitter's email
    });
    return createdArticle.save(); // Save the article to the database
  }


}
