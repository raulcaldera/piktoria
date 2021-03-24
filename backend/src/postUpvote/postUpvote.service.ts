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

  async upvotePost(postUpvote: IPostUpvote) {
	let dbUpvote = await this.postUpvoteRepository.findOne({relations: ['post','user'],  where: { post : postUpvote.postId, user : postUpvote.userId}});

	if (dbUpvote !== undefined) {
		console.log("User has already upvoted this post");
		return {Upvoted: false, msg: "User has already upvoted this post"};		
	}

    let postUpvoteRelation = await this.postUpvoteRepository.save({}); 

	await getConnection()
	.createQueryBuilder()
	.relation(User, "postUpvote")
	.of(postUpvote.userId)         // We add into the user with this userId ...
	.add(postUpvoteRelation.id);     // ... a post upvote with this id	  

	return await getConnection()
	.createQueryBuilder()
	.relation(Post, "postUpvote")
	.of(postUpvote.postId)         // We add into the post with this userId ...
	.add(postUpvoteRelation.id);     // ... a post upvote with this id	  	  
  }  

  async getUpvoteById(id: number) {
    return await this.postUpvoteRepository.findOne({relations: ['post','user'],  where: { id : id }});
  }
   
  async getPostUpvotes(postId: number) {
    return await getConnection()
    .createQueryBuilder()
    .relation(Post, "postUpvote")
    .of(postId) 
    .loadMany(); 
  }

  async getPostUpvotesByUserId(userId: number) {
    return await getConnection()
    .createQueryBuilder()
    .relation(User, "postUpvote")
    .of(userId) 
    .loadMany(); 	  
  }

  async DownvotePost(id: number) {
    return await getConnection()
    .createQueryBuilder()
    .delete()
    .from(PostUpvote)
    .where("id = :id", { id: id })
    .execute();	  
  }
}