import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { Request, Response } from 'express';


@Controller('/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(AuthGuard)
    async postComment(@Body() createCommentDto: CreateCommentDto, @Req() req: Request, @Res() res: Response) {
      let  commentRes = await this.commentService.postComment(createCommentDto, req);
      if (commentRes.posted) {
        res.status(200).send(commentRes);
      } else {
        res.send(commentRes);
      }
    }
  
    @Get('/:id')
    getCommentById(@Param('id') id: number)  {
      return this.commentService.getCommentById(id);    
    }
  
    @Get('/post/:postId')
    getCommentByPostId(@Param('postId') postId: number)  {
      return this.commentService.getCommentByPostId(postId);    
    }

    @Get('/user/:userId')
    getCommentByUserId(@Param('userId') userId: number)  {
      return this.commentService.getCommentByUserId(userId);    
    }    
  
    @Put()
    @UseGuards(AuthGuard)
    updateComment(@Body() updatedComment : {id: number , comment: string }, @Req() req: Request) {
      return this.commentService.updateComment(updatedComment, req);  
    }
  
    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteComment(@Param('id') id: number, @Req() req: Request) {
      return this.commentService.deleteComment(id, req);  
    }    
}