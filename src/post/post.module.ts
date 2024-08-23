import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostSchema } from 'src/data-access/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Post } from 'src/data-access/schema';
import { PostRepository } from 'src/data-access/repository';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          const schema = PostSchema;

          return schema;
        },
      },
    ]),
  ],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
