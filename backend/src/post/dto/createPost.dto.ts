import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreatePostDto {
	@IsString() readonly title: string;
	@IsString() readonly body: string;
	@IsInt() readonly authorId: number;
	@IsDateString() readonly timestamp: Date;
}