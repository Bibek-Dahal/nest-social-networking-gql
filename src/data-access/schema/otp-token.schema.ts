import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/data-access/schema/user.schema';
import { OtpType } from '../../auth/emums/otp-type.enum';
import { Document } from 'mongoose';
export type OtpTokenDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  otp: string;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({
    required: true,
    enum: [
      OtpType.Register,
      OtpType.PasswordResetOtp,
      OtpType.ResendPasswordResetOtp,
      OtpType.ResendRegisterOtp,
    ],
  })
  otpType: string;

  @Prop({
    default: () => new Date(+new Date() + 5 * 60 * 1000),
    index: { expires: '5m' },
  })
  expiresAt: Date;
}

export const OtpTokenSchema = SchemaFactory.createForClass(Otp);
