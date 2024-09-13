import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  // 提交文章并设置状态为 `pending_moderation`
  async submitArticle(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel({
      ...createArticleDto,
      updated_date: new Date(),
      status: 'pending_moderation',  // 初始状态为待审核
    });
    return createdArticle.save();
  }


  // 获取所有文章
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

   // 获取待审核的文章
   async getModerationQueue(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending_moderation' }).exec();
  }

  async searchArticles(query: string): Promise<Article[]> {
    return this.articleModel.find({ title: new RegExp(query, 'i') }).exec();  // 使用正则表达式进行标题搜索
  }

  // 审核文章 (通过则进入 `pending_analysis` 状态)
  async handleModeration(id: string, action: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (action === 'approve') {
      article.status = 'pending_analysis';
    } else if (action === 'reject') {
      article.status = 'rejected';
    }
    return article.save();
  }

  // 获取待分析的文章
  async getAnalysisQueue(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending_analysis' }).exec();
  }

  // 分析文章并存入数据库，状态设置为 `approved`
  async submitAnalysis(id: string, analysisResult: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    article.status = 'approved';
    article.analysisResult = analysisResult;
    return article.save();
  }
}