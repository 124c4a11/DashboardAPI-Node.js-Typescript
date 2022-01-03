import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsString({ message: 'Name not specified' })
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString({ message: 'Password not specified' })
  password: string;
}
