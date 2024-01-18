import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeletePostDto, EditPostDto, PostDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(size: string, page: number, userId?: string) {
    console.log(size, userId, page);
    const pageSize = parseInt(size);
    const id = parseInt(userId);
    try {
      const skip = (page - 1) * pageSize;
      const posts = await this.prisma.post.findMany({
        where: userId ? { userId: id } : {},
        include: {
          User: {
            select: { avatar: true, username: true, id: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      });

      console.log(posts);
      const totalPosts = await this.prisma.post.count();
      const hasMore = skip + pageSize < totalPosts;

      return { posts, hasMore };
    } catch (error) {
      throw error;
    }
  }

  async createPost(dto: PostDto) {
    const { content, userId } = dto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return new ForbiddenException('No user found');

      const newPost = await this.prisma.post.create({
        data: {
          content,
          userId,
        },
        include: {
          User: {
            select: { avatar: true, username: true, id: true },
          },
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

  async deletePost(postId: { id: string }, dto: DeletePostDto) {
    const { userId } = dto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) return new ForbiddenException('No user found');

      const post = await this.prisma.post.findUnique({
        where: {
          id: parseInt(postId.id),
        },
      });

      if (!post) return new ForbiddenException('No post found');

      if (post.userId !== parseInt(userId))
        return new UnauthorizedException('You can only delete your own post');

      await this.prisma.post.delete({
        where: {
          id: post.id,
        },
      });

      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials must be provided');
      } else {
        throw error;
      }
    }
  }
}
