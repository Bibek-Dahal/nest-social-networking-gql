import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/users/user.repository';
import { EmailService } from 'src/email/email.service';
import { generateOTP } from 'src/utils/otp';
import { JwtTokenRepository } from './repositories/jwt.repository';
import { OtpRepository } from './repositories/otp.repository';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { OtpType } from './emums/otp-type.enum';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
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
  LogoutResponse,
  PasswordChangeResponse,
  PwdReqEmailResponse,
  RefreshTokenResponse,
  VerifyOtpResponse,
} from './dto/responses/auth-resolver-responses';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtTokenRepository: JwtTokenRepository,
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const userWithEmail = await this.userRepository.findUserWithEmail(
        createUserInput.email,
      );
      const userWithUserName = await this.userRepository.findUserWithUserName(
        createUserInput.userName,
      );

      if (userWithEmail) {
        throw new BadRequestException('User with email already exists');
      }

      if (userWithUserName) {
        throw new BadRequestException('User with username already exists');
      }

      const user: UserDocument =
        await this.userRepository.create(createUserInput);
      const otp = generateOTP();
      this.otpRepository.create({
        user: user.id,
        otp: otp,
        otpType: OtpType.Register,
      });
      this.emailService.sendMail({
        user,
        subject: 'User Verification Email',
        token: otp,
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async validateSocailUser(profile: any): Promise<UserDocument> {
    try {
      // Look up the user by email or other unique identifier
      const existingUser = await this.userRepository.findUserWithEmail(
        profile.email,
      );

      if (existingUser) {
        // User already exists
        return existingUser;
      }

      // If user does not exist, create a new user
      const newUser: CreateUserInput = {
        email: profile.email,
        password: 'abcd',
        repeatPassword: 'abcd',
        userName: profile.email.split('@')[0], // Simple username generation
        // Add any other fields you need to populate here
      };

      const createdUser = await this.userRepository.create(newUser);

      return createdUser;
    } catch (error) {
      throw new BadRequestException(
        `Failed to validate or create user: ${error.message}`,
      );
    }
  }

  async getUserFromGoogleToken(accessToken: string): Promise<any> {
    const client = new OAuth2Client();
    const CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      // console.log('payload====', payload);
      const userid = payload['sub'];
      return payload;
      // If the request specified a Google Workspace domain:
      // const domain = payload['hd'];
    }
    let userInfo;
    verify()
      .then((value) => {
        console.log('value========', value);
        userInfo = value;
      })
      .catch(console.error);

    return userInfo;
  }
  catch(error) {
    throw new BadRequestException('Failed to fetch user profile from Google');
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument> {
    try {
      const user: UserDocument =
        await this.userRepository.findUserWithEmail(username);
      if (!user) {
        throw new UnauthorizedException(
          'The provided credentials do not match our records',
        );
      }

      if (!user.isEmailVerified) {
        const otp = generateOTP();
        console.log('user===', user);

        await this.otpRepository.create({
          user: user.id, // Corrected to _id
          otp: otp,
          otpType: OtpType.Register,
        });

        this.emailService.sendMail({
          user,
          subject: 'User Verification Email',
          token: otp,
        });

        throw new BadRequestException('Email not verified');
      }

      if (user.blockUser) {
        throw new BadRequestException(
          'We are sorry to notify you that you are restricted from accessing this site. Please contact support for further information.',
        );
      }
      const result = await User.comparePassword(password, user.password);
      if (!result) {
        return null;
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(loginInput: LoginInput) {
    try {
      console.log('login route called');
      const { email, password } = loginInput;
      console.log('login-input==', loginInput);
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException();
      }
      console.log('user===', user);

      // Uncomment and implement MFA logic if needed
      // if (user.mfaEnabled) {
      //   const encryptedUserId = encryptData({
      //     data: user._id,  // Corrected to _id
      //     secretKey: process.env.AES_SECRET_KEY,
      //   });
      //   console.log('encrypted-data', encryptedUserId);
      //   return {
      //     message: '',
      //     data: `${encryptedUserId}`,
      //   };
      // }
      const uuid = uuidv4();
      await this.jwtTokenRepository.create({ userId: user.id, uuid: uuid });

      const accessPayload = { sub: user.id };
      const refreshPayload = { sub: user.id, uuid: uuid };
      return {
        accessToken: this.jwtService.sign(accessPayload),
        refreshToken: this.jwtService.sign(refreshPayload, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '15d',
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async verifyOtp(verifyOtpInput: VerifyOtpInput): Promise<VerifyOtpResponse> {
    try {
      const { userId, otp, otpType } = verifyOtpInput;
      const otpModel = await this.otpRepository.findOne({
        user: userId,
        otp: otp,
        otpType: otpType,
      });
      const user: UserDocument = await this.userRepository.findById(userId);

      if (!otpModel) {
        throw new BadRequestException('Verification link expired.');
      }
      if (!user) {
        throw new BadRequestException('User with given id donot exists');
      }

      if (otpType == OtpType.Register && user.isEmailVerified) {
        return {
          message: 'Email already verified',
        };
      }

      if (otpModel.isUsed == false) {
        if (otpType == OtpType.Register) {
          user.isEmailVerified = true;
          user.save();
        }
        otpModel.isUsed = true;
        otpModel.save();
        return {
          message: 'Otp verification successfull',
          otpId: otpModel.id,
        };
      } else {
        throw new BadRequestException('Otp couldnot be verified');
      }
    } catch (err) {
      throw err;
    }
  }

  async resendOpt(resendOptInput: ResendOtpInput): Promise<Object> {
    try {
      const { userId, otpType } = resendOptInput;
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const otp = generateOTP();
      this.emailService.sendMail({
        user,
        subject: 'Password Reset Email',
        token: otp,
      });

      this.otpRepository.create({
        user: user.id,
        otp: otp,
        otpType: otpType,
      });

      return {
        message: 'Otp send successfully',
        userId: user.id,
      };
    } catch (err) {
      throw err;
    }
  }

  async generateNewAccesstoken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    try {
      console.log('jwt-secret==', this.configService.get('JWT_REFRESH_SECRET'));
      const jwtToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      console.log('jwt-token==', jwtToken);

      if (!jwtToken) {
        throw new BadRequestException('Token expired');
      }
      const token = await this.jwtTokenRepository.findOne(jwtToken.uuid);
      if (!token) {
        throw new BadRequestException(
          'Cant login with given token. Either token is expired or doesnot exists',
        );
      }

      const accessPayload = { sub: jwtToken.sub };
      const newAccessToken = this.jwtService.sign(accessPayload);
      return {
        accessToken: newAccessToken,
      };
    } catch (err) {
      throw err;
    }
  }

  async logout(
    refreshToken: string,
    logoutOfAllDevice: boolean,
  ): Promise<LogoutResponse> {
    try {
      const jwtToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      if (!jwtToken) {
        throw new BadRequestException('Token Expired');
      }

      if (logoutOfAllDevice) {
        this.jwtTokenRepository.deleteUserAllTokens(jwtToken.userId);
        return {
          message: 'User logged out from all devices',
        };
      } else {
        const token = await this.jwtTokenRepository.findOneAndDelete(
          jwtToken.uuid,
        );
        return {
          message: 'User logout successfull',
        };
      }
    } catch (err) {
      throw err;
    }
  }

  async passwordChange(
    passwordChangeInput: PasswordChangeInput,
    user: UserDocument,
  ): Promise<LogoutResponse> {
    try {
      const { password, repeatPassword, logoutOfAllDevice } =
        passwordChangeInput;

      user.password = password;
      await user.save();
      if (logoutOfAllDevice) {
        await this.jwtTokenRepository.deleteUserAllTokens(user.id);
      }

      return {
        message: 'Password change successfull',
      };
    } catch (err) {
      throw err;
    }
  }

  async passwordResetRequest(
    requestPwdResetInput: ReqPwdResetInput,
  ): Promise<PwdReqEmailResponse> {
    try {
      const { email } = requestPwdResetInput;
      const user = await this.userRepository.findUserWithEmail(email);
      if (!user) {
        return {
          message: 'Email sent.',
        };
      }
      const otp = generateOTP();
      const otpObj = await this.otpRepository.create({
        user: user.id,
        otp: otp,
        otpType: OtpType.PasswordResetOtp,
      });

      console.log('otp-obj=====', otpObj);

      this.emailService.sendMail({
        user: user,
        subject: 'Password reset email',
        token: otp,
      });
      const payload = {
        userId: user.id,
        oid: otpObj.id,
      };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '5m',
      });

      return {
        message: 'Password reset email sent.',
        token: token,
        userId: user.id,
      };
    } catch (err) {
      throw err;
    }
  }

  async passwordReset(
    requestPwdResetInput: PasswordResetInput,
  ): Promise<PasswordChangeResponse> {
    try {
      const { password, repeatPassword, token } = requestPwdResetInput;
      let decodedToken;
      try {
        decodedToken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        throw new BadRequestException('Token expired');
      }
      const { userId, oid } = decodedToken;

      const user = await this.userRepository.findById(userId);
      const otpObj = await this.otpRepository.findById(oid);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!otpObj) {
        throw new BadRequestException('Token expired');
      }

      if (!otpObj.isUsed) {
        throw new BadRequestException('Please validate otp');
      }
      await otpObj.deleteOne();

      user.password = password;
      await user.save();
      return {
        message: 'Password reset successfull',
      };
    } catch (err) {
      throw err;
    }
  }
}
