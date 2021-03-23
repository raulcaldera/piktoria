import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { postUpvoteProviders } from './postUpvote.providers';
import { userProviders } from '../user/user.providers';
import { postProviders } from '../post/post.providers';


@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...postUpvoteProviders, ...userProviders, ...postProviders]
  })
  export class PostUpvoteModule {}