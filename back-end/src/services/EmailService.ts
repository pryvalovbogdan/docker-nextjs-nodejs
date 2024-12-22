import { createTransport } from 'nodemailer';

import { IEmailBody } from './types';

class EmailService {
  public static async sendMessage(data: IEmailBody): Promise<{ status: string }> {
    try {
      const { name, lastName, email, phone, product } = data;
      const transporter = createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        auth: {
          user: 'robinsontom753@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailData = {
        from: data.name,
        to: 'emaill.com',
        subject: `Message From ${name} - ${lastName}`,
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
