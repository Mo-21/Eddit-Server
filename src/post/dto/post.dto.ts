import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 4_000_000)
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: number;
}
