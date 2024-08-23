import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/input/create-post.input';
import { UpdatePostInput } from './dto/input/update-post.input';
import { PostDocument, UserDocument } from 'src/data-access/schema';
import { PostRepository } from 'src/data-access/repository/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async create(
    user: UserDocument,
    createPostInput: CreatePostInput,
  ): Promise<PostDocument> {
    const post = await this.postRepository.create({
      user: user.id,
      ...createPostInput,
    });

    await post.populate('user');
    return post;
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
