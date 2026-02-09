import { copy } from './copy.js';
import { download } from './download.js';
import { getSignedUrl } from './get_signed_url.js';
import { head } from './head.js';
import { upload } from './upload.js';
import { S3Client } from '@aws-sdk/client-s3';
import { genericClientProvider } from '../core/generic_client_provider.js';
import { createInstance } from '../core/create_instance.js';

const methods = {
  copy,
  download,
  getSignedUrl,
  head,
  upload
};

export const s3 = createInstance( genericClientProvider.bind( null, S3Client ), methods );
