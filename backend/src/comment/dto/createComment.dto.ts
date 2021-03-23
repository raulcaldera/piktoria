import { IsString, IsInt, IsDate } from 'class-validator';

export class CreateCommentDto {
  @IsString() readonly comment: string;
  @IsInt() readonly postId: number;
  @IsInt() readonly userId: number;
  @IsDate() readonly timestamp: Date;  
}