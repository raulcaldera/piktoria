import { Module } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { LikeModule } from './like/like.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CommentModule, PostModule, UserModule, LikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
