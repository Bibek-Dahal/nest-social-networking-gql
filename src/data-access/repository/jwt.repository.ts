import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './base.repo';
import { JwtTokenDocument, Jwt } from '../schema';

@Injectable()
export class JwtTokenRepository extends BaseRepo<JwtTokenDocument> {
  constructor(
    @InjectModel(Jwt.name) private jwtModel: Model<JwtTokenDocument>,
  ) {
    super(jwtModel);
  }
}
