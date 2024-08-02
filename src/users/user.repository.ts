import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from 'src/auth/dto/inputs/auth-resolvers.input';
import { UserDocument } from './schema/user.schema';
@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserInput);
    return createdUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findUserWithEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email });
  }

  async findUserWithUserName(userName: string): Promise<UserDocument> {
    return this.userModel.findOne({ userName: userName });
  }
}
