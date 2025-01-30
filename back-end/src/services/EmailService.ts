import { createTransport } from 'nodemailer';

import { IEmailBody } from './types';

class EmailService {
  private static transporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_USER,
      // Pass for apps could expire if you change password. To regenerate use https://security.google.com/settings/security/apppasswords
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  /**
   * Base method to send an email
   * @param to - Recipient email
   * @param subject - Email subject
   * @param html - Email HTML content
   */
  private static async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error(`Error sending email to ${to}:`, (err as Error).message);
    }
  }

  /**
   * Send a Contact Us email to Medica and user
   * @param data - Email body data
   */
  public static async sendContactUsEmail(data: IEmailBody): Promise<{ status: string }> {
    try {
      const { name, email, phone, message } = data;

      // Notify Medica (Admin)
      const adminEmailContent = `
        <div>
          <strong>Ім'я замовника:</strong> ${name || 'Немає даних'}<br />
          <strong>Пошта замовника:</strong> ${email}<br />
          <strong>Номер телефону:</strong> ${phone || 'Немає даних'}<br />
          <strong>Повідомлення:</strong> ${message}
        </div>`;

      await this.sendEmail(process.env.EMAIL_RECIPIENT!, `Повідомлення від ${name}`, adminEmailContent);

      // Notify User
      const userEmailContent = `
        <div>
          <strong>Дякуємо за звернення!</strong><br />
          Наш консультант зв'яжеться з вами найближчим часом.<br />
          Якщо у вас є додаткові запитання, звертайтесь на гарячу лінію: <strong>+380660000000</strong>
        </div>`;

      await this.sendEmail(email, 'Дякуємо за звернення до Medica', userEmailContent);

      return { status: 'Success' };
    } catch (err) {
      console.error('Error sending contact email:', (err as Error).message);

      return { status: 'Error' };
    }
  }

  /**
   * Send an Order Confirmation email to Medica and user
   * @param data - Order email body data
   */
  public static async sendOrderEmail(data: IEmailBody): Promise<{ status: string }> {
    try {
      const { name, email, phone, orderDetails } = data;

      // Notify Medica (Admin)
      const adminOrderContent = `
        <div>
          <strong>Ім'я замовника:</strong> ${name || 'Немає даних'}<br />
          <strong>Пошта замовника:</strong> ${email}<br />
          <strong>Номер телефону:</strong> ${phone || 'Немає даних'}<br />
          <strong>Деталі замовлення:</strong> ${orderDetails || 'Немає даних'}
        </div>`;

      await this.sendEmail(process.env.EMAIL_RECIPIENT!, `Нове замовлення від ${name}`, adminOrderContent);

      // Notify User
      const userOrderContent = `
        <div>
          <strong>Дякуємо за замовлення!</strong><br />
          Ваше замовлення прийнято, і наш менеджер зв'яжеться з вами найближчим часом.<br />
          Якщо у вас є додаткові запитання, звертайтесь на гарячу лінію: <strong>+380660000000</strong><br /><br />
          <strong>Деталі замовлення:</strong><br />
          ${orderDetails || 'Немає даних'}
        </div>`;

      await this.sendEmail(email, 'Ваше замовлення прийнято Medica', userOrderContent);

      return { status: 'Success' };
    } catch (err) {
      console.error('Error sending order email:', (err as Error).message);

      return { status: 'Error' };
    }
  }
}

export default EmailService;
