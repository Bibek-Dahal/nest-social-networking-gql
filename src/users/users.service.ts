import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from 'src/data-access/repository';
import {
  CreateUserInput,
  UpdateUserInput,
} from 'src/auth/dto/inputs/auth-resolvers.input';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const userWithEmail = await this.userRepository.findOne({
        email: createUserInput.email,
      });
      const userWithUserName = await this.userRepository.findOne({
        userName: createUserInput.userName,
      });

      if (userWithEmail) {
        throw new BadRequestException('User with email already exists');
      }

      if (userWithUserName) {
        throw new BadRequestException('User with username already exists');
      }

      return this.userRepository.create(createUserInput);
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    try {
      return this.userRepository.find({});
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return new NotFoundException('user not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
