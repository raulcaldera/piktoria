import { IsInt } from 'class-validator';

export class CreatePostUpvoteDto {
	@IsInt() readonly postId: number;
	@IsInt() readonly userId: number;
}