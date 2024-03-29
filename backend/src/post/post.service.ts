import { Injectable, Inject } from '@nestjs/common';
import { IPost } from './interfaces/post.interface';
import { Repository, getConnection } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { PostUpvote } from 'src/postUpvote/postUpvote.entity';

@Injectable()
export class PostService { constructor(
		@Inject('POST_REPOSITORY')
		private postRepository: Repository<Post>
	) {}

	async createPost(post: IPost, req) {
		if (req.userId == post?.authorId) {
			try {
				let postRelation = await this.postRepository.save(post);

				await getConnection()
				.createQueryBuilder()
				.relation(User, "post")
				.of(post.authorId)         // We add into the user with this userId ...
				.add(postRelation.id);     // ... a post with this id

				return {posted: true, msg: "Post created"};
			} catch(err) {
					console.log('Error creating post: ' + err);
					return {posted: false, msg: err}; 
			}
		} else {
			return {posted: false, msg: "User not authorized to perform this operation"};	      
		}
	}

	async getAll() {
		return await this.postRepository.createQueryBuilder('post')
			.loadRelationCountAndMap('post.upvotes', 'post.postUpvote')
			.loadRelationCountAndMap('post.commentCount', 'post.comment')
			.leftJoinAndSelect('post.author', 'author', )
			.orderBy({timestamp: "DESC"})
			.getMany();
	}

	async getPostById(id: number) {
		/*return await this.postRepository.findOne({relations: ['author'],  where: { id : id }});*/
		return await this.postRepository.createQueryBuilder('post')
		.loadRelationCountAndMap('post.upvotes', 'post.postUpvote')
		.loadRelationCountAndMap('post.commentCount', 'post.comment')
		.leftJoinAndSelect('post.author', 'author',)
		.where('post.id = :id', { id : id })
		.getOne();
	}

	async getPostsByAuthorId(authorId: number) {
		/*return await this.postRepository.find({relations: ['author'],  where: { author : authorId }, order: {timestamp: "DESC"}});*/
		return await this.postRepository.createQueryBuilder('post')
		.loadRelationCountAndMap('post.upvotes', 'post.postUpvote')
		.loadRelationCountAndMap('post.commentCount', 'post.comment')
		.leftJoinAndSelect('post.author', 'author',)
		.where('post.authorId = :id', { id : authorId })
		.orderBy({timestamp: "DESC"})
		.getMany();
	}  

	async updatePostTitle(updatedPost : { id: number , title: string }, req) {
		let post = await this.postRepository.findOne({relations: ['author'],  where: { id : updatedPost.id }});

		if (req.userId == post?.author?.id) { 
			try {
				await getConnection()
				.createQueryBuilder()
				.update(Post)
				.set({ title: updatedPost.title })
				.where("id = :id", { id: updatedPost.id })
				.execute();
				return {updated: true, msg: "Post title updated"};
			} catch(err) {
					console.log('Error in updating post title: ' + err);
					return {updated: false, msg: err}; 
			}
		} else {
			return {updated: false, msg: "User not authorized to perform this operation"};	      
		}
	}

	async updatePostBody(updatedPost : { id: number , body: string }, req) {
		let post = await this.postRepository.findOne({relations: ['author'],  where: { id : updatedPost.id }});

		if (req.userId == post?.author?.id) {
			try {
				await getConnection()
				.createQueryBuilder()
				.update(Post)
				.set({ body: updatedPost.body })
				.where("id = :id", { id: updatedPost.id })
				.execute();
				return {updated: true, msg: "Post body updated"};
			} catch(err) {
					console.log('Error in updating post body: ' + err);
					return {updated: false, msg: err}; 
			}
		} else {
			return {updated: false, msg: "User not authorized to perform this operation"};	      
		}
	}  

	async deletePost(id: number, req) {
		let post = await this.postRepository.findOne({relations: ['author'],  where: { id : id }});

		if (req.userId == post?.author?.id) {
			try {
				await getConnection()
				.createQueryBuilder()
				.delete()
				.from(Post)
				.where("id = :id", { id: id })
				.execute();
				return {deleted: true, msg: "Post deleted"};
			} catch(err) {
					console.log('Error in deleting post: ' + err); 
					return {deleted: false, msg: err};
			}
		} else {
			return {deleted: false, msg: "User not authorized to perform this operation"};
		}
	}
}