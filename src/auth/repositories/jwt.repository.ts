// import { Injectable } from '@nestjs/common';
// import {
//   Jwt,
//   JwtTokenDocument,
// } from '../../data-access/schema/jwt-token.schema';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import DeleteResult from 'mongoose';

// @Injectable()
// export class JwtTokenRepository {
//   constructor(
//     @InjectModel(Jwt.name) private jwtModel: Model<JwtTokenDocument>,
//   ) {}

//   async create(option: {
//     uuid: string;
//     userId: string;
//   }): Promise<JwtTokenDocument> {
//     const jwt = new this.jwtModel({
//       uuid: option.uuid,
//       userId: option.userId,
//     });
//     return jwt.save();
//   }

//   async findOne(uuid: string): Promise<JwtTokenDocument> {
//     return this.jwtModel.findOne({ uuid: uuid });
//   }

//   async findOneAndDelete(uuid: string): Promise<JwtTokenDocument> {
//     return this.jwtModel.findOneAndDelete({ uuid: uuid });
//   }

//   async deleteUserAllTokens(userId: string): Promise<any> {
//     return this.jwtModel.deleteMany({ user: userId });
//   }
// }
