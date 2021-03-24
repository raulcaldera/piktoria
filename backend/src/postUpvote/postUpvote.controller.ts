import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PostUpvoteService } from './postUpvote.service';
import { CreatePostUpvoteDto } from '../postUpvote/dto/createPostUpvote.dto'
import { Request, Response } from 'express';

@Controller('/postupvotes')
export class PostUpvoteController {
    constructor(private readonly postUpvoteService: PostUpvoteService) {}

    /*Like Post*/
    @Post()
    @UseGuards(AuthGuard)
    likePost(@Body() CreatePostUpvoteDto: CreatePostUpvoteDto) {
        return this.postUpvoteService.likePost(CreatePostUpvoteDto);
    }

    /*Get Post Likes*/
    @Get('/:id')
    getPostLikes(@Param('id') id: number) {
        return this.postUpvoteService.getPostLikes(id);
    }

    /*Get Post Likes By User*/
    @Get('/user/:userId')
    getPostLikesByUserId(@Param('authorId') userId: number)  {
            return this.postUpvoteService.getPostLikesByUserId(authorId);    
    }

    /*Unlike Post*/
    @Delete()
    @UseGuards(AuthGuard)
    UnlikePost(@Body() CreatePostUpvoteDto: CreatePostUpvoteDto) {
        return this.postUpvoteService.UnlikePost(CreatePostUpvoteDto);
    }
    
}