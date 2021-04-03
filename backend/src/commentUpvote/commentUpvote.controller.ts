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
    async upvoteComment(@Body() CreateCommentUpvoteDto: CreateCommentUpvoteDto, @Req() req: Request, @Res() res: Response) {
        let  upvoteRes = await this.CommentUpvoteService.upvoteComment(CreateCommentUpvoteDto, req);
        if (upvoteRes.upvoted) {
            res.status(200).send(upvoteRes);
        } else {
            res.send(upvoteRes);
        }
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
    async DownvoteComment(@Body() CreateCommentUpvoteDto: CreateCommentUpvoteDto, @Req() req: Request, @Res() res: Response) {
        let  downvoteRes = await this.CommentUpvoteService.DownvoteComment(CreateCommentUpvoteDto, req);
        if (downvoteRes.downvoted) {
            res.status(200).send(downvoteRes);
        } else {
            res.send(downvoteRes);
        }        
    }    

}