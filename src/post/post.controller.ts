import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { DeletePostDto, EditPostDto, PostDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('all')
  getAllPosts(
    @Query('page') page: number,
    @Query('pageSize') pageSize: string,
  ) {
    console.log({ pageSize, page });
    return this.postService.getAllPosts(pageSize, page);
  }

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
  deletePost(@Param() postId: { id: string }, @Body() dto: DeletePostDto) {
    return this.postService.deletePost(postId, dto);
  }
}
