import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { DatabaseModule } from '../database/database.module';
import { commentProviders } from './comment.providers';
import { userProviders } from '../user/user.providers';
import { postProviders } from '../post/post.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService, ...commentProviders, ...userProviders, ...postProviders]
})
export class CommentModule {}