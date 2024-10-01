import { Controller, Post, Get, Put, Body, Param, Query, Req } from '@nestjs/common'; // Import necessary decorators and modules
import { ArticlesService } from './articles.service'; // Import ArticlesService for handling article logic
import { CreateArticleDto } from './dto/create-article.dto'; // Import DTO for creating articles
import { HttpException, HttpStatus } from '@nestjs/common'; // Import HttpException and HttpStatus for error handling
import { Request } from 'express'; // Import Request type from Express
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken for decoding JWT

@Controller('articles') // Define the base route for this controller
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {} // Inject ArticlesService



  // Search articles by query
  @Get('search') // Define the route for searching articles
  async searchArticles(@Query('q') query: string) {
    return await this.articlesService.searchArticles(query); // Search articles based on the query parameter
  }
}
