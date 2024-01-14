import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('all')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post('create')
  createPost(@Body() dto: PostDto) {
    return this.postService.createPost(dto);
  }
}
