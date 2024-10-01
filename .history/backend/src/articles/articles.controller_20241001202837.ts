import { Controller, Post, Get, Put, Body, Param, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Submit an article
  @Post('submit')
  async submitArticle(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    try {
      // Get JWT token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
      }

      // Decode JWT token with a type assertion to ensure it's of type JwtPayload
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // Make sure the decoded token is not a string and contains the email property
      if (typeof decoded === 'object' && 'email' in decoded) {
        const submitterEmail = decoded.email;

        // Pass submitter information to the service layer
        return await this.articlesService.submitArticle(createArticleDto, submitterEmail);
      } else {
        throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.error('Error while submitting article:', error.message);
      throw new HttpException('Failed to submit article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
