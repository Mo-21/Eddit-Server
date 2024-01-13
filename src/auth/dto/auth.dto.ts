import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  avatar: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
