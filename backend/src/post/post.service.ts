import { Injectable, Inject } from '@nestjs/common';
import { IPost } from './interfaces/post.interface';
import { Repository, getConnection } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';

var jwt = require('jsonwebtoken');

@Injectable()
export class PostService {  constructor(
    @Inject('POST_REPOSITORY')
    private postRepository: Repository<Post>
  ) {}

  async verify(authCookie, userId) {
		let userAuth = await jwt.verify(authCookie,'shhhhh');

		if (userAuth.userId == userId) {
			return true;
		}

		return false;
	}

  async createPost(post: IPost) {
    let postRelation = await this.postRepository.save(post);

    return await getConnection()
    .createQueryBuilder()
    .relation(User, "post")
    .of(post.authorId)         // We add into the user with this userId ...
    .add(postRelation.id);     // ... a post with this id
  }

  async getAll() {
    return await this.postRepository.find({relations: ['author']});
  }

  async getPostById(id: number) {
    return await this.postRepository.findOne({relations: ['author'],  where: { id : id }});
  }

  async getPostsByAuthorId(authorId: number) {
    return await getConnection()
    .createQueryBuilder()
    .relation(User, "post")
    .of(authorId) 
    .loadMany();
  }  

  async updatePostTitle(updatedPost : { id: number , title: string }, req) {
    let post = await this.postRepository.findOne({relations: ['author'],  where: { id : updatedPost.id }});
	let auth = await this.verify(req.cookies?.JWT, post.author);

    if (auth) { 
      return await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title: updatedPost.title })
      .where("id = :id", { id: updatedPost.id })
      .execute();
    } else {
		console.log("User not authorized to perform this operation");
		return {updated: false, msg: "Unauthorized"};	      
    }
  }

  async updatePostBody(updatedPost : { id: number , body: string }, req) {
	let post = await this.postRepository.findOne({relations: ['author'],  where: { id : updatedPost.id }});
	let auth = await this.verify(req.cookies?.JWT, post.author);

    if (auth) { 
		return await getConnection()
		.createQueryBuilder()
		.update(Post)
		.set({ body: updatedPost.body })
		.where("id = :id", { id: updatedPost.id })
		.execute();
    } else {
		console.log("User not authorized to perform this operation");
		return {updated: false, msg: "Unauthorized"};	      
    }
  }  

  async deletePost(id: number, req) {
	let post = await this.postRepository.findOne({relations: ['author'],  where: { id : id }});
	let auth = await this.verify(req.cookies?.JWT, post.author);

    if (auth) { 
		return await getConnection()
		.createQueryBuilder()
		.delete()
		.from(Post)
		.where("id = :id", { id: id })
		.execute();
    } else {
		console.log("User not authorized to perform this operation");
		return {deleted: false, msg: "Unauthorized"};	      
    }
  }

}