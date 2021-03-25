import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CommentUpvoteController } from './commentUpvote.controller';
import { CommentUpvoteService } from './commentUpvote.service';
import { commentUpvoteProviders } from './commentUpvote.providers';
import { userProviders } from '../user/user.providers';
import { postProviders } from '../post/post.providers';
import { commentProviders } from '../comment/comment.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentUpvoteController],
  providers: [CommentUpvoteService, ...commentUpvoteProviders, ...userProviders, ...postProviders, ...commentProviders]
  })
  export class CommentUpvoteModule {}