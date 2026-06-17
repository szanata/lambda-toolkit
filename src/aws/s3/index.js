import { copy } from './copy.js';
import { download } from './download.js';
import { getSignedDownloadUrl } from './get_signed_download_url.js';
import { getSignedPostUrl } from './get_signed_post_url.js';
import { getSignedUploadUrl } from './get_signed_upload_url.js';
import { getSignedUrl } from './get_signed_url.js';
import { head } from './head.js';
import { upload } from './upload.js';
import { S3Client } from '@aws-sdk/client-s3';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  copy,
  download,
  getSignedDownloadUrl,
  getSignedPostUrl,
  getSignedUploadUrl,
  getSignedUrl,
  head,
  upload
};

export const s3 = createInstance( genericClientProvider.bind( null, S3Client ), methods );
