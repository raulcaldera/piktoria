import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Request, Response } from 'express';

@Controller('/post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    /*Create*/
    @Post()
    @UseGuards(AuthGuard)
    async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request, @Res() res: Response) {
      let postRes = await this.postService.createPost(createPostDto, req);
      if (postRes.posted) {
        res.status(200).send(postRes);
      } else {
        res.send(postRes);
      }      
    }

    /*Read*/
    @Get()
    getAll()  {
      return this.postService.getAll();    
    }    

    @Get('/:id')
    getPostById(@Param('id') id: number)  {
      return this.postService.getPostById(id);    
    }

    @Get('/author/:authorId')
    getPostsByAuthorId(@Param('authorId') authorId: number)  {
      return this.postService.getPostsByAuthorId(authorId); 
    }
    
    /*Update*/
    @Put('/title')
    @UseGuards(AuthGuard)
    async updatePostTitle(@Body() updatedPost : { id: number , title: string}, @Req() req: Request, @Res() res: Response) {
      let postRes = await this.postService.updatePostTitle(updatedPost, req);
      if (postRes.updated) {
        res.status(200).send(postRes);
      } else {
        res.send(postRes);
      } 
    }

    @Put('/body')
    @UseGuards(AuthGuard)
    async updatePostBody(@Body() updatedPost : { id: number , body: string }, @Req() req: Request, @Res() res: Response) {
      let postRes = await this.postService.updatePostBody(updatedPost, req);
      if (postRes.updated) {
        res.status(200).send(postRes);
      } else {
        res.send(postRes);
      }   
    }  
  
    /*Delete*/
    @Delete('/:id')
    @UseGuards(AuthGuard)
    async deletePost(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
      let postRes = await this.postService.deletePost(id, req);
      if (postRes.deleted) {
        res.status(200).send(postRes);
      } else {
        res.send(postRes);
      }  
    }

}