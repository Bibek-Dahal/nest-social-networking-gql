import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './base.repo';
import { OtpTokenDocument, Otp } from '../schema';

@Injectable()
export class OtpRepository extends BaseRepo<OtpTokenDocument> {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpTokenDocument>,
  ) {
    super(otpModel);
  }
}
