import { Injectable, Inject } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { Repository, getConnection } from 'typeorm';
import { User } from './user.entity';
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
	constructor(
    	@Inject('USER_REPOSITORY')
    	private userRepository: Repository<User>,
  	) { }

  	async createJwt(userId, username) {
    	const payload = { userId, username };
    	return await jwt.sign(payload, 'shhhhh', {
      		expiresIn: 10000000000000
    	});
  	}

	async verify(authCookie, userId) {
		let userAuth = await jwt.verify(authCookie,'shhhhh');

		if (userAuth.userId == userId) {
			return true;
		}

		return false;
	}

	/*SignUp*/
	async signup(user: IUser) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(user.password, salt);
		const dbUser = await this.userRepository.findOne({username: user?.username});
		const dbEmail = await this.userRepository.findOne({email: user?.email});
	
		if (dbUser !== undefined) {
			return {signedUp: false, jwt: false , msg: "User already exists"};
		}

		if (dbEmail !== undefined) {
			return {signedUp: false, jwt: false , msg: "Email already exists"};
		}
	
		user.password = hashedPassword;
		const insertedUser = await this.userRepository.save(user);
	
		if (!insertedUser) {
			return {signedUp: false, jwt: false, msg: "User creation error"};
		}

		const token = await this.createJwt(insertedUser.id, insertedUser.username);
		return {signedUp: true, jwt: token, msg: "Signed Up!"};
	
	  }

	/*Login*/
	async authenticate(user){
		const dbUser = await this.userRepository.findOne({email: user?.email});

		if (dbUser) {
			const validPassword = await bcrypt.compare(user.password, dbUser.password);
			if (validPassword) {
				const token = await this.createJwt(dbUser.id, dbUser.username);
				return {logedIn: true, jwt: token, msg: "Loged In!"};
			} else {
				return {logedIn: false, jwt: false, msg: "Invalid password"};
			}
		}

		return {logedIn: false, jwt: false, msg: "User not found"};
	}  

	/*Read*/
	async getAll() {
		return await this.userRepository.find({});
	}

	async getOneById(id: number) {
		return await this.userRepository.findOne({ id: id });
	}

	/*Update Username*/
	async updateUsername(updatedUser : {id: number , username: string}, req) {
		let auth = await this.verify(req.cookies?.JWT, updatedUser.id)

		if (auth) {
			const dbUser = await this.userRepository.findOne({username: updatedUser?.username});

			if (dbUser !== undefined) {
				return {updated: false, msg: "This username already exists"};
			}
	
			await getConnection()
			.createQueryBuilder()
			.update(User)
			.set({ username: updatedUser.username })
			.where("id = :id", { id: updatedUser.id })
			.execute();

			return {updated: true, msg: "Username updated"};

		} else {
			return {updated: false, msg: "Unauthorized"};	
		}

	}

	/*Update Email*/
	async updateEmail(updatedEmail : {id: number, email:string}, req) {
		let auth = await this.verify(req.cookies?.JWT, updatedEmail.id);

		if (auth) {
			const dbUser = await this.userRepository.findOne({email: updatedEmail?.email});

			if (dbUser !== undefined) {
				return {updated: false, msg: "This email already exists"};
			}

			await getConnection()
			.createQueryBuilder()
			.update(User)
			.set({ email: updatedEmail.email })
			.where("id = :id", { id: updatedEmail.id })
			.execute();

			return {updated: true, msg: "Email updated"};

		} else {
			return {updated: false, msg: "Unauthorized"};			
		}
	}

	/*Delete*/
	async deleteUser(id: number, req) {
		let auth = await this.verify(req.cookies?.JWT, id);
		
		if (auth) { 
			await getConnection()
			.createQueryBuilder()
			.delete()
			.from(User)
			.where("id = :id", { id: id })
			.execute();

			return {deleted: true, msg: "User deleted"};		
		} else {
			return {deleted: false, msg: "Unauthorized"};		
		}	
	}

}