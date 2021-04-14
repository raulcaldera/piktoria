import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PostUpvoteController } from './postUpvote.controller';
import { PostUpvoteService } from './postUpvote.service';
import { postUpvoteProviders } from './postUpvote.providers';
import { userProviders } from '../user/user.providers';
import { postProviders } from '../post/post.providers';


@Module({
	imports: [DatabaseModule],
	controllers: [PostUpvoteController],
	providers: [PostUpvoteService, ...postUpvoteProviders, ...userProviders, ...postProviders]
	})
	export class PostUpvoteModule {}