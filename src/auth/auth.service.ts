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
import { JwtUtility } from 'src/utils/jwt-token.utils';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { verificationEmailLifeTime } from 'src/constants';
import { OtpType } from './emums/otp-type.enum';
import { JwtService } from '@nestjs/jwt';

import { Otp, OtpTokenDocument } from './schema/otp-token.schema';

import {
  CreateUserInput,
  LoginInput,
  ResendOtpInput,
  VerifyOtpInput,
} from './dto/inputs/auth-resolvers.input';
import {
  LogoutResponse,
  RefreshTokenResponse,
  VerifyOtpResponse,
} from './dto/responses/auth-resolver-responses';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtTokenRepository: JwtTokenRepository,
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserInput: CreateUserInput) {
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
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument> {
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
  }

  async login(loginInput: LoginInput) {
    console.log('login route called');
    const { email, password } = loginInput;
    console.log('login-input==', loginInput);
    const user = await this.validateUser(email, password);
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

    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };

    // const tokens = await JwtUtility.generateJwtTokens(user.id);
    // await this.jwtTokenRepository.create({
    //   userId: user.id, // Corrected to _id
    //   uuid: tokens.uuid,
    // });
    // console.log('user:', user);

    // return {
    //   ...tokens,
    //   user,
    // };
  }

  async verifyOtp(verifyOtpInput: VerifyOtpInput): Promise<VerifyOtpResponse> {
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
  }

  async resendOpt(resendOptInput: ResendOtpInput): Promise<Object> {
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
  }

  async generateNewAccesstoken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    const jwtToken = await JwtUtility.verifyJwtToken(refreshToken);

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

    const newAccessToken = await JwtUtility.generateAccessToken(
      jwtToken.userId,
    );
    return {
      accessToken: newAccessToken,
    };
  }

  async logout(
    refreshToken: string,
    logoutOfAllDevice: boolean,
  ): Promise<LogoutResponse> {
    const jwtToken = await JwtUtility.verifyJwtToken(refreshToken);

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
  }
}
