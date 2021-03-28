import { Injectable, Inject } from '@nestjs/common';
import { IComment } from './interfaces/comment.interface';
import { Repository, getConnection, Connection } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

var jwt = require('jsonwebtoken');

@Injectable()
export class CommentService {
    constructor(
        @Inject('COMMENT_REPOSITORY')
        private commentRepository: Repository<Comment>
    ) {}

	async verify(authCookie, userId) {
		let userAuth = await jwt.verify(authCookie,'shhhhh');

		if (userAuth.userId == userId) {
			return true;
		}

		return false;
	}

	async postComment(comment: IComment, req) {
		let auth = await this.verify(req.cookies?.JWT, comment.userId);

		if (auth) {
			const post = await this.commentRepository.findOne({relations: ['post','user'],  where: { post : comment.postId }});
			
			if (post !== undefined) {
				try {
					let commentRelation = await this.commentRepository.save(comment);
				
					await getConnection()
					.createQueryBuilder()
					.relation(Post, "comment")
					.of(comment.postId)         // We add into the post with this postId ...
					.add(commentRelation.id);   // ... a comment with this id
				
					await getConnection()
					.createQueryBuilder()
					.relation(User, "comment")
					.of(comment.userId)         // We add into the user with this userId ...
					.add(commentRelation.id);   // ... a comment with this id 

					return {posted: true, msg: "Comment created"};
				} catch(err) {

					console.log('Error posting comment: ' + err);

					return {posted: false, msg: err}; 
				}
			} else {
				return {posted: false, msg: "This post does not exist"};	      
			}
	  } else {
       		return {posted: false, msg: "User not authorized to perform this operation"};	      
	  }
	}
	
	async getCommentById(id: number) {
		return await this.commentRepository.findOne({relations: ['post','user'],  where: { id : id }});
	}

	async getCommentByPostId(postId: number) {
		return await this.commentRepository.find({relations: ['post','user'],  where: { post : postId }}); 
	}

	async getCommentByUserId(userId: number) {
		return await this.commentRepository.find({relations: ['post','user'],  where: { user : userId }}); 
	}	  

	async updateComment(updatedComment : {id: number , comment: string }, req) {
		let comment = await this.commentRepository.findOne({relations: ['post','user'],  where: { id : updatedComment.id }});
		let auth = await this.verify(req.cookies?.JWT, comment.user.id);

		if (auth) { 
			try {
				await getConnection()
				.createQueryBuilder()
				.update(Comment)
				.set({ comment: updatedComment.comment })
				.where("id = :id", { id: updatedComment.id })
				.execute();

				return {updated: true, msg: "Comment updated"};
			} catch(err) {
				return {updated: false, msg: err};
			} 
		} else {
			return {updated: false, msg: "User not authorized to perform this operation"};
		}
	}

	async deleteComment(id: number, req) {
		let comment = await this.commentRepository.findOne({relations: ['post','user'],  where: { id : id }});
		let auth = await this.verify(req.cookies?.JWT, comment.user.id);

		if (auth) { 
			try {		
				await getConnection()
				.createQueryBuilder()
				.delete()
				.from(Comment)
				.where("id = :id", { id: id })
				.execute();
				return {deleted: true, msg: "Comment deleted"};
			} catch(err) {
				return {deleted: false, msg: err};
			} 
		} else {
			return {deleted: false, msg: "User not authorized to perform this operation"};
		}			
	}

}