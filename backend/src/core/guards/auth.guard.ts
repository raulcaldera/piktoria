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
			throw new UnauthorizedException("Not Authorized, No Cookie")  
		}

		let userAuth;

		try {
			userAuth = jwt.verify(authCookie,'shhhhh');
		} catch (err) {
			throw new UnauthorizedException("Not Authorized, Not Verified")    
		}

		request.userId = userAuth.userId; 
		return true;
	}
}