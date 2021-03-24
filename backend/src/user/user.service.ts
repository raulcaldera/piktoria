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
	
		if (dbUser !== undefined) {
			console.log("User already exists");
			return {signedUp: false, msg: "User already exists"};
		}
	
		user.password = hashedPassword;
		const insertedUser = await this.userRepository.save(user);
	
		if (!insertedUser) 	return {signedUp: false, msg: "User creation error"};
		return await {signedUp: this.createJwt(insertedUser.id, insertedUser.username)};
	
	  }

	/*Login*/
	async authenticate(user){
		const dbUser = await this.userRepository.findOne({email: user?.email});

		if (dbUser) {
			const validPassword = await bcrypt.compare(user.password, dbUser.password);
			
			if (validPassword) {
				return await this.createJwt(dbUser.id, dbUser.username);
			}
		}

		return false;
	}  

	/*Read*/

	async getAll() {
		return await this.userRepository.find({});
	}

	async getOneById(id: number) {
		return await this.userRepository.findOne({ id: id });
	}

	/*Update Username*/
	async updateUsername(updatedUser : {id: number , username: string}) {
		const dbUser = await this.userRepository.findOne({username: updatedUser?.username});

		if (dbUser !== undefined) {
			console.log("User already exists");
			return false;
		}

		return await getConnection()
		.createQueryBuilder()
		.update(User)
		.set({ username: updatedUser.username })
		.where("id = :id", { id: updatedUser.id })
		.execute();
	}

	/*Update Email*/
	async updateEmail(updatedEmail : {id: number, email:string}) {
		const dbUser = await this.userRepository.findOne({email: updatedEmail?.email});

		if (dbUser !== undefined) {
			console.log("User email already exists");
			return false;
		}		
		return await getConnection()
		.createQueryBuilder()
		.update(User)
		.set({ email: updatedEmail.email })
		.where("id = :id", { id: updatedEmail.id })
		.execute();
	}

	/*Delete*/
	async deleteUser(id: number) {
		return await getConnection()
		.createQueryBuilder()
		.delete()
		.from(User)
		.where("id = :id", { id: id })
		.execute();
	}

}