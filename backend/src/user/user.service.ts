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

	/*SignUp*/
	async signup(user: IUser) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(user.password, salt);
		const dbUser = await this.userRepository.findOne({username: user?.username});
		const dbEmail = await this.userRepository.findOne({email: user?.email});
	
		if (dbUser !== undefined) {
			return {signedUp: false, jwt: false, userId: false, username: false, msg: "User already exists"};
		}

		if (dbEmail !== undefined) {
			return {signedUp: false, jwt: false, userId: false, username: false, msg: "Email already exists"};
		}
	
		user.password = hashedPassword;
		const insertedUser = await this.userRepository.save(user);
	
		if (!insertedUser) {
			return {signedUp: false, jwt: false, userId: false, username: false, msg: "User creation error"};
		}

		const token = await this.createJwt(insertedUser.id, insertedUser.username);
		return {signedUp: true, jwt: token, userId: insertedUser.id, username: insertedUser.username, msg: "Signed Up!"};
	
	  }

	/*Login*/
	async authenticate(user){
		const dbUser = await this.userRepository.createQueryBuilder('user')
			.select('user.id')
			.addSelect('user.username')
			.addSelect('user.password')
			.addSelect('user.email')
			.where('user.email = :email', {email: user?.email})
			.getOne();

		if (dbUser) {
			const validPassword = await bcrypt.compare(user.password, dbUser.password);
			if (validPassword) {
				const token = await this.createJwt(dbUser.id, dbUser.username);
				return {logedIn: true, jwt: token, userId: dbUser.id, username: dbUser.username, msg: "Loged In!"};
			} else {
				return {logedIn: false, jwt: false, userId: false, username: false, msg: "Invalid password"};
			}
		}

		return {logedIn: false, jwt: false, userId: false, username: false, msg: "User not found"};
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
		if (req.userId == updatedUser?.id) {
			try {			
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
			} catch(err) {
				console.log('Error in updating user: ' + err); 
				return {updated: false, msg: err};	
			}
		} else {
			return {updated: false, msg: "Unauthorized"};	
		}

	}

	/*Update Email*/
	async updateEmail(updatedEmail : {id: number, email:string}, req) {
		if (req.userId == updatedEmail?.id) {
			try {
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
			} catch(err) {
				console.log('Error in updating email: ' + err); 
				return {updated: false, msg: err};					
			}
		} else {
			return {updated: false, msg: "Unauthorized"};			
		}
	}

	/*Delete*/
	async deleteUser(id: number, req) {
		if (req.userId == id) {
			try {
				await getConnection()
				.createQueryBuilder()
				.delete()
				.from(User)
				.where("id = :id", { id: id })
				.execute();

				return {deleted: true, msg: "User deleted"};
			} catch(err) {
				console.log('Error in deleting user: ' + err); 
				return {deleted: false, msg: err};				
			}		
		} else {
			return {deleted: false, msg: "Unauthorized"};		
		}	
	}

}