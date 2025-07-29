import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    nodemailer.createTestAccount().then((testAccount) => {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }

async sendMail(to: string, subject: string, text: string) {
  const info = await this.transporter.sendMail({
    from: '"My App" <noreply.myapp@gmail.com>',
    to,
    subject,
    text,
  });

//   console.log('✅ Email sent: ', info.messageId);
//   console.log('📬 Preview URL: ', nodemailer.getTestMessageUrl(info)); // For Ethereal
}

  }
