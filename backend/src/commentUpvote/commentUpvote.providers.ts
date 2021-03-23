import { Connection, Repository } from 'typeorm';
import { CommentUpvote } from './commentUpvote.entity';

export const commentUpvoteProviders = [
  {
    provide: 'COMMENTUPVOTE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CommentUpvote),
    inject: ['DATABASE_CONNECTION'],
  },
];