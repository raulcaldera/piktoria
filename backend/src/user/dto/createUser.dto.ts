import { IsString, IsEmail, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString() readonly username: string;
  @IsEmail() readonly email: string;
  @IsString() password: string;
  @IsDateString() readonly terms_agreed: Date; 
}