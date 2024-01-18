import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { EditPostDto, PostDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('all')
  getAllPosts(
    @Query('page') page: number,
    @Query('pageSize') pageSize: string,
    @Query('userId') userId?: string,
  ) {
    return this.postService.getAllPosts(pageSize, page, userId);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post('create')
  createPost(@Body() dto: PostDto) {
    return this.postService.createPost(dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Patch(':id/edit')
  editPost(@Body() dto: EditPostDto) {
    return this.postService.editPost(dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Delete(':id/delete')
  deletePost(@Query('postId') postId: string, @Query('userId') userId: string) {
    return this.postService.deletePost(postId, userId);
  }
}
