import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';
import { UserType } from 'src/users/dto/inputs/users.input';

@ObjectType()
export class PostType {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;

  @Field()
  user: UserType;

  @Field(() => Int)
  likeCount: number;

  @Field(() => Int)
  commentCount: number;
}
