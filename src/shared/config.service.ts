// src/shared/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  getJwtAccessSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }
}
