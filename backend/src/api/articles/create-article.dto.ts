import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  readonly title: string;

  @IsArray()
  readonly authors: string[];

  @IsString()
  readonly source: string;

  @IsNumber()
  readonly pubyear: number;

  @IsString()
  readonly doi: string;

  @IsString()
  readonly claim: string;

  @IsString()
  readonly evidence: string;
}
