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
    createPost(@Body() createPostDto: CreatePostDto) {
      return this.postService.createPost(createPostDto);
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
    updatePostTitle(@Body() updatedPost : { id: number , title: string}, @Req() req: Request) {
      return this.postService.updatePostTitle(updatedPost, req);
        
    }

    @Put('/body')
    @UseGuards(AuthGuard)
    updatePostBody(@Body() updatedPost : { id: number , body: string }, @Req() req: Request) {
      return this.postService.updatePostBody(updatedPost, req);  
    }  
  
    /*Delete*/
    @Delete('/:id')
    @UseGuards(AuthGuard)
    deletePost(@Param('id') id: number, @Req() req: Request) {
      return this.postService.deletePost(id, req);  
    }

}