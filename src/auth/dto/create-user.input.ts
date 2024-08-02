import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsEmail, Matches, IsNotEmpty } from 'class-validator';
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
