// src/shared/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { accessTokenLifeTime, refreshTokenLifeTime } from 'src/constants';
import jwt from 'jsonwebtoken';
import { User } from 'src/users/schema/user.schema';
import { Jwt } from 'src/auth/schema/jwt-token.schema';

type JwtPayload = {
  uuid?: string;
  userId: string;
  exp: number;
  // Add other properties as needed
};

export class JwtUtility {
  constructor(private configService: ConfigService) {}

  static getJwtAccessSecret(): string {
    return process.env.JWT_SECRET;
  }

  static getJwtRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET;
  }

  static verifyJwtToken = (token: string): Promise<JwtPayload> => {
    const promise = new Promise<JwtPayload>((resolve, reject) => {
      try {
        const jwtToken = jwt.verify(
          token,
          JwtUtility.getJwtRefreshSecret(),
        ) as JwtPayload;
        console.log(jwtToken);
        if (jwtToken) {
          resolve(jwtToken);
        } else {
          reject(null);
        }
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  };

  static generateAccessToken = (userId: string) => {
    const promise = new Promise<string>((resolve, reject) => {
      try {
        const accessToken = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + accessTokenLifeTime,
            userId: userId,
          },
          this.getJwtAccessSecret(),
        );

        resolve(accessToken);
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  };

  static generateJwtTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
    uuid: string;
  }> {
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
            userId,
          },
          JwtUtility.getJwtAccessSecret(),
          // process.env.JWT_SECRET,
        );
        const refreshToken = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + refreshTokenLifeTime,
            uuid: uuid,
            userId: userId,
          },
          JwtUtility.getJwtRefreshSecret(),
          // process.env.JWT_REFRESH_SECRET,
        );
        resolve({ accessToken, refreshToken, uuid });
      } catch (error) {
        reject({ message: 'Jwt token cant be created.' });
      }
    });

    return jwtPromise;
  }

  static generateToken = (
    user: { id: string; userName: string; email: string },
    tokenLifetime: number,
  ) => {
    const promise = new Promise<{ token: string; uuid: string }>(
      (resolve, reject) => {
        try {
          const uuid = uuidv4();
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + tokenLifetime,
              data: {
                id: user.id,
                userName: user.userName,
                email: user.email,
                uuid: uuid,
              },
            },
            JwtUtility.getJwtAccessSecret(),
          );

          resolve({ token, uuid });
        } catch (error) {
          reject(error);
        }
      },
    );

    return promise;
  };
}
