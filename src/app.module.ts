import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { PostNoSpecController } from './post-no-spec/post-no-spec.controller';

@Module({
  imports: [PostModule],
  controllers: [PostNoSpecController],
  providers: [],
})
export class AppModule {}
