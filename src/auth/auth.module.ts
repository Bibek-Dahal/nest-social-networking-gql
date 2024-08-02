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
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { JwtStrategy } from './stratigies/jwt.strategy';
@Module({
  imports: [
    UsersModule,
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants,
      signOptions: { expiresIn: '5m' },
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
  ],
  // exports: [AuthService],
})
export class AuthModule {}
