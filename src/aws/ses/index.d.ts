import { SESv2Client, SESv2ClientConfig } from '@aws-sdk/client-sesv2';
import { sendEmail } from './send_email.js';
import { deleteSuppressedDestination } from './delete_suppressed_destination.js';
export type { SendEmailCommandOutput } from './send_email.js';
export type { DeleteSuppressedDestinationCommandOutput } from './delete_suppressed_destination.js';

/**
 * SES: Send emails and manage suppression lists.
 */
export interface SES {
  /**
   * Send an email via SES.
   */
  sendEmail: typeof sendEmail;

  /**
   * Remove an email address from the account suppression list.
   */
  deleteSuppressedDestination: typeof deleteSuppressedDestination;

  /**
   * Access the underlying SES client for advanced usage.
   */
  getClient(): SESv2Client;

  /**
   * Create a new SES instance with custom client configuration.
   */
  (config?: SESv2ClientConfig): SES;
}

/**
 * SES: Send emails and manage suppression lists.
 */
export const ses: SES;
