const { SendEmailCommand } = require( '@aws-sdk/client-sesv2' );

module.exports = ( client, { to = [], from, html, subject }, args ) =>
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
