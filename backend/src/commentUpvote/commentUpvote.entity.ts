import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post as PostEntity } from '../post/post.entity';
import { User as UserEntity } from '../user/user.entity';
import { Comment as CommentEntity } from '../comment/comment.entity';


@Entity()
export class CommentUpvote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommentEntity, comment => comment.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'commentId'})
  comment: CommentEntity;

  @ManyToOne(() => PostEntity, post => post.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'postId'})
  post: PostEntity;

  @ManyToOne(() => UserEntity, user => user.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'userId'})
  user: UserEntity;
  
}