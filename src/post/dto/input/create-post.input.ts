import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  // @Field({ nullable: true })
  @IsOptional()
  description: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;
}

@InputType()
export class TestInput {
  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
