import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment as CommentEntity } from '../comment/comment.entity';
import { PostUpvote as PostUpvoteEntity } from '../postUpvote/postUpvote.entity';
import { CommentUpvote as CommentUpvoteEntity } from '../commentUpvote/commentUpvote.entity';
import { User as UserEntity } from '../user/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  body: string;

  @ManyToOne(() => UserEntity, author => author.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  @JoinColumn({name : 'authorId'})
  author: UserEntity;

  @Column('date')
  timestamp: Date;

  @OneToMany(() => CommentEntity, comment => comment.post, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  comment: CommentEntity[];  

  @OneToMany(() => PostUpvoteEntity, postUpvote => postUpvote.post , {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  postUpvote: PostUpvoteEntity[];
  
  @OneToMany(() => CommentUpvoteEntity, commentUpvote => commentUpvote.post , {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
  commentUpvote: CommentUpvoteEntity[];

}