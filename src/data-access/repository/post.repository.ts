import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './base.repo';
import { Post, PostDocument } from '../schema';

@Injectable()
export class PostRepository extends BaseRepo<PostDocument> {
  projection;
  constructor(@InjectModel(Post.name) private userModel: Model<PostDocument>) {
    super(userModel);
  }
}
