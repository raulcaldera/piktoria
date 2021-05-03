import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment as CommentEntity } from '../comment/comment.entity';
import { PostUpvote as PostUpvoteEntity } from '../postUpvote/postUpvote.entity';
import { CommentUpvote as CommentUpvoteEntity } from '../commentUpvote/commentUpvote.entity';
import { Post as PostEntity } from '../post/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  username: string;

  @Column('text', {select: false})
  email: string;

  @Column('text', {select: false})
  password: string;

  @Column('timestamptz')
	terms_agreed: Date;

  @OneToMany(() => CommentEntity, comment => comment.user, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  comment: CommentEntity[];

  @OneToMany(() => PostEntity, post => post.author, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  post: PostEntity[]; 
  
  @OneToMany(() => PostUpvoteEntity, postUpvote => postUpvote.user , {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  postUpvote: PostUpvoteEntity[];
  
  @OneToMany(() => CommentUpvoteEntity, commentUpvote => commentUpvote.user , {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  commentUpvote: CommentUpvoteEntity[];
}