import { Injectable, Inject } from '@nestjs/common';
import { IPostUpvote } from '../postUpvote/interfaces/postUpvote.interface';
import { Repository, getConnection } from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { PostUpvote } from '../postUpvote/postUpvote.entity';

var jwt = require('jsonwebtoken');

@Injectable()
export class PostUpvoteService {  constructor(
    @Inject('POSTUPVOTE_REPOSITORY')
    private postUpvoteRepository: Repository<PostUpvote>
  ) {}

  async likePost(postUpvote: IPostUpvote) {
    let postUpvoteRelation = await this.postUpvoteRepository.save({}); 

	await getConnection()
	.createQueryBuilder()
	.relation(User, "postUpvote")
	.of(postUpvote.userId)         // We add into the user with this userId ...
	.add(postUpvoteRelation.id);     // ... a post with this id	  

	return await getConnection()
	.createQueryBuilder()
	.relation(Post, "postUpvote")
	.of(postUpvote.postId)         // We add into the user with this userId ...
	.add(postUpvoteRelation.id);     // ... a post with this id	  	  
  }  
}