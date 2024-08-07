import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';
import {
  CreateUserInput,
  UpdateUserInput,
} from 'src/auth/dto/inputs/auth-resolvers.input';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserInput: CreateUserInput) {
    const userWithEmail = await this.userRepository.findUserWithEmail(
      createUserInput.email,
    );
    const userWithUserName = await this.userRepository.findUserWithUserName(
      createUserInput.userName,
    );

    if (userWithEmail) {
      throw new BadRequestException('User with email already exists');
    }

    if (userWithUserName) {
      throw new BadRequestException('User with username already exists');
    }

    return this.userRepository.create(createUserInput);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return new NotFoundException('user not found');
    }
    return user;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
