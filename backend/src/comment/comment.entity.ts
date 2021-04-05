import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Post as PostEntity } from '../post/post.entity';
import { User as UserEntity } from '../user/user.entity';
import { CommentUpvote as CommentUpvoteEntity } from '../commentUpvote/commentUpvote.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostEntity, post => post.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'postId'})
  post: PostEntity;

  @ManyToOne(() => UserEntity, user => user.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'userId'})
  user: UserEntity;

  @Column('text')
  comment: string;

  @Column('timestamptz')
  timestamp: Date;

  @OneToMany(() => CommentUpvoteEntity, commentUpvote => commentUpvote.comment , {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  commentUpvote: CommentUpvoteEntity[];

}