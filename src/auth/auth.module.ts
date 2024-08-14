import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpTokenSchema } from './schema/otp-token.schema';
import { Jwt, JwtTokenSchema } from './schema/jwt-token.schema';
import { JwtTokenRepository } from './repositories/jwt.repository';
import { OtpRepository } from './repositories/otp.repository';
import { LocalStrategy } from './stratigies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './stratigies/google.strategy';
@Module({
  imports: [
    UsersModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpTokenSchema },
      { name: Jwt.name, schema: JwtTokenSchema },
    ]),
  ],

  providers: [
    AuthResolver,
    AuthService,
    JwtTokenRepository,
    OtpRepository,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
  ],
  // exports: [AuthService],
})
export class AuthModule {}
