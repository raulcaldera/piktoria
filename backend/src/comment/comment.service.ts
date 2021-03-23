import { Injectable, Inject } from '@nestjs/common';
import { IComment } from './interfaces/comment.interface';
import { Repository, getConnection, Connection } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CommentService {
    constructor(
        @Inject('COMMENT_REPOSITORY')
        private commentRepository: Repository<Comment>
      ) {}
}