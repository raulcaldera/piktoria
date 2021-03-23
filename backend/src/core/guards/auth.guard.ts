import { Injectable, CanActivate, ExecutionContext, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
var jwt = require('jsonwebtoken');

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    var authCookie = request.cookies?.JWT;

    if ( !authCookie ) {
        throw new UnauthorizedException("Nice token try :)")  
    }

    let userAuth;

    try {
        userAuth = jwt.verify(authCookie,'shhhhh');
    } catch (err) {
        throw new UnauthorizedException("Nice token try :)")    
    }

    console.log(userAuth);

    request.userId =  userAuth.userId; 
    return true;

  }
}