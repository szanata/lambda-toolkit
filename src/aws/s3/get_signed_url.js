import { getSignedDownloadUrl } from './get_signed_download_url.js';

/**
 * @deprecated Use the getSignedDownloadUrl function instead
 */
export const getSignedUrl = async ( client, bucket, key, expiration ) => getSignedDownloadUrl( client, bucket, key, expiration );
