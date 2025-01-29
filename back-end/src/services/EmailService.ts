import { createTransport } from 'nodemailer';

import { IEmailBody } from './types';

class EmailService {
  public static async sendMessage(data: IEmailBody): Promise<{ status: string }> {
    try {
      const { name, email, phone, message } = data;
      const transporter = createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL_USER,
          // Pass for apps could expire if you change password. To regenerate use https://security.google.com/settings/security/apppasswords
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // notify medica
      const mailData = {
        from: name,
        to: process.env.EMAIL_RECIPIENT,
        subject: `Повідомлення від замовника ${name}`,
        html: `<div>${name && "Ім'я замовника: " + name}
                <br />Пошта замовника: ${email}.
                <br />${phone && 'Номер телефону: ' + phone}
                <br />Повідомлення: ${message}
            </div>`,
      };

      await transporter.sendMail(mailData);

      // notify user
      const mailDataUser = {
        from: 'Medica',
        to: email,
        subject: `Повідомлення від Medica`,
        html: `<div>Дякуємо за звернення, найближчим часом наш консультант звєяжиться з вами.
             <br />Якщо виникли запитання можна звернутись на гарячу лінію по номеру: +380660000000
            </div>`,
      };

      await transporter.sendMail(mailDataUser);

      return { status: 'Success' };
    } catch (err) {
      console.error('Error sending email:', (err as Error).message);

      return { status: 'Error' };
    }
  }
}

export default EmailService;
