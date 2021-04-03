import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PostUpvoteService } from './postUpvote.service';
import { CreatePostUpvoteDto } from '../postUpvote/dto/createPostUpvote.dto'
import { Request, Response } from 'express';

@Controller('/postupvotes')
export class PostUpvoteController {
    constructor(private readonly postUpvoteService: PostUpvoteService) {}

    /*Upvote Post*/
    @Post()
    @UseGuards(AuthGuard)
    async upvotePost(@Body() CreatePostUpvoteDto: CreatePostUpvoteDto, @Req() req: Request, @Res() res: Response) {
        let  upvoteRes = await this.postUpvoteService.upvotePost(CreatePostUpvoteDto, req);
        if (upvoteRes.upvoted) {
            res.status(200).send(upvoteRes);
        } else {
            res.send(upvoteRes);
        }

    }

    /*Get Upvote by Id*/
    @Get('/:id')
    getUpvoteById(@Param('id') id: number) {
        return this.postUpvoteService.getUpvoteById(id);
    }
    
    /*Get Post Upvotes*/
    @Get('/post/:postId')
    getPostUpvotes(@Param('postId') postId: number) {
        return this.postUpvoteService.getPostUpvotes(postId);
    }

    /*Get Post Upvotes By User*/
    @Get('/user/:userId')
    getPostUpvotesByUserId(@Param('userId') userId: number)  {
        return this.postUpvoteService.getPostUpvotesByUserId(userId);    
    }

    /*Downvote Post*/
    @Delete()
    @UseGuards(AuthGuard)
    async DownvotePost(@Body() CreatePostUpvoteDto: CreatePostUpvoteDto, @Req() req: Request, @Res() res: Response) {
        let  downvoteRes = await this.postUpvoteService.DownvotePost(CreatePostUpvoteDto, req);
        if (downvoteRes.downvoted) {
            res.status(200).send(downvoteRes);
        } else {
            res.send(downvoteRes);
        }
    }
    
}