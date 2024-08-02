import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Profile } from 'src/profile/entities/profile.entity';

@ObjectType()
export class UserType {
  @Field((type) => ID)
  id: string;

  @Field()
  userName: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  isEmailVerified: boolean;

  @Field()
  blockUser: boolean;

  @Field()
  mfaEnabled: boolean;

  @Field((type) => Int)
  userPostCount: number;

  @Field((type) => [UserType], { nullable: 'items' })
  followers: UserType[];

  @Field((type) => [UserType], { nullable: 'items' })
  following: UserType[];

  @Field((type) => Profile)
  profile: Profile;
}
