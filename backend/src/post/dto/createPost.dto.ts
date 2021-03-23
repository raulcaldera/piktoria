import { IsString, IsInt, IsDate } from 'class-validator';

export class CreatePostDto {
  @IsString() readonly title: string;
  @IsString() readonly body: string;
  @IsInt() readonly authorId: number;
  @IsDate() readonly timestamp: Date;  
}