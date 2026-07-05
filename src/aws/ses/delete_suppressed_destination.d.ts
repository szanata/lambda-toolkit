import { DeleteSuppressedDestinationCommandOutput } from '@aws-sdk/client-sesv2';

export type { DeleteSuppressedDestinationCommandOutput };

/**
 * Remove an email address from the account suppression list.
 * 
 * @param address Email address to remove
 * @returns The SDK response
 * 
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { ses } = aws;
 * 
 * await ses.deleteSuppressedDestination('user@example.com');
 * ```
 */
export function deleteSuppressedDestination(
  address: string
): Promise<DeleteSuppressedDestinationCommandOutput>;
