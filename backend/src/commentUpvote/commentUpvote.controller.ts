import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CommentUpvoteService } from './commentUpvote.service';
import { CreateCommentUpvoteDto } from '../commentUpvote/dto/createCommentUpvote.dto'
import { Request, Response } from 'express';

@Controller('/commentupvotes')
export class CommentUpvoteController {
    constructor(private readonly CommentUpvoteService: CommentUpvoteService) {}

    /*Upvote Comment*/
    @Post()
    @UseGuards(AuthGuard)
    upvoteComment(@Body() CreateCommentUpvoteDto: CreateCommentUpvoteDto, @Req() req: Request) {
        return this.CommentUpvoteService.upvoteComment(CreateCommentUpvoteDto, req);
    }

    /*Get Upvote by Id*/
    @Get('/:id')
    getUpvoteById(@Param('id') id: number) {
        return this.CommentUpvoteService.getUpvoteById(id);
    }
    
    /*Get Comment Upvotes*/
    @Get('/comment/:commentId')
    getCommentUpvotes(@Param('commentId') commentId: number) {
        return this.CommentUpvoteService.getCommentUpvotes(commentId);
    }

    /*Get Comment Upvotes By User*/
    @Get('/user/:userId')
    getCommentUpvotesByUserId(@Param('userId') userId: number)  {
        return this.CommentUpvoteService.getCommentUpvotesByUserId(userId);    
    }

    /*Downvote Comment*/
    @Delete()
    @UseGuards(AuthGuard)
    DownvoteComment(@Body() CreateCommentUpvoteDto: CreateCommentUpvoteDto, @Req() req: Request) {
        return this.CommentUpvoteService.DownvoteComment(CreateCommentUpvoteDto, req);
    }    

}