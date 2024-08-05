import { Injectable } from '@nestjs/common';
import { Otp, OtpTokenDocument } from '../schema/otp-token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OtpType } from '../emums/otp-type.enum';
import mongoose from 'mongoose';
@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp.name) private optModel: Model<OtpTokenDocument>,
  ) {}

  async create(options: {
    user: string;
    otp: string;
    otpType: OtpType;
  }): Promise<OtpTokenDocument> {
    const otp = new this.optModel(options);
    return otp.save();
  }

  async findById(id: string): Promise<OtpTokenDocument> {
    return this.optModel.findById(id);
  }

  async findOne(query: object): Promise<OtpTokenDocument> {
    return this.optModel.findOne(query);
  }
}
