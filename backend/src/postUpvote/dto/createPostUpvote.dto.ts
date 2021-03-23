import { IsString, IsInt, IsDate } from 'class-validator';

export class CreatePostUpvoteDto {
  @IsInt() readonly postId: number;
  @IsInt() readonly userId: number;
}