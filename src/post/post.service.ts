import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditPostDto, LikeDto, PostDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(size: string, page: number, userId?: string) {
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
          likers: {
            select: { id: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      });

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

  async deletePost(postId: string, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) return new ForbiddenException('No user found');

      const post = await this.prisma.post.findUnique({
        where: {
          id: parseInt(postId),
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
  async likePost(dto: LikeDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: parseInt(dto.postId) },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(dto.userId) },
      include: { likedPosts: true }, // Include the current likedPosts
    });

    if (!user || !post) {
      return new ForbiddenException('No post or user found');
    }

    const isAlreadyLiked = user.likedPosts.some(
      (likedPost) => likedPost.id === parseInt(dto.postId),
    );

    if (!isAlreadyLiked) {
      try {
        await this.prisma.user.update({
          where: { id: parseInt(dto.userId) },
          data: {
            likedPosts: {
              connect: { id: post.id },
            },
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new ForbiddenException('Credentials must be provided');
        } else {
          throw error;
        }
      }
    } else {
      try {
        await this.prisma.user.update({
          where: { id: parseInt(dto.userId) },
          data: {
            likedPosts: {
              disconnect: { id: post.id },
            },
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new ForbiddenException('Credentials must be provided');
        } else {
          throw error;
        }
      }
    }
  }
}
