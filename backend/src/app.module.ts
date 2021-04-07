import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { PostUpvoteModule } from './postUpvote/postUpvote.module';
import { CommentUpvoteModule } from './commentUpvote/commentUpvote.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    CommentModule, PostModule, UserModule, PostUpvoteModule, CommentUpvoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
