import { SSMClient, SSMClientConfig } from '@aws-sdk/client-ssm';
import { get } from './get.js';

/**
 * SSM: Retrieve encrypted parameters.
 * Parameters are cached in Lambda warm starts for performance.
 */
export interface SSM {
  /**
   * Get the value of an SSM Parameter.
   * Values are cached for performance.
   */
  get: typeof get;

  /**
   * Access the underlying SSM client for advanced usage.
   */
  getClient(): SSMClient;

  /**
   * Create a new SSM instance with custom client configuration.
   */
  (config?: SSMClientConfig): SSM;
}

/**
 * SSM: Retrieve encrypted parameters.
 */
export const ssm: SSM;
