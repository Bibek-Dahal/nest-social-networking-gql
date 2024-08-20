// import { Injectable } from '@nestjs/common';
// import { User } from '../data-access/schema/user.schema';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CreateUserInput } from 'src/auth/dto/inputs/auth-resolvers.input';
// import { UserDocument } from '../data-access/schema/user.schema';
// import { SocialAccount } from './types/socail-account.type';

// @Injectable()
// export class UserRepository {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

//   async create(
//     createUserInput: CreateUserInput,
//     socailAccount: SocialAccount = null,
//   ): Promise<UserDocument> {
//     let signinUserInput = null;
//     if (socailAccount != null) {
//       signinUserInput = {
//         ...createUserInput,
//         isEmailVerified: true,
//         socailAccount: socailAccount,
//       };
//     } else {
//       signinUserInput = { ...createUserInput, isEmailVerified: true };
//     }
//     const createdUser = new this.userModel(signinUserInput);
//     return createdUser.save();
//   }

//   async findById(id: string): Promise<UserDocument> {
//     return this.userModel.findById(id);
//   }

//   async findUserWithEmail(email: string): Promise<UserDocument> {
//     return this.userModel.findOne({ email: email });
//   }

//   async findUserWithUserName(userName: string): Promise<UserDocument> {
//     return this.userModel.findOne({ userName: userName });
//   }

//   async findAll(): Promise<UserDocument[]> {
//     return this.userModel.find({});
//   }

//   async findUserWithGoogleId(uid: string): Promise<UserDocument> {
//     console.log('uid====', uid);
//     return this.userModel.findOne({
//       'socailAccount.uid': uid,
//     });
//   }
// }
