import {
  InputType,
  Int,
  Field,
  PartialType,
  ObjectType,
} from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

// import { FileUpload } from '../interface/file-upload';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';
import { Upload } from 'graphql-upload-ts';

@InputType()
export class CreateProfileInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

@InputType()
export class UpdateProfileInput {
  @IsOptional()
  @Field(() => GraphQLUpload)
  avatar: FileUpload;

  // @Field()
  // phoneNumber: string;

  // @Field({ defaultValue: false })
  // showPhoneNumber: boolean;

  // @Field((type) => [String])
  // hobbies: string[];

  // @Field()
  // bio: string;
}
