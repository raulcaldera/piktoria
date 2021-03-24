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
            const jwt = await this.userService.signup(createUserDto);

            if (!jwt.signedUp) {
                res.send(jwt);
            }

            res.cookie('JWT', jwt, { maxAge: 900000, httpOnly: true });
            res.send({ signedUp: true });

        } catch (err) {
            console.log('Error in signUp: ' + err);
        }
    }

    /*Login*/
    @Post('/login')
    async login(@Body() user: { email: string, password: string }, @Res() res: Response) {
        try {
            const jwt = await this.userService.authenticate(user);

            if (!jwt) {
                res.send({ logedIn: false });
            }

            res.cookie('JWT', jwt, { maxAge: 900000, httpOnly: true });
            res.send({ logedIn: true });
        } catch (err) {
            console.log('Error in logIn: ' + err);
        }
    }

    /*Logout*/
    @Post('/logout')
    async logout(@Res() res: Response) {
        try {
            res.cookie('JWT', '', { maxAge: 0, httpOnly: true });
            return res.send();
        } catch (err) {
            console.log('Error in logOut: ' + err);
        }
    }

    /*Read*/
    @Get('/')
    getAll() {
        return this.userService.getAll();
    }

    @Get('/:id')
    getOneById(@Param('id') id: number) {
        return this.userService.getOneById(id);
    }

    /*Update*/
    @Put('/update/username')
    @UseGuards(AuthGuard)
    async updateUsername(@Body() updatedUser: { id: number, username: string}, @Req() req: Request) {
        let auth = await this.userService.verify(req.cookies?.JWT, updatedUser.id)

        if (auth) {
            return this.userService.updateUsername(updatedUser);
        } else {
            console.log('User not authorized to update this data');
            return false;
        }

    }

    @Put('/update/email')
    @UseGuards(AuthGuard)
    async updateEmail(@Body() updatedEmail: { id: number, email: string}, @Req() req: Request) {
        let auth = await this.userService.verify(req.cookies?.JWT, updatedEmail.id)

        if (auth) {
            return this.userService.updateEmail(updatedEmail);
        } else {
            console.log('User not authorized to update this data');
            return false;
        }
    }    

    /*Delete*/
    @Delete('/:id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id') id: number, @Req() req: Request) {
        let auth = await this.userService.verify(req.cookies?.JWT, id)

        if (auth) {        
            return this.userService.deleteUser(id);
        } else {
            console.log('User not authorized to delete this data');
            return false;
        }            
    }

}