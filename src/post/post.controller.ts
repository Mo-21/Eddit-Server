import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('all')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @HttpCode(201)
  @Post('create')
  createPost(@Body() dto: PostDto) {
    return this.postService.createPost(dto);
  }
}
