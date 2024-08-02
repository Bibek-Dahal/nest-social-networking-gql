import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { refreshTokenLifeTime } from 'src/constants';
import { accessTokenLifeTime } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { UserRoles } from '../enums/user.enum';
import jwt from 'jsonwebtoken';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, unique: true })
  userName: string;

  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ enum: [UserRoles.Admin, UserRoles.User], default: UserRoles.User })
  role: string;

  @Prop({ default: false })
  blockUser: boolean;

  @Prop({ default: false })
  mfaEnabled: boolean;

  @Prop()
  googleAuthSecret: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  userPostCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  following: User[];

  @Prop(
    raw({
      avatar: { type: String, default: null },
      phoneNumber: { type: String, default: null },
      showPhoneNumber: { type: Boolean, default: false },
      bio: {
        type: String,
        trim: true,
        default: null,
      },
      hobbies: {
        type: Array,
        default: [],
      },
    }),
  )
  profile: Record<string, any>;

  static comparePassword = async function (
    plaintext: string,
    hashedText: string,
  ) {
    const match = await bcrypt.compare(plaintext, hashedText);
    return match;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  count: true,
});

UserSchema.methods.generateJwtTokens = function (): Promise<{
  accessToken: string;
  refreshToken: string;
  uuid: string;
}> {
  const user = this;

  const jwtPromise = new Promise<{
    accessToken: string;
    refreshToken: string;
    uuid: string;
  }>((resolve, reject) => {
    const uuid = uuidv4();
    try {
      const accessToken = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + accessTokenLifeTime,
          isAccess: true,
          data: {
            id: user._id,
            userName: user.userName,
            email: user.email,
          },
        },
        process.env.JWT_SECRET,
      );
      const refreshToken = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + refreshTokenLifeTime,
          isAccess: false,
          data: {
            uuid: uuid,
            id: this._id,
            userName: this.userName,
            email: this.email,
          },
        },
        process.env.JWT_REFRESH_SECRET,
      );
      resolve({ accessToken, refreshToken, uuid });
    } catch (error) {
      reject({ message: 'Jwt token cant be created.' });
    }
  });

  return jwtPromise;
};
