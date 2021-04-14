import { Connection, Repository } from 'typeorm';
import { PostUpvote } from './postUpvote.entity';

export const postUpvoteProviders = [
	{
		provide: 'POSTUPVOTE_REPOSITORY',
		useFactory: (connection: Connection) => connection.getRepository(PostUpvote),
		inject: ['DATABASE_CONNECTION'],
	},
];