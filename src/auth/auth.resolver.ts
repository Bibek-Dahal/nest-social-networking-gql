import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { UserType } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  CreateUserInput,
  LoginInput,
  PasswordChangeInput,
  PasswordResetInput,
  ReqPwdResetInput,
  ResendOtpInput,
  VerifyOtpInput,
} from './dto/inputs/auth-resolvers.input';
import {
  LoginResponse,
  LogoutResponse,
  PasswordChangeResponse,
  PwdReqEmailResponse,
  RefreshTokenResponse,
  ResendOtpResponse,
  VerifyOtpResponse,
} from './dto/responses/auth-resolver-responses';
import { UserType } from 'src/users/dto/inputs/users.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/graphql-auth.guard';
import { UserDocument } from 'src/data-access/schema/user.schema';
import { CurrentUser } from './decorators/current-user.decorator';

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

  @Mutation(() => LoginResponse)
  async loginWithGoogle(@Args('accessToken') accessToken: string) {
    // Use AuthService to validate the token and get user info
    const tokens = await this.authService.loginUserWithGoogle(accessToken);
    console.log('user======', tokens);
    // Generate and return JWT or handle session here
    return tokens;
    // this.authService.generateJwt(user);
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

  @Mutation(() => PasswordChangeResponse)
  @UseGuards(GqlAuthGuard)
  passwordChange(
    @CurrentUser() user: UserDocument,
    @Args('passwordChangeInput') passwordChangeInput: PasswordChangeInput,
  ) {
    return this.authService.passwordChange(passwordChangeInput, user);
  }

  @Mutation(() => PwdReqEmailResponse)
  requestPassowrdReset(
    @Args('requestPwdResetInput') requestPwdResetInput: ReqPwdResetInput,
  ) {
    return this.authService.passwordResetRequest(requestPwdResetInput);
  }

  @Mutation(() => PwdReqEmailResponse)
  passwordReset(
    @Args('requestPwdResetInput') requestPwdResetInput: PasswordResetInput,
  ) {
    return this.authService.passwordReset(requestPwdResetInput);
  }
}
