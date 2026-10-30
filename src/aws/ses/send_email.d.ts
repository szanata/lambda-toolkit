import { SendEmailCommandOutput, SendEmailCommandInput } from '@aws-sdk/client-sesv2';

export type { SendEmailCommandOutput };

/**
 * Send an email via SES.
 * 
 * @param options Email options
 * @param options.to Array of recipient email addresses
 * @param options.from Sender email address
 * @param options.subject Email subject line
 * @param options.html HTML email body
 * @param nativeArgs Additional SendEmailCommand arguments (optional)
 * @returns The SDK response
 * 
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { ses } = aws;
 * 
 * await ses.sendEmail({
 *   to: ['user@example.com'],
 *   from: 'noreply@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Welcome</h1>'
 * });
 * ```
 */
export function sendEmail(
  options: {
    to?: string[];
    from: string;
    subject: string;
    html: string;
  },
  nativeArgs?: Partial<SendEmailCommandInput>
): Promise<SendEmailCommandOutput>;
