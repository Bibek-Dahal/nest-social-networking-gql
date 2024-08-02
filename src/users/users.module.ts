import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next) {
            const user = this;
            const saltRound = 8;

            if (!user.isModified('password')) return next();

            bcrypt.hash(user.password, saltRound, (err, hash) => {
              if (err) return next(err);
              user.password = hash;
              next();
            });
          });

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersResolver, UsersService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
