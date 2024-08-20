import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './base.repo';
import { User, UserDocument } from 'src/data-access/schema/user.schema';

@Injectable()
export class UserRepository extends BaseRepo<UserDocument> {
  projection;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}
