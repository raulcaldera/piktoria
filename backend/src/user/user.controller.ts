import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Request, Response } from 'express';

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /*Signup*/
    @Post('/signup')
    async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const signupRes = await this.userService.signup(createUserDto);

            if (!signupRes.jwt) {
                res.send(signupRes);
            }

            res.cookie('JWT', signupRes.jwt, { maxAge: 900000, httpOnly: true });
            res.status(200).send(signupRes);
        } catch (err) {
            console.log('Error in signUp: ' + err);
        }
    }

    /*Login*/
    @Post('/login')
    async login(@Body() user: { email: string, password: string }, @Res() res: Response) {
        try {
            const loginRes = await this.userService.authenticate(user);

            if (!loginRes.jwt) {
                res.send(loginRes);
            }

            res.cookie('JWT', loginRes.jwt, { maxAge: 900000, httpOnly: true });
            res.status(200).send(loginRes);
        } catch (err) {
            console.log('Error in logIn: ' + err);
        }
    }

    /*Logout*/
    @Post('/logout')
    async logout(@Res() res: Response) {
        try {
            res.cookie('JWT', '', { maxAge: 0, httpOnly: true });
            return res.status(200).send({logedOut: true, msg: "User loged out"});
        } catch (err) {
            console.log('Error in logOut: ' + err);
            return res.send({logedOut: false, msg: err});
        }
    }

    /*Read*/
    @Get('/')
    @UseGuards(AuthGuard)
    getAll() {
        return this.userService.getAll();
    }

    @Get('/:id')
    getOneById(@Param('id') id: number) {
        return this.userService.getOneById(id);
    }

    /*Update*/
    @Put('/username')
    @UseGuards(AuthGuard)
    updateUsername(@Body() updatedUser: { id: number, username: string}, @Req() req: Request) {
        return this.userService.updateUsername(updatedUser, req);
    }

    @Put('/email')
    @UseGuards(AuthGuard)
    updateEmail(@Body() updatedEmail: { id: number, email: string}, @Req() req: Request) {
        return this.userService.updateEmail(updatedEmail, req);
    }    

    /*Delete*/
    @Delete('/:id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        try {
            let msg = await this.userService.deleteUser(id, req);
            if (msg.deleted) {
                res.cookie('JWT', '', { maxAge: 0, httpOnly: true });
            }
            return res.send(msg)
        } catch (err) {
            console.log('Error in logOut: ' + err);
            return res.send({deleted: false, msg: err});
        }      
        
    }

}