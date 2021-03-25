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

  async verify(authCookie, userId) {
		let userAuth = await jwt.verify(authCookie,'shhhhh');

		if (userAuth.userId == userId) {
			return true;
		}

		return false;
	}

  async upvotePost(postUpvote: IPostUpvote, req) {
    let auth = await this.verify(req.cookies?.JWT, postUpvote.userId);

    if (auth) {
      let dbUpvote = await this.postUpvoteRepository.findOne({relations: ['post','user'],  where: { post : postUpvote.postId, user : postUpvote.userId}});

      if (dbUpvote !== undefined) {
        console.log("User has already upvoted this post");
        return {upvoted: false, postUpvoteId: false, msg: "User has already upvoted this post"};		
      }

      try {
        let postUpvoteRelation = await this.postUpvoteRepository.save({}); 

        await getConnection()
        .createQueryBuilder()
        .relation(User, "postUpvote")
        .of(postUpvote.userId)         // We add into the user with this userId ...
        .add(postUpvoteRelation.id);     // ... a post upvote with this id	  
      
        await getConnection()
        .createQueryBuilder()
        .relation(Post, "postUpvote")
        .of(postUpvote.postId)         // We add into the post with this userId ...
        .add(postUpvoteRelation.id);     // ... a post upvote with this id	  	
        
        return {upvoted: true, postUpvoteId: postUpvoteRelation.id, msg: "Post Upvoted"};	
      } catch(err) {
          console.log('Error upvoting post: ' + err);
          return {upvoted: false, postUpvoteId: false, msg: err};	            
      }
    } else {
	  	  return {upvoted: false, postUpvoteId: false, msg: "User not authorized to perform this operation"};	      
    }
  }  

  async getUpvoteById(id: number) {
    return await this.postUpvoteRepository.findOne({relations: ['post','user'],  where: { id : id }});
  }
   
  async getPostUpvotes(postId: number) {
    const upvotes = await this.postUpvoteRepository.find({relations: ['post','user'],  where: { post : postId }});
    return {postId : postId, postUpvoteCount: upvotes.length , upvotes : upvotes}
    
  }

  async getPostUpvotesByUserId(userId: number) {
    const upvotes = await this.postUpvoteRepository.find({relations: ['post','user'],  where: { user : userId }});
    return {userId : userId, postUpvoteCount: upvotes.length , upvotes : upvotes}

  }

  async DownvotePost(postDownvote: IPostUpvote, req) {
    let auth = await this.verify(req.cookies?.JWT, postDownvote.userId);
    
    if (auth) {
      try {
        let dbDownvote = await this.postUpvoteRepository.findOne({relations: ['post','user'],  where: { post : postDownvote.postId, user : postDownvote.userId}});

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(PostUpvote)
        .where("id = :id", { id: dbDownvote.id })
        .execute();	

        return {downvoted: true, msg: "Post Downvoted"};	
      } catch(err) {
          console.log('Error downvoting post: ' + err);
          return {downvoted: false, msg: err};	
      }           
    } else {
      return {downvoted: false, msg: "User not authorized to perform this operation"};	      
    }
  }

}