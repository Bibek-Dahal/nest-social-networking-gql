import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/constants';
import { UserRepository } from 'src/users/user.repository';
import { UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants,
    });
  }

  async validate(payload: any): Promise<UserDocument> {
    const user: UserDocument = await this.userRepository.findById(payload.sub);
    return user;
  }
}
