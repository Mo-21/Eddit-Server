import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class RegistrationDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @Length(1, 255, { message: 'Username must be between 1 and 255 characters' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Avatar must be a string' })
  @IsOptional()
  avatar: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
