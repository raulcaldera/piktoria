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
      ) {}
}