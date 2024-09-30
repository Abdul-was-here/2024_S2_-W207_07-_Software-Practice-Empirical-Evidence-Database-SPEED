import { Controller, Post, Get, Put, Body, Param, Query, Req } from '@nestjs/common'; // Import necessary decorators and modules
import { ArticlesService } from './articles.service'; // Import ArticlesService for handling article logic
import { CreateArticleDto } from './dto/create-article.dto'; // Import DTO for creating articles
import { HttpException, HttpStatus } from '@nestjs/common'; // Import HttpException and HttpStatus for error handling
import { Request } from 'express'; // Import Request type from Express
import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken for decoding JWT

@Controller('articles') // Define the base route for this controller
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {} // Inject ArticlesService

  // Submit an article
  @Post('submit') // Define the route for submitting an article
  async submitArticle(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    try {
      // Get JWT token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED); // Throw an exception if token is missing
      }

      // Decode JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret
      const submitterEmail = decoded.email; // Get the submitter's email from the decoded token

      // Pass submitter information to the service layer
      return await this.articlesService.submitArticle(createArticleDto, submitterEmail);
    } catch (error) {
      console.error('Error while submitting article:', error);  
      throw new HttpException('Failed to submit article', HttpStatus.INTERNAL_SERVER_ERROR); // Handle errors
    }
  }
  
  // Get all articles
  @Get() // Define the route for getting all articles
  async getAllArticles() {
    return await this.articlesService.findAll(); // Retrieve all articles using the service
  }

  // Search articles by query
  @Get('search') // Define the route for searching articles
  async searchArticles(@Query('q') query: string) {
    return await this.articlesService.searchArticles(query); // Search articles based on the query parameter
  }

  // Get articles pending moderation
  @Get('moderation') // Define the route for getting articles pending moderation
  async getModerationQueue() {
    return await this.articlesService.getModerationQueue(); // Retrieve articles pending moderation
  }

  // Handle moderation of an article
  @Put('moderation/:id') // Define the route for moderating an article by ID
  async handleModeration(
    @Param('id') id: string, // Get the article ID from the route parameter
    @Body() body: { action: string }, // Get the action (approve/reject) from the request body
  ) {
    return await this.articlesService.handleModeration(id, body.action); // Pass the moderation action to the service
  }

  // Get articles pending analysis
  @Get('analysis') // Define the route for getting articles pending analysis
  async getAnalysisQueue() {
    return await this.articlesService.getAnalysisQueue(); // Retrieve articles pending analysis
  }

  // Analyze an article and save the result to the database
  @Put('analysis/:id') // Define the route for submitting analysis of an article by ID
  async submitAnalysis(
    @Param('id') id: string, // Get the article ID from the route parameter
    @Body() body: { analysisResult: string }, // Get the analysis result from the request body
  ) {
    return await this.articlesService.submitAnalysis(id, body.analysisResult); // Pass the analysis result to the service
  }
}
