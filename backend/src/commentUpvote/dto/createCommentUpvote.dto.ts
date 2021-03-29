import { IsString, IsInt, IsDate } from 'class-validator';

export class CreateCommentUpvoteDto {
  @IsInt() readonly commentId: number;
  @IsInt() readonly userId: number;
}