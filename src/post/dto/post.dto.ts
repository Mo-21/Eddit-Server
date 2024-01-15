import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostDto {
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @Length(1, 4_000_000)
  content: string;

  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
}

export class EditPostDto {
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @Length(1, 4_000_000)
  content: string;

  @IsString({ message: 'user Id must be a string' })
  @IsNotEmpty({ message: 'user Id is required' })
  userId: string;

  @IsString({ message: 'Post id must be a string' })
  @IsNotEmpty({ message: 'Post id is required' })
  postId: string;
}

export class DeletePostDto {
  @IsString({ message: 'user Id must be a string' })
  @IsNotEmpty({ message: 'user Id is required' })
  userId: string;
}
