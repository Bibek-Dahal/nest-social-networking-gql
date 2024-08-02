import { InputType, Int, Field, PartialType } from '@nestjs/graphql';
import { IsString, IsInt, IsEmail, Matches, IsNotEmpty } from 'class-validator';
import { OtpType } from 'src/auth/emums/otp-type.enum';
import { Match } from 'src/users/decorators/password.decorator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  userName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$/,
    {
      message:
        'Password must contain atleast one digit, one special character, one uppercase and one lowercase letter',
    },
  )
  @Match('password', { message: 'Passwords do not match' })
  repeatPassword: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  otp: string;

  @Field()
  @IsNotEmpty()
  otpType: OtpType;
}

@InputType()
export class ResendOtpInput {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  otpType: OtpType;
}
