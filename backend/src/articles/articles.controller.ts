import { Controller, Post, Get, Put, Body, Param, Query  } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('submit')
  async submitArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      console.log('Received Article:', createArticleDto);  // 输出接收到的文章数据
      return await this.articlesService.submitArticle(createArticleDto);
    } catch (error) {
      console.error('Error while submitting article:', error);  // 输出错误信息
      throw new HttpException('Failed to submit article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  // 获取所有文章
  @Get()
  async getAllArticles() {
    return await this.articlesService.findAll();  // 确保该路由返回所有文章
  }

  @Get('search')
  async searchArticles(@Query('q') query: string) {
    return await this.articlesService.searchArticles(query);  // 使用服务进行搜索
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