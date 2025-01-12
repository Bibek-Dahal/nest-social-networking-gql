import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/data-access/schema/user.schema';
import { OtpType } from '../../auth/emums/otp-type.enum';
export type JwtTokenDocument = HydratedDocument<Jwt>;
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Jwt {
  @Prop({
    // required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({ type: mongoose.Schema.Types.UUID, required: true })
  uuid: string;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const JwtTokenSchema = SchemaFactory.createForClass(Jwt);
JwtTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60 },
);
