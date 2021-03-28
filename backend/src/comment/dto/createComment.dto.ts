import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateCommentDto {
  @IsString() readonly comment: string;
  @IsInt() readonly postId: number;
  @IsInt() readonly userId: number;
  @IsDateString() readonly timestamp: Date;  
}