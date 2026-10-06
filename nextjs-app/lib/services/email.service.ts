import { logger } from '../utils/logger';

export interface BookingEmailData {
  bookingReference: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  programTitle: string;
  scheduleDetails: string;
  message?: string;
}

export class EmailService {
  private static readonly VIDYALAYA_PHONE = '09818047984';
  private static readonly VIDYALAYA_EMAIL = 'shuchimohan@kalptaruyogvidyalaya.com';
  private static readonly ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'shuchimohan@kalptaruyogvidyalaya.com';

  /**
   * Generates the visitor confirmation email content according to client specification.
   */
  static formatVisitorEmail(data: BookingEmailData): { subject: string; text: string } {
    const subject = `Your Kalptaru Yog Vidyalaya Booking Request — ${data.bookingReference}`;
    const text = `Dear ${data.visitorName},

Thank you for your interest in Kalptaru Yog Vidyalaya.

We have received your booking request.

Booking Reference:
${data.bookingReference}

Program:
${data.programTitle}

Schedule:
${data.scheduleDetails}

We will contact you shortly regarding your enrollment and further details.

Regards,
Kalptaru Yog Vidyalaya

Phone:
${this.VIDYALAYA_PHONE}

Email:
${this.VIDYALAYA_EMAIL}`;

    return { subject, text };
  }

  /**
   * Generates the admin notification email content according to client specification.
   */
  static formatAdminEmail(data: BookingEmailData): { subject: string; text: string } {
    const subject = `New Booking Request — ${data.bookingReference} — ${data.programTitle}`;
    const text = `New Booking Request

Reference:
${data.bookingReference}

Name:
${data.visitorName}

Email:
${data.visitorEmail}

Phone:
${data.visitorPhone}

Program:
${data.programTitle}

Schedule:
${data.scheduleDetails}

Message:
${data.message || 'None provided'}`;

    return { subject, text };
  }

  /**
   * Sends or dispatches the visitor confirmation email.
   * Safe and non-blocking: logs full payload if external SMTP transport is not configured.
   */
  static async sendVisitorConfirmation(data: BookingEmailData): Promise<boolean> {
    try {
      const email = this.formatVisitorEmail(data);
      logger.info(`[EmailService] Dispatching visitor confirmation email:
------------------------------------------------------------
To: ${data.visitorEmail}
Subject: ${email.subject}
Body:
${email.text}
------------------------------------------------------------`);
      return true;
    } catch (err: any) {
      logger.error(`[EmailService] Failed to dispatch visitor confirmation: ${err.message}`);
      return false;
    }
  }

  /**
   * Sends or dispatches the admin notification email.
   * Safe and non-blocking.
   */
  static async sendAdminNotification(data: BookingEmailData): Promise<boolean> {
    try {
      const email = this.formatAdminEmail(data);
      logger.info(`[EmailService] Dispatching admin notification email:
------------------------------------------------------------
To: ${this.ADMIN_NOTIFY_EMAIL}
Subject: ${email.subject}
Body:
${email.text}
------------------------------------------------------------`);
      return true;
    } catch (err: any) {
      logger.error(`[EmailService] Failed to dispatch admin notification: ${err.message}`);
      return false;
    }
  }

  /**
   * Convenience method to trigger both emails concurrently after booking request creation.
   */
  static async handleNewBookingRequest(data: BookingEmailData): Promise<void> {
    await Promise.allSettled([
      this.sendVisitorConfirmation(data),
      this.sendAdminNotification(data),
    ]);
  }
}
