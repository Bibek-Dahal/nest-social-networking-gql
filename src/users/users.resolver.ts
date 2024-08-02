import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  CreateUserInput,
  UpdateUserInput,
} from 'src/auth/dto/inputs/auth-resolvers.input';
import { UserType } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from './schema/user.schema';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => UserType)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  // @Query(() => [UserType], { name: 'users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Query(() => UserType, { name: 'user' })
  findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: UserDocument) {
    return this.usersService.findOne(user.id);
  }

  // @Mutation(() => UserType)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => UserType)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.remove(id);
  // }
}
