import { Controller, Post, Get, Put, Body, Param, Query, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('submit')
  async submitArticle(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    try {
      // 从 Authorization 头部获取 JWT token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
      }

      // 解码 JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const submitterEmail = decoded.email; // 获取提交者的 email

      // 将 submitter 信息传递给服务层
      return await this.articlesService.submitArticle(createArticleDto, submitterEmail);
    } catch (error) {
      console.error('Error while submitting article:', error);  
      throw new HttpException('Failed to submit article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  // 获取所有文章
  @Get()
  async getAllArticles() {
    return await this.articlesService.findAll();  
  }

  @Get('search')
  async searchArticles(@Query('q') query: string) {
    return await this.articlesService.searchArticles(query);  
  }

  // 获取待审核的文章
  @Get('moderation')
  async getModerationQueue() {
    return await this.articlesService.getModerationQueue();
  }

  // 审核文章
  @Put('moderation/:id')
  async handleModeration(
    @Param('id') id: string,
    @Body() body: { action: string },
  ) {
    return await this.articlesService.handleModeration(id, body.action);
  }

  // 获取待分析的文章
  @Get('analysis')
  async getAnalysisQueue() {
    return await this.articlesService.getAnalysisQueue();
  }

  // 分析文章并存入数据库
  @Put('analysis/:id')
  async submitAnalysis(
    @Param('id') id: string,
    @Body() body: { analysisResult: string },
  ) {
    return await this.articlesService.submitAnalysis(id, body.analysisResult);
  }
}
