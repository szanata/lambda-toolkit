import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const outputs = JSON.parse( readFileSync( process.env.INFRA_OUTPUTS, 'utf-8' ) );

/**
 * Reads a Terraform output value written by `ops/integration/run.sh`.
 * @param {String} name The output name
 * @returns {*} The output value
 */
export const infraOutput = name => {
  if ( !Object.keys( outputs ).includes( name ) ) {
    throw new Error( `Terraform output "${name}" not found in ${process.env.INFRA_OUTPUTS}` );
  }
  return outputs[name].value;
};

// Endpoint and credentials come from the AWS_* env vars of the compose service
export const clientConfig = { forcePathStyle: true };

/**
 * Unique prefix per test run (S3 keys, item ids, message attributes...), so runs never collide.
 * @returns {String} The prefix
 */
export const runPrefix = () => `integration/${Date.now()}-${randomUUID()}`;
