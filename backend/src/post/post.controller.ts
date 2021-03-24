import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';


@Controller('/post')
export class PostController {
    constructor(private readonly postService: PostService) {}
}