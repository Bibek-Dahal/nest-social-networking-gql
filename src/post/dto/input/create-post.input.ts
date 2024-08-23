import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: FileUpload;
}
