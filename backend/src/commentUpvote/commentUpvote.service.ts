import { Injectable, Inject } from '@nestjs/common';
import { ICommentUpvote } from '../commentUpvote/interfaces/commentUpvote.interface';
import { Repository, getConnection } from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { CommentUpvote } from '../commentUpvote/commentUpvote.entity';

var jwt = require('jsonwebtoken');

@Injectable()
export class CommentUpvoteService {  constructor(
        @Inject('COMMENTUPVOTE_REPOSITORY')
        private commentUpvoteRepository: Repository<CommentUpvote>
    ) {}

    async verify(authCookie, userId) {
        let userAuth = await jwt.verify(authCookie,'shhhhh');

        if (userAuth.userId == userId) {
            return true;
        }

        return false;
    }

    async upvoteComment(commentUpvote: ICommentUpvote, req) {
        let auth = await this.verify(req.cookies?.JWT, commentUpvote.userId);

        if (auth) {
            let dbUpvote = await this.commentUpvoteRepository.findOne({
                relations: ['post','user','comment'],  
                where: { post : commentUpvote.postId, user : commentUpvote.userId, comment : commentUpvote.commentId }
            });

            if (dbUpvote !== undefined) {
            console.log("User has already upvoted this comment");
            return {upvoted: false, commentUpvoteId: false, msg: "User has already upvoted this comment"};		
            }

            try {
                var commentUpvoteRelation = await this.commentUpvoteRepository.save({}); 

                await getConnection()
                .createQueryBuilder()
                .relation(User, "commentUpvote")
                .of(commentUpvote.userId)         // We add into the user with this userId ...
                .add(commentUpvoteRelation.id);     // ... a comment upvote with this id	  
                
                await getConnection()
                .createQueryBuilder()
                .relation(Post, "commentUpvote")
                .of(commentUpvote.postId)         // We add into the post with this postId ...
                .add(commentUpvoteRelation.id);     // ... a comment upvote with this id	  
                
                await getConnection()
                .createQueryBuilder()
                .relation(Comment, "commentUpvote")
                .of(commentUpvote.commentId)         // We add into the comment with this commentId ...
                .add(commentUpvoteRelation.id);     // ... a comment upvote with this id	
                
                return {upvoted: true, commentUpvoteId: commentUpvoteRelation.id, msg: "Comment Upvoted"};	
            } catch(err) {
                console.log('Error upvoting comment: ' + err);
				await this.commentUpvoteRepository.delete({id: commentUpvoteRelation.id});
                return {upvoted: false, commentUpvoteId: false, msg: err};	            
            }
        } else {
            return {upvoted: false, commentUpvoteId: false, msg: "User not authorized to perform this operation"};	      
        }
    }  

    async getUpvoteById(id: number) {
        return await this.commentUpvoteRepository.findOne({relations: ['post','user','comment'],  where: { id : id }});
    }
    
    async getCommentUpvotes(commentId: number) {
        const upvotes = await this.commentUpvoteRepository.find({relations: ['post','user','comment'],  where: { comment : commentId }});
        return {commentId : commentId, commentUpvoteCount: upvotes.length , upvotes : upvotes}
    
    }

    async getCommentUpvotesByUserId(userId: number) {
        const upvotes = await this.commentUpvoteRepository.find({relations: ['post','user','comment'],  where: { user : userId }});
        return {userId : userId, commentUpvoteCount: upvotes.length , upvotes : upvotes}

    }

    async DownvoteComment(commentDownvote: ICommentUpvote, req) {
        let auth = await this.verify(req.cookies?.JWT, commentDownvote.userId);
        
        if (auth) {
            try {
                let dbDownvote = await this.commentUpvoteRepository.findOne({
                    relations: ['post','user','comment'],  
                    where: { post : commentDownvote.postId, user : commentDownvote.userId, comment : commentDownvote.commentId }
                });

                if (dbDownvote == undefined) {
                    console.log("Nothing to downvote");
                    return {downvoted: false, msg: "Nothing to downvote"};		
                }

                /*await getConnection()
                .createQueryBuilder()
                .delete()
                .from(CommentUpvote)
                .where("id = :id", { id: dbDownvote.id })
                .execute();*/
                
				await this.commentUpvoteRepository.delete({id: dbDownvote.id});
                return {downvoted: true, msg: "Comment Downvoted"};	
            } catch(err) {
                console.log('Error downvoting comment: ' + err);
                return {downvoted: false, msg: err};	
            }           
        } else {
            return {downvoted: false, msg: "User not authorized to perform this operation"};	      
        }
    }
 
}