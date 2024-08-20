import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { User } from 'src/data-access/schema/user.schema';
@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_TRANSPORTER') private readonly transporter: Transporter,
  ) {}
  sendMail = async (option: {
    user: User;
    subject: string;
    token: string | null;
  }) => {
    let text: string;
    if (option.subject === 'User Verification Email') {
      console.log('inside user verification email');
      text = `We're happy you signed up for Xyx. To start exploring the xyz webapp please confirm your email address.
    
      Please use the otp ${option.token} to verify your email. Thank You!`;
    } else if (option.subject === 'Password Reset Email') {
      const bodyTitle = 'Password Reset Email';
      text = `We noticed that you requested to reset your password.If you did not request this password reset, please ignore this email. Your account security is important to us, and we take every measure to ensure your information remains safe. Token ${option.token}`;
    }

    try {
      const info = await this.transporter.sendMail({
        from: 'abc@gmail.com', // sender address
        to: option.user.email, // list of receivers
        subject: option.subject, // Subject line

        text: text, // html body
      });

      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.log('*****cant send email******');
    }
  };
}
