import { SendEmailCommand } from '@aws-sdk/client-sesv2';

export const sendEmail = ( client, { to = [], from, html, subject }, args ) =>
  client.send( new SendEmailCommand( {
    Destination: {
      ToAddresses: to
    },
    Content: {
      Simple: {
        Body: {
          Html: {
            Data: html,
            Charset: 'utf-8'
          }
        },
        Subject: {
          Data: subject
        }
      }
    },
    FromEmailAddress: from,
    ...args
  } ) );
