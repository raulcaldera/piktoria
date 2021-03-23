import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post as PostEntity } from '../post/post.entity';
import { User as UserEntity } from '../user/user.entity';

@Entity()
export class PostUpvote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostEntity, post => post.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'postId'})
  post: PostEntity;

  @ManyToOne(() => UserEntity, user => user.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'userId'})
  user: UserEntity;
}