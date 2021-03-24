import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PostUpvoteService } from './postUpvote.service';
import { CreatePostUpvoteDto } from '../postUpvote/dto/createPostUpvote.dto'

@Controller('/postupvotes')
export class PostUpvoteController {
    constructor(private readonly postUpvoteService: PostUpvoteService) {}

    /*Upvote Post*/
    @Post()
    @UseGuards(AuthGuard)
    upvotePost(@Body() CreatePostUpvoteDto: CreatePostUpvoteDto) {
        return this.postUpvoteService.upvotePost(CreatePostUpvoteDto);
    }

    /*Get Upvote by Id*/
    @Get('/:id')
    getUpvoteById(@Param('id') id: number) {
        return this.postUpvoteService.getUpvoteById(id);
    }
    
    /*Get Post Upvotes*/
    @Get('/:postId')
    getPostUpvotes(@Param('postId') postId: number) {
        return this.postUpvoteService.getPostUpvotes(postId);
    }

    /*Get Post Upvotes By User*/
    @Get('/user/:userId')
    getPostUpvotesByUserId(@Param('authorId') userId: number)  {
        return this.postUpvoteService.getPostUpvotesByUserId(userId);    
    }

    /*Downvote Post*/
    @Delete('/:id')
    @UseGuards(AuthGuard)
    DownvotePost(@Param('id') id: number) {
        return this.postUpvoteService.DownvotePost(id);
    }
    
}