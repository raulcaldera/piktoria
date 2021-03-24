import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';


@Controller('/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}
}