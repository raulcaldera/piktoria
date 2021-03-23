import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment as CommentEntity } from '../comment/comment.entity';
import { Post as PostEntity } from '../post/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => CommentEntity, comment => comment.user, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  comment: CommentEntity[];

  @OneToMany(() => PostEntity, post => post.author, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  post: PostEntity[];    
}