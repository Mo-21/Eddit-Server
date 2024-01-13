import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts() {
    try {
      const posts = await this.prisma.post.findMany();
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async createPost(dto: PostDto) {
    try {
      const newPost = await this.prisma.post.create({
        data: {
          content: dto.content,
          userId: dto.userId,
        },
      });

      if (!newPost)
        return new InternalServerErrorException('Something went wrong');

      return newPost;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials must be provided');
      }
    }
  }
}
