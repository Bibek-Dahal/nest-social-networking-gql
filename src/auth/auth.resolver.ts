import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { UserType } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  CreateUserInput,
  LoginInput,
  ResendOtpInput,
  VerifyOtpInput,
} from './dto/inputs/auth-resolvers.input';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  ResendOtpResponse,
  VerifyOtpResponse,
} from './dto/responses/auth-resolver-responses';
import { UserType } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserType, { name: 'register' })
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.create(createUserInput);
  }

  // @UseGuards(JwtAuthGuard)
  @Mutation(() => LoginResponse)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => VerifyOtpResponse)
  verifyOtp(@Args('verifyOtp') verifyOtpInput: VerifyOtpInput) {
    return this.authService.verifyOtp(verifyOtpInput);
  }

  @Mutation(() => ResendOtpResponse)
  resendOtp(@Args('verifyOtp') resendOtpInput: ResendOtpInput) {
    return this.authService.resendOpt(resendOtpInput);
  }

  @Mutation(() => RefreshTokenResponse)
  generateNewAccessToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.generateNewAccesstoken(refreshToken);
  }

  @Mutation(() => LogoutResponse)
  logout(
    @Args('refreshToken') refreshToken: string,
    @Args('logoutOfAllDevice') logoutOfAllDevice: boolean = false,
  ) {
    return this.authService.logout(refreshToken, logoutOfAllDevice);
  }
}
