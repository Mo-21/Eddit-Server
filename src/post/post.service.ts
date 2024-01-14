import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPostDto, PostDto } from './dto';
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
    const { content, userId } = dto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) return new ForbiddenException('No user found');

      const newPost = await this.prisma.post.create({
        data: {
          content,
          userId: parseInt(userId),
        },
      });

      if (!newPost)
        return new InternalServerErrorException('Something went wrong');

      return newPost;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials must be provided');
      } else {
        throw error;
      }
    }
  }

  async editPost(dto: EditPostDto) {
    const { content, userId, postId } = dto;

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) return new ForbiddenException('No user found');

      const newPost = await this.prisma.post.update({
        where: {
          id: parseInt(postId),
        },
        data: {
          content,
          userId: parseInt(userId),
        },
      });

      if (!newPost)
        return new InternalServerErrorException('Something went wrong');

      return newPost;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials must be provided');
      } else {
        throw error;
      }
    }
  }
}
