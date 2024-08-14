import { InputType, Int, Field } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;
}
