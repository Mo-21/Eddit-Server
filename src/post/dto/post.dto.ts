import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostDto {
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @Length(1, 4_000_000)
  content: string;

  @IsString({ message: 'userId must be a string' })
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;
}
