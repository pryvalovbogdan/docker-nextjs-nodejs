import validator from 'email-validator';
import { Transporter, createTransport } from 'nodemailer';

import { IEmailBody } from './types';

class EmailService {
  private static officeTransporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_USER!,
      // Pass for apps could expire if you change password. To regenerate use https://security.google.com/settings/security/apppasswords
      pass: process.env.EMAIL_PASSWORD!,
    },
  });

  private static customerTransporter = createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.OFFICE_EMAIL!,
      // Pass for apps could expire if you change password. To regenerate use https://security.google.com/settings/security/apppasswords
      pass: process.env.OFFICE_EMAIL_PASSWORD!,
    },
  });

  /**
   * Base method to send an email
   * @param to - Recipient email
   * @param subject - Email subject
   * @param html - Email HTML content
   * @param transporter - Transporter
   * @param from - Email sender
   */
  private static async sendEmail(
    transporter: Transporter,
    from: string,
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await transporter.sendMail({ from, to, subject, html });

      console.log(`Email sent to ${to}`);
    } catch (err) {
      console.error(`Error sending email to ${to}:`, (err as Error).message);
    }
  }

  /**
   * Email the admin (office)
   */
  private static async sendEmailToOffice(to: string, subject: string, html: string): Promise<void> {
    await this.sendEmail(this.officeTransporter, process.env.OFFICE_EMAIL!, to, subject, html);
  }

  /**
   * Email the customer
   */
  private static async sendEmailToCustomer(to: string, subject: string, html: string): Promise<void> {
    await this.sendEmail(this.customerTransporter, process.env.EMAIL_USER!, to, subject, html);
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
          <strong>Пошта замовника:</strong> ${email || 'Немає даних'}<br />
          <strong>Номер телефону:</strong> ${phone || 'Немає даних'}<br />
          <strong>Повідомлення:</strong> ${message}
        </div>`;

      await this.sendEmailToOffice(process.env.EMAIL_RECIPIENT!, `Повідомлення від ${name}`, adminEmailContent);

      // Notify User
      const userEmailContent = `
        <div>
          <strong>Дякуємо за звернення!</strong><br />
          Наш консультант зв'яжеться з вами найближчим часом.<br />
          Якщо у вас є додаткові запитання, звертайтесь на гарячу лінію: <strong>${process.env.OFFICE_PHONE!}</strong>
        </div>`;

      if (email) {
        if (!validator.validate(email)) {
          console.error(`Invalid email format: ${email}`);

          return { status: 'Error' };
        }

        await this.sendEmailToCustomer(email, 'Дякуємо за звернення до Medica', userEmailContent);
      }

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

      await this.sendEmailToOffice(process.env.EMAIL_RECIPIENT!, `Нове замовлення від ${name}`, adminOrderContent);

      // Notify User
      const userOrderContent = `
        <div>
          <strong>Дякуємо за замовлення!</strong><br />
          Ваше замовлення прийнято, і наш менеджер зв'яжеться з вами найближчим часом.<br />
          Якщо у вас є додаткові запитання, звертайтесь на гарячу лінію: <strong>${process.env
            .OFFICE_PHONE!}</strong><br /><br />
          <strong>Деталі замовлення:</strong><br />
          ${orderDetails || 'Немає даних'}
        </div>`;

      await this.sendEmailToCustomer(email, 'Ваше замовлення прийнято Medica', userOrderContent);

      return { status: 'Success' };
    } catch (err) {
      console.error('Error sending order email:', (err as Error).message);

      return { status: 'Error' };
    }
  }
}

export default EmailService;
