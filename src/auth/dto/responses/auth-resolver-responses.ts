import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/users/entities/user.entity';

@ObjectType()
export class VerifyOtpResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  otpId?: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  // @Field()
  // refreshToken: string;

  // @Field()
  // user: UserType;
}

@ObjectType()
export class ResendOtpResponse {
  @Field()
  message: string;

  @Field()
  userId: string;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;
}
