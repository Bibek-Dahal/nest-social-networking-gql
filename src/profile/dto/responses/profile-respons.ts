import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field({ nullable: true })
  avatar: string;

  @Field((type) => Int, { nullable: true })
  phoneNumber: number;

  @Field()
  showPhoneNumber: boolean;

  @Field((type) => [String], { nullable: 'items' })
  hobbies: string[];

  @Field({ nullable: true })
  bio: string;
}
