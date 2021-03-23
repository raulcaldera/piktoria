import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Res} from '@nestjs/common';
//import { AuthGuard } from 'src/core/guards/auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Request, Response } from 'express';


@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
}