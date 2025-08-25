import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
