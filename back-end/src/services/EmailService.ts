import { createTransport } from 'nodemailer';

import { IEmailBody } from './types';

class EmailService {
  public static async sendMessage(data: IEmailBody): Promise<{ status: string }> {
    try {
      const { name, lastName, email, phone, product } = data;
      const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'email.com',
          // Pass for apps could expire if you change password. To regenerate use https://security.google.com/settings/security/apppasswords
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailData = {
        from: data.name,
        to: 'emaill.com',
        subject: `Message From ${name - lastName}`,
        text: `Email sender: ${email}. Message: ${product}`,
        html: `<div>Email sender: ${email}. <br />Message: ${product} <br />Phone: ${phone}</div>`,
      };

      await transporter.sendMail(mailData);

      return { status: 'Success' };
    } catch (err) {
      console.error('Error sending email:', (err as Error).message);

      return { status: 'Error' };
    }
  }
}

export default EmailService;
