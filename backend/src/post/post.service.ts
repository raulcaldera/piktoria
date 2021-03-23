import { Injectable, Inject } from '@nestjs/common';
import { IPost } from './interfaces/post.interface';
import { Repository, getConnection } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {}