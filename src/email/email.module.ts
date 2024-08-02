import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

import nodemailer from 'nodemailer';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'EMAIL_TRANSPORTER',
      useFactory: async (configService: ConfigService) => {
        return nodemailer.createTransport({
          host:
            configService.get<string>('EMAIL_HOST') ||
            'sandbox.smtp.mailtrap.io',
          port: parseInt(configService.get<string>('EMAIL_PORT'), 10) || 2525,
          secure: configService.get<boolean>('EMAIL_SECURE') || false,
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: ['EMAIL_TRANSPORTER', EmailService],
})
export class EmailModule {}
