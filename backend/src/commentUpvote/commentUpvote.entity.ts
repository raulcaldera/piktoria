import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User as UserEntity } from '../user/user.entity';
import { Comment as CommentEntity } from '../comment/comment.entity';

@Entity()
export class CommentUpvote {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => CommentEntity, comment => comment.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
	@JoinColumn({name : 'commentId'})
	comment: CommentEntity;

	@ManyToOne(() => UserEntity, user => user.id, {onUpdate : 'CASCADE', onDelete : 'CASCADE'})
	@JoinColumn({name : 'userId'})
	user: UserEntity;
}