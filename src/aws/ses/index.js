import { deleteSuppressedDestination } from './delete_suppressed_destination.js';
import { sendEmail } from './send_email.js';
import { SESv2Client } from '@aws-sdk/client-sesv2';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  deleteSuppressedDestination,
  sendEmail
};

export const ses = createInstance( genericClientProvider.bind( null, SESv2Client ), methods );
