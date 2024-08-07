import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './dto/responses/profile-respons';
import {
  CreateProfileInput,
  UpdateProfileInput,
} from './dto/inputs/profile-input';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  // @Mutation(() => Profile)
  // createProfile(
  //   @Args('createProfileInput') createProfileInput: CreateProfileInput,
  // ) {
  //   return this.profileService.create(createProfileInput);
  // }

  // @Query(() => [Profile], { name: 'profile' })
  // findAll() {
  //   return this.profileService.findAll();
  // }

  // @Query(() => Profile, { name: 'profile' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.profileService.findOne(id);
  // }

  @Mutation(() => String)
  updateProfile(
    @Args('id') id: string,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    console.log('updateProfileInput====', updateProfileInput);
    return this.profileService.update(id, updateProfileInput);
  }

  // @Mutation(() => Profile)
  // removeProfile(@Args('id', { type: () => Int }) id: number) {
  //   return this.profileService.remove(id);
  // }
}
